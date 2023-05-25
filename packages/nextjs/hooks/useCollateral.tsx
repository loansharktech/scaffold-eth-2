import { useCallback, useState } from "react";
import { useContractRead } from "wagmi";
import { useContractWrite } from "wagmi";
import { useAccount } from "~~/hooks/useAccount";
import { Market, Realm } from "~~/hooks/useRealm";
import * as toast from "~~/services/toast";
import { ContractName } from "~~/utils/scaffold-eth/contract";

export function useCollateral(realm: Realm, market: Market) {
  const { address } = useAccount();
  const contract = realm.contract.contracts.Comptroller;
  const cTokenContract = realm.contract.contracts[market.cToken as ContractName];
  const [loading, setLoading] = useState(false);

  const { data: isMember, refetch } = useContractRead({
    ...contract,
    functionName: "checkMembership",
    args: [address, cTokenContract.address],
    watch: true,
  });

  const { writeAsync: _enterMarkets } = useContractWrite({
    mode: "recklesslyUnprepared",
    ...contract,
    functionName: "enterMarkets",
    chainId: parseInt(realm.contract.chainId),
    args: [[cTokenContract.address]],
  } as any);

  const { writeAsync: _exitMarket } = useContractWrite({
    mode: "recklesslyUnprepared",
    ...contract,
    functionName: "exitMarket",
    chainId: parseInt(realm.contract.chainId),
    args: [cTokenContract.address],
  } as any);

  const enterMarkets = useCallback(async () => {
    if (!_enterMarkets) {
      return;
    }
    try {
      setLoading(true);
      const res = await _enterMarkets();

      const transReceipt = await res.wait();
      if (transReceipt.status === 0) {
        throw new Error("Enter market fail");
      }
      await refetch();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [_enterMarkets, refetch]);

  const exitMarket = useCallback(async () => {
    if (!_exitMarket) {
      return;
    }
    try {
      setLoading(true);
      const res = await _exitMarket();

      const transReceipt = await res.wait();
      if (transReceipt.status === 0) {
        throw new Error("Exit market fail");
      }
      await refetch();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [_exitMarket, refetch]);

  return {
    isMember: isMember as boolean,
    enterMarkets,
    exitMarket,
    loading,
  };
}
