import { useCallback, useEffect } from "react";
import { ethers } from "ethers";
import { useContractWrite, useWaitForTransaction } from "wagmi";
import { useAccount } from "~~/hooks/useAccount";
import { Market, Realm } from "~~/hooks/useRealm";
import * as toast from "~~/services/toast";
import store, { actions, useTypedSelector } from "~~/stores";
import { TradeStep } from "~~/stores/reducers/trade";
import { ContractName } from "~~/utils/scaffold-eth/contract";

export function useWithdrawToken(realm: Realm, market: Market) {
  const { isLogin, login } = useAccount();

  const tradeData = useTypedSelector(state => {
    return state.trade.withdraw;
  });

  const cTokenContract = realm.contract.contracts[market.cToken as ContractName];

  const { writeAsync: _withdraw } = useContractWrite({
    mode: "recklesslyUnprepared",
    ...cTokenContract,
    functionName: "redeemUnderlying",
    chainId: parseInt(realm.contract.chainId),
    args: [ethers.utils.parseEther(tradeData.amount ? String(tradeData.amount) : "0")],
  } as any);

  const { status: withdrawTransStatus } = useWaitForTransaction({
    hash: tradeData.executeTx as any,
    chainId: parseInt(realm.contract.chainId),
  });

  const withdraw = useCallback(async () => {
    if (!isLogin) {
      return login();
    }

    if (!_withdraw) {
      return;
    }
    if (!tradeData.amount || tradeData.executing) {
      return;
    }
    try {
      store.dispatch(
        actions.trade.updateWithdraw({
          executing: true,
          executeError: undefined,
          executeTx: undefined,
          stepIndex: TradeStep.EXECUTE,
        }),
      );
      const res = await _withdraw();

      store.dispatch(
        actions.trade.updateWithdraw({
          executeTx: res.hash,
        }),
      );
      const transReceipt = await res.wait();
      if (transReceipt.status === 0) {
        throw new Error("Execute fail");
      }
      store.dispatch(
        actions.trade.updateWithdraw({
          stepIndex: TradeStep.ENTER_AMOUNT,
        }),
      );
      toast.success("Withdraw success");
    } catch (e: any) {
      store.dispatch(
        actions.trade.updateWithdraw({
          executeError: e.message,
          stepIndex: TradeStep.ENTER_AMOUNT,
        }),
      );
      toast.error(e.message);
    } finally {
      store.dispatch(
        actions.trade.updateWithdraw({
          executing: false,
        }),
      );
    }
  }, [isLogin, _withdraw, login, tradeData.amount, tradeData.executing]);

  useEffect(() => {
    if (withdrawTransStatus === "error") {
      store.dispatch(
        actions.trade.updateWithdraw({
          approveError: "Execute fail",
          stepIndex: TradeStep.ENTER_AMOUNT,
        }),
      );
    } else if (withdrawTransStatus === "success") {
      store.dispatch(
        actions.trade.updateWithdraw({
          stepIndex: TradeStep.ENTER_AMOUNT,
        }),
      );
    }
  }, [withdrawTransStatus]);

  return {
    ...tradeData,
    withdraw,
  };
}
