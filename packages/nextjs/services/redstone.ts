import { WrapperBuilder } from "@redstone-finance/evm-connector";
import { Contract, ethers } from "ethers";

export async function getContract(contractAddr: string, abi: any) {
  const ethereum = (window as any).ethereum;
  const accounts = await ethereum.request({
    method: "eth_requestAccounts",
  });

  const provider = new ethers.providers.Web3Provider(ethereum);
  const walletAddress = accounts[0];

  const signer = provider.getSigner(walletAddress);
  const yourEthersContract = new Contract(contractAddr, abi, signer);
  const redstoneCacheLayerUrls = ["https://d33trozg86ya9x.cloudfront.net"];
  const test = {
    dataServiceId: "redstone-main-demo",
    uniqueSignersCount: 1,
    dataFeeds: ["USDC", "ETH"],
    urls: redstoneCacheLayerUrls,
  };
  const wrappedContract = WrapperBuilder.wrap(yourEthersContract).usingDataService(test);
  return wrappedContract;
}
