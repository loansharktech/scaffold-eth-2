import { useCallback, useEffect } from "react";
import { ethers } from "ethers";
import { useContractWrite, useWaitForTransaction } from "wagmi";
import { useAccount } from "~~/hooks/useAccount";
import { Market, Realm } from "~~/hooks/useRealm";
import * as toast from "~~/services/toast";
import store, { actions, useTypedSelector } from "~~/stores";
import { TradeStep } from "~~/stores/reducers/trade";
import { ContractName } from "~~/utils/scaffold-eth/contract";

export function useBorrowToken(realm: Realm, market: Market) {
  const { isLogin, login } = useAccount();

  const tradeData = useTypedSelector(state => {
    return state.trade.borrow;
  });

  const cTokenContract = realm.contract.contracts[market.cToken as ContractName];

  const { writeAsync: _borrow } = useContractWrite({
    mode: "recklesslyUnprepared",
    ...cTokenContract,
    functionName: "borrow",
    chainId: parseInt(realm.contract.chainId),
    args: [ethers.utils.parseEther(tradeData.amount ? String(tradeData.amount) : "0")],
  } as any);

  const { status: borrowTransStatus } = useWaitForTransaction({
    hash: tradeData.executeTx as any,
    chainId: parseInt(realm.contract.chainId),
  });

  const borrow = useCallback(async () => {
    if (!isLogin) {
      return login();
    }

    if (!_borrow) {
      return;
    }
    if (!tradeData.amount || tradeData.executing) {
      return;
    }
    try {
      store.dispatch(
        actions.trade.updateBorrow({
          executing: true,
          executeError: undefined,
          executeTx: undefined,
          stepIndex: TradeStep.EXECUTE,
        }),
      );
      const res = await _borrow();

      store.dispatch(
        actions.trade.updateBorrow({
          executeTx: res.hash,
        }),
      );
      const transReceipt = await res.wait();
      if (transReceipt.status === 0) {
        throw new Error("Execute fail");
      }
      store.dispatch(
        actions.trade.updateBorrow({
          stepIndex: TradeStep.ENTER_AMOUNT,
        }),
      );
    } catch (e: any) {
      store.dispatch(
        actions.trade.updateBorrow({
          executeError: e.message,
          stepIndex: TradeStep.ENTER_AMOUNT,
        }),
      );
      toast.error(e.message);
    } finally {
      store.dispatch(
        actions.trade.updateBorrow({
          executing: false,
        }),
      );
    }
  }, [isLogin, _borrow, login, tradeData.amount, tradeData.executing]);

  useEffect(() => {
    if (borrowTransStatus === "error") {
      store.dispatch(
        actions.trade.updateBorrow({
          approveError: "Execute fail",
          stepIndex: TradeStep.ENTER_AMOUNT,
        }),
      );
    } else if (borrowTransStatus === "success") {
      store.dispatch(
        actions.trade.updateBorrow({
          stepIndex: TradeStep.ENTER_AMOUNT,
        }),
      );
    }
  }, [borrowTransStatus]);

  return {
    ...tradeData,
    borrow,
  };
}
