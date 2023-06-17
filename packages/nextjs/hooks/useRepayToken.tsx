import { useCallback, useEffect } from "react";
import BigNumber from "bignumber.js";
import { BigNumber as EBigNumber, ethers } from "ethers";
import { useContractRead, useContractWrite, useWaitForTransaction } from "wagmi";
import { useAccount } from "~~/hooks/useAccount";
import { Market, Realm } from "~~/hooks/useRealm";
import { getContract } from "~~/services/redstone";
import * as toast from "~~/services/toast";
import store, { actions, useTypedSelector } from "~~/stores";
import { TradeStep } from "~~/stores/reducers/trade";
import { p18 } from "~~/utils/amount";
import { ContractName } from "~~/utils/scaffold-eth/contract";

export function useRepayToken(realm: Realm, market: Market) {
  const marketData = realm[market.address];
  const { isLogin, login, address } = useAccount();

  const tradeData = useTypedSelector(state => {
    return state.trade.repay;
  });

  const tokenContract = realm.contract.contracts[market.token as ContractName];
  const cTokenContract = realm.contract.contracts[market.cToken as ContractName];

  const { data: approveAllowance, refetch } = useContractRead({
    ...tokenContract,
    functionName: "allowance",
    chainId: parseInt(realm.contract.chainId),
    args: [address, marketData?.address],
    watch: true,
  } as any);

  const approveAllowanceAmount = new BigNumber((approveAllowance as any)?.toString() || 0).div(p18);

  const { writeAsync: _tokenApprove } = useContractWrite({
    mode: "recklesslyUnprepared",
    ...tokenContract,
    functionName: "approve",
    chainId: parseInt(realm.contract.chainId),
    args: [marketData?.address, ethers.utils.parseUnits(tradeData.amount?.toFixed(18) || "0", 18)],
  } as any);

  const { status: approveTransStatus } = useWaitForTransaction({
    hash: tradeData.approveTx as any,
    chainId: parseInt(realm.contract.chainId),
  });

  const { writeAsync: tokenRepay } = useContractWrite({
    mode: "recklesslyUnprepared",
    ...cTokenContract,
    functionName: "repayBorrow",
    chainId: parseInt(realm.contract.chainId),
    args: [ethers.utils.parseUnits(tradeData.amount?.toFixed(18) || "0", 18)],
    overrides: {
      // @ts-ignore
      gasLimit: 300000 as any,
    },
  } as any);

  const { status: minteTransStatus } = useWaitForTransaction({
    hash: tradeData.executeTx as any,
    chainId: parseInt(realm.contract.chainId),
  });

  const repay = useCallback(
    async (amount: number) => {
      if (!isLogin) {
        return login();
      }

      if (!tokenRepay) {
        return;
      }
      try {
        store.dispatch(
          actions.trade.updateRepay({
            executing: true,
            executeError: undefined,
            executeTx: undefined,
            stepIndex: TradeStep.EXECUTE,
          }),
        );

        const wrappedContract = await getContract(
          realm.contract.contracts.Maximillion.address,
          realm.contract.contracts.Maximillion.abi,
        );

        let res;
        if (tokenContract) {
          res = await tokenRepay({
            recklesslySetUnpreparedArgs: [
              amount === -1
                ? EBigNumber.from("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")
                : ethers.utils.parseEther(amount.toFixed(18)),
            ],
          });
        } else {
          res = await wrappedContract.repayBehalfExplicit(address, market.address, {
            value: ethers.utils.parseEther(amount.toFixed(18)),
          });
        }

        store.dispatch(
          actions.trade.updateRepay({
            executeTx: res.hash,
          }),
        );
        const transReceipt = await res.wait();
        if (transReceipt.status === 0) {
          throw new Error("Execute fail");
        }
        store.dispatch(
          actions.trade.updateRepay({
            stepIndex: TradeStep.ENTER_AMOUNT,
          }),
        );
        toast.success("Repay success");
      } catch (e: any) {
        store.dispatch(
          actions.trade.updateRepay({
            executeError: e.message,
            stepIndex: TradeStep.ENTER_AMOUNT,
          }),
        );
        toast.error(e.message);
      } finally {
        store.dispatch(
          actions.trade.updateRepay({
            executing: false,
          }),
        );
      }
    },
    [isLogin, tokenRepay, login, tokenContract, market],
  );

  const approveToken = useCallback(async () => {
    if (!isLogin) {
      return login();
    }
    if (!_tokenApprove) {
      return;
    }
    if (!tradeData.amount) {
      return;
    }
    try {
      store.dispatch(
        actions.trade.updateRepay({
          approving: true,
          approveError: undefined,
          approveTx: undefined,
          stepIndex: TradeStep.APPROVE,
        }),
      );
      const res = await _tokenApprove();
      actions.trade.updateRepay({
        approveTx: res.hash,
      });
      const transReceipt = await res.wait();
      if (transReceipt.status === 0) {
        throw new Error("Approve fail");
      }
      store.dispatch(
        actions.trade.updateRepay({
          stepIndex: TradeStep.EXECUTE,
        }),
      );
      await refetch();
    } catch (e: any) {
      store.dispatch(
        actions.trade.updateRepay({
          approveError: e.message,
          stepIndex: TradeStep.ENTER_AMOUNT,
        }),
      );
      toast.error(e.message);
    } finally {
      store.dispatch(
        actions.trade.updateRepay({
          approving: false,
        }),
      );
    }
  }, [isLogin, _tokenApprove, login, tokenContract, tradeData.amount, refetch]);

  useEffect(() => {
    if (approveTransStatus === "error") {
      store.dispatch(
        actions.trade.updateRepay({
          approveError: "Approve fail",
          stepIndex: TradeStep.ENTER_AMOUNT,
        }),
      );
    }
  }, [approveTransStatus]);

  useEffect(() => {
    if (minteTransStatus === "error") {
      store.dispatch(
        actions.trade.updateRepay({
          approveError: "Execute fail",
          stepIndex: TradeStep.ENTER_AMOUNT,
        }),
      );
    } else if (minteTransStatus === "success") {
      store.dispatch(
        actions.trade.updateRepay({
          stepIndex: TradeStep.ENTER_AMOUNT,
        }),
      );
    }
  }, [minteTransStatus]);

  return {
    ...tradeData,
    approveToken,
    repay,
    approveAllowanceAmount,
    isNativeToken: !tokenContract,
  };
}
