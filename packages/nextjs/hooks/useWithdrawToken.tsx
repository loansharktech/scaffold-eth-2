import { useCallback, useEffect } from "react";
import BigNumber from "bignumber.js";
import { ethers } from "ethers";
import { useWaitForTransaction } from "wagmi";
import abi from "~~/abi/market.json";
import { useAccount } from "~~/hooks/useAccount";
import { Market, Realm } from "~~/hooks/useRealm";
import { getContract } from "~~/services/redstone";
import * as toast from "~~/services/toast";
import store, { actions, useTypedSelector } from "~~/stores";
import { TradeStep } from "~~/stores/reducers/trade";
import { switchNetwork } from "~~/wagmi/actions";

export function useWithdrawToken(realm: Realm, market: Market) {
  const { isLogin, login, chain } = useAccount();

  const tradeData = useTypedSelector(state => {
    return state.trade.withdraw;
  });

  const { status: withdrawTransStatus } = useWaitForTransaction({
    hash: tradeData.executeTx as any,
    chainId: parseInt(realm.contract.chainId),
  });

  const withdraw = useCallback(async () => {
    if (!isLogin) {
      return login();
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

      if (chain?.id !== realm.config?.key) {
        await switchNetwork({
          chainId: realm.config?.key as number,
        });
      }

      const wrappedContract = await getContract(market.address, abi);
      const decimals = realm[market.cToken]?.token.decimals;

      const amounts = ethers.utils.parseUnits(
        tradeData.amount.toFixed(decimals || 18, BigNumber.ROUND_FLOOR),
        decimals || 18,
      );
      const res = await wrappedContract.redeemUnderlying(amounts);

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
      await new Promise(resolve => {
        setTimeout(resolve, 3000);
      });
      toast.success("Withdraw success");
    } catch (e: any) {
      store.dispatch(
        actions.trade.updateWithdraw({
          executeError: e.message,
          stepIndex: TradeStep.ENTER_AMOUNT,
        }),
      );
      toast.error(e.message);
      throw new Error(e.message);
    } finally {
      store.dispatch(
        actions.trade.updateWithdraw({
          executing: false,
        }),
      );
    }
  }, [isLogin, login, tradeData.amount, tradeData.executing, market, chain, realm]);

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
