import { useCallback, useState } from "react";
import { WrapperBuilder } from "@redstone-finance/evm-connector";
import { ethers } from "ethers";
import { Contract as EthersContract } from "ethers";
import { useContractRead } from "wagmi";
import abi from "~~/abi/comptroller.json";
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

  const _enterMarkets = useCallback(async () => {
    const ethereum = (window as any).ethereum;
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });

    const provider = new ethers.providers.Web3Provider(ethereum);
    const walletAddress = accounts[0]; // first account in MetaMask

    const signer = provider.getSigner(walletAddress);
    const yourEthersContract = new EthersContract(contract.address, abi, signer);
    const redstoneCacheLayerUrls = ["https://d33trozg86ya9x.cloudfront.net"];
    const config = {
      dataServiceId: "redstone-main-demo",
      uniqueSignersCount: 1,
      dataFeeds: ["USDC", "ETH"],
      urls: redstoneCacheLayerUrls,
    };
    const wrappedContract = WrapperBuilder.wrap(yourEthersContract).usingDataService(config);

    const trans = await wrappedContract.enterMarkets([cTokenContract.address]);
    await trans.wait();
  }, [contract, cTokenContract]);

  const _exitMarket = useCallback(async () => {
    const ethereum = (window as any).ethereum;
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });

    const provider = new ethers.providers.Web3Provider(ethereum);
    const walletAddress = accounts[0]; // first account in MetaMask

    const signer = provider.getSigner(walletAddress);
    const yourEthersContract = new EthersContract(contract.address, abi, signer);
    const redstoneCacheLayerUrls = ["https://d33trozg86ya9x.cloudfront.net"];
    const config = {
      dataServiceId: "redstone-main-demo",
      uniqueSignersCount: 1,
      dataFeeds: ["USDC", "ETH"],
      urls: redstoneCacheLayerUrls,
    };
    const wrappedContract = WrapperBuilder.wrap(yourEthersContract).usingDataService(config);

    const trans = await wrappedContract.exitMarket(cTokenContract.address);
    await trans.wait();
  }, [contract, cTokenContract]);

  const enterMarkets = useCallback(async () => {
    if (!_enterMarkets) {
      return;
    }
    try {
      setLoading(true);
      await _enterMarkets();

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
      await _exitMarket();

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
