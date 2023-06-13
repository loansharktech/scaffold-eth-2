import { useCallback, useEffect } from "react";
import { WrapperBuilder } from "@redstone-finance/evm-connector";
import { Contract as EthersContract, ethers } from "ethers";
import { useWaitForTransaction } from "wagmi";
import abi from "~~/abi/market.json";
import { useAccount } from "~~/hooks/useAccount";
import { Market, Realm } from "~~/hooks/useRealm";
import * as toast from "~~/services/toast";
import store, { actions, useTypedSelector } from "~~/stores";
import { TradeStep } from "~~/stores/reducers/trade";

export function useWithdrawToken(realm: Realm, market: Market) {
  const { isLogin, login } = useAccount();

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

      const ethereum = (window as any).ethereum;
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      const provider = new ethers.providers.Web3Provider(ethereum);
      const walletAddress = accounts[0]; // first account in MetaMask

      const signer = provider.getSigner(walletAddress);
      const yourEthersContract = new EthersContract(market.address, abi, signer);
      const redstoneCacheLayerUrls = ["https://d33trozg86ya9x.cloudfront.net"];
      const test = {
        dataServiceId: "redstone-main-demo",
        uniqueSignersCount: 1,
        dataFeeds: ["USDC", "ETH"],
        urls: redstoneCacheLayerUrls,
      };
      const wrappedContract = WrapperBuilder.wrap(yourEthersContract).usingDataService(test);

      const amounts = ethers.utils.parseUnits(tradeData.amount.toString(), 18);
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
  }, [isLogin, login, tradeData.amount, tradeData.executing, market]);

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
