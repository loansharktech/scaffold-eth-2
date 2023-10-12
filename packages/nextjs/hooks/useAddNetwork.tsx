import { useCallback } from "react";
import { useAccount } from "./useAccount";
import scaffoldConfig from "~~/scaffold.config";

const toHex = (num: number) => {
  return "0x" + num.toString(16);
};

export function useAddNetwork() {
  const { address, login } = useAccount();

  const addNetworkToMetamask = useCallback(async () => {
    if (!address) {
      return login();
    }
    try {
      const network = scaffoldConfig.targetNetwork;

      if (window.ethereum) {
        const rpcUrls = ["https://rpc.scroll.io"];

        const params = {
          chainId: toHex(network.id), // A 0x-prefixed hexadecimal string
          chainName: network.name,
          nativeCurrency: {
            name: network.nativeCurrency.name,
            symbol: network.nativeCurrency.symbol, // 2-6 characters long
            decimals: network.nativeCurrency.decimals,
          },
          rpcUrls,
          blockExplorerUrls: [network.blockExplorers.default.url],
        };

        const result = await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [params, address],
        } as any);

        return result;
      } else {
        throw new Error("No Ethereum Wallet");
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }, [address]);

  return {
    addNetworkToMetamask,
  };
}
