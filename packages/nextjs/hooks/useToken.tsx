import BigNumber from "bignumber.js";
import { useBalance } from "wagmi";
import { useAccount } from "~~/hooks/useAccount";
import { Market, Realm } from "~~/hooks/useRealm";
import { ContractName } from "~~/utils/scaffold-eth/contract";

export function useToken(realm: Realm, market: Market) {
  const marketData = realm[market.address];
  const token = marketData?.token;

  const { address } = useAccount();

  const contract = realm.contract.contracts[token?.name as ContractName];

  const { data: balance } = useBalance({
    address,
    token: contract ? token?.address : "",
    watch: true,
  });

  return {
    balance: balance && new BigNumber(balance?.value?.toString()),
  };
}
