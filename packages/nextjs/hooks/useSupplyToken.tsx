import { useCallback, useEffect } from "react";
import { ethers } from "ethers";
import { useContractWrite, useWaitForTransaction } from "wagmi";
import { useAccount } from "~~/hooks/useAccount";
import { Market, Realm } from "~~/hooks/useRealm";
import * as toast from "~~/services/toast";
import store, { actions, useTypedSelector } from "~~/stores";
import { TradeStep } from "~~/stores/reducers/trade";
import { ContractName } from "~~/utils/scaffold-eth/contract";

export function useSupplyToken(realm: Realm, market: Market) {
  const marketData = realm[market.address];
  const { isLogin, login } = useAccount();

  const tradeData = useTypedSelector(state => {
    return state.trade.supply;
  });

  const tokenContract = realm.contract.contracts[market.token as ContractName];
  const cTokenContract = realm.contract.contracts[market.cToken as ContractName];

  const { writeAsync: _tokenApprove } = useContractWrite({
    mode: "recklesslyUnprepared",
    ...tokenContract,
    functionName: "approve",
    chainId: parseInt(realm.contract.chainId),
    args: [marketData?.address, tradeData.amount],
  } as any);

  const { status: approveTransStatus } = useWaitForTransaction({
    hash: tradeData.approveTx as any,
    chainId: parseInt(realm.contract.chainId),
  });

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
    if (!tokenContract) {
      await mint();
      return;
    }
    try {
      store.dispatch(
        actions.trade.updateSupply({
          approving: true,
          approveError: undefined,
          approveTx: undefined,
          stepIndex: TradeStep.APPROVE,
        }),
      );
      const res = await _tokenApprove();
      actions.trade.updateSupply({
        approveTx: res.hash,
      });
      const transReceipt = await res.wait();
      if (transReceipt.status === 0) {
        throw new Error("Approve fail");
      }
      store.dispatch(
        actions.trade.updateSupply({
          stepIndex: TradeStep.EXECUTE,
        }),
      );
    } catch (e: any) {
      store.dispatch(
        actions.trade.updateSupply({
          approveError: e.message,
          stepIndex: TradeStep.ENTER_AMOUNT,
        }),
      );
      toast.error(e.message);
    } finally {
      store.dispatch(
        actions.trade.updateSupply({
          approving: false,
        }),
      );
    }
  }, [isLogin, _tokenApprove, login, tokenContract, tradeData.amount]);

  const { writeAsync: _mint } = useContractWrite({
    mode: "recklesslyUnprepared",
    ...cTokenContract,
    functionName: "mint",
    chainId: parseInt(realm.contract.chainId),
    args: tokenContract ? [tradeData.amount] : [],
    overrides: {
      value: tokenContract ? 0 : ethers.utils.parseEther(tradeData?.amount ? String(tradeData.amount) : "0"),
    },
  } as any);

  const { status: minteTransStatus } = useWaitForTransaction({
    hash: tradeData.executeTx as any,
    chainId: parseInt(realm.contract.chainId),
  });

  const mint = useCallback(async () => {
    if (!isLogin) {
      return login();
    }

    if (!_mint) {
      return;
    }
    try {
      store.dispatch(
        actions.trade.updateSupply({
          executing: true,
          executeError: undefined,
          executeTx: undefined,
          stepIndex: TradeStep.EXECUTE,
        }),
      );
      const res = await _mint();

      store.dispatch(
        actions.trade.updateSupply({
          executeTx: res.hash,
        }),
      );
      const transReceipt = await res.wait();
      if (transReceipt.status === 0) {
        throw new Error("Execute fail");
      }
      store.dispatch(
        actions.trade.updateSupply({
          stepIndex: TradeStep.ENTER_AMOUNT,
        }),
      );
      toast.success("Supply success");
    } catch (e: any) {
      store.dispatch(
        actions.trade.updateSupply({
          executeError: e.message,
          stepIndex: TradeStep.ENTER_AMOUNT,
        }),
      );
      toast.error(e.message);
    } finally {
      store.dispatch(
        actions.trade.updateSupply({
          executing: false,
        }),
      );
    }
  }, [isLogin, _mint, login]);

  useEffect(() => {
    if (approveTransStatus === "error") {
      store.dispatch(
        actions.trade.updateSupply({
          approveError: "Approve fail",
          stepIndex: TradeStep.ENTER_AMOUNT,
        }),
      );
    } else if (approveTransStatus === "success") {
      mint();
    }
  }, [approveTransStatus, mint]);

  useEffect(() => {
    if (minteTransStatus === "error") {
      store.dispatch(
        actions.trade.updateSupply({
          approveError: "Execute fail",
          stepIndex: TradeStep.ENTER_AMOUNT,
        }),
      );
    } else if (minteTransStatus === "success") {
      store.dispatch(
        actions.trade.updateSupply({
          stepIndex: TradeStep.ENTER_AMOUNT,
        }),
      );
    }
  }, [minteTransStatus]);

  return {
    ...tradeData,
    approveToken,
    mint,
  };
}
