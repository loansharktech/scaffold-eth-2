import { useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import { BigNumber as EBigNumber, ethers } from "ethers";
import redstone from "redstone-api";
import { useContractRead, useContractReads } from "wagmi";
import abi from "~~/abi/comptroller.json";
import { RealmConfig, RealmType, Token, realms } from "~~/configs/pool";
import contracts from "~~/generated/deployedContracts";
import { useAccount } from "~~/hooks/useAccount";
import { getContract } from "~~/services/redstone";
import { p18 } from "~~/utils/amount";
import { ContractName, RealmContract } from "~~/utils/scaffold-eth/contract";

export type Market = {
  address: string;
  cToken: string;
  token: string;
};

export type MarketData = {
  cash?: BigNumber;
  price?: BigNumber;
  value?: BigNumber;
  totalSupply?: BigNumber;
  exchangeRate?: BigNumber;
  supply?: BigNumber;
  totalBorrows?: BigNumber;
  borrow?: BigNumber;
  balance?: BigNumber;
  supplyRatePerBlock?: BigNumber;
  supplyAPY?: BigNumber;
  borrowAPY?: BigNumber;
  tokenSupplyAPY?: BigNumber;
  tokenBorrowAPY?: BigNumber;
  netAPY?: BigNumber;
  borrowBalanceStored?: BigNumber;
  borrowRatePerBlock?: BigNumber;
  deposit?: BigNumber;
  userBorrowed?: BigNumber;
  markets?: [boolean, BigNumber, boolean];
  borrowLimit?: BigNumber;
  borrowLimitPrice?: BigNumber;
  token: Token;
  address: string;
  borrowCaps?: BigNumber;
  collateralBalance?: BigNumber;
  collateralPrice?: BigNumber;
  isMember?: boolean;
};

export type Realm = {
  [key in string]?: MarketData;
} & {
  totalValueLocked?: BigNumber;
  totalSupply?: BigNumber;
  totalBorrow?: BigNumber;
  netAPY?: BigNumber;
  deposit?: BigNumber;
  totalUserBorrowed?: BigNumber;
  totalUserLimit?: BigNumber;
  userBorrowLimit?: BigNumber;
  markets?: Market[];
  config?: RealmConfig;
  contract: RealmContract;
  collateralBalance?: BigNumber;
  collateralPrice?: BigNumber;
  accountLiquidity?: [BigNumber, BigNumber, BigNumber];
};

function processContractValue(data: string | boolean | EBigNumber) {
  if (typeof data === "boolean" || typeof data === "string") {
    return data;
  } else {
    return new BigNumber(data.toString());
  }
}

export function useRealm(realmType: RealmType) {
  const realmInfo = realms.find(realm => {
    return realm.id === realmType;
  });

  const { address } = useAccount();

  // @ts-ignore
  const realmContracts = contracts[realmInfo.key]?.[0];

  const [realm, setRealm] = useState<Realm>({
    contract: realmContracts,
  } as Realm);

  const { data: marketAddresses = [] } = useContractRead({
    ...realmContracts.contracts.Comptroller,
    functionName: "getAllMarkets",
  });

  const calls = [] as any;

  const contractAddressName = {} as any;

  Object.keys(realmContracts.contracts).forEach(name => {
    const contract = realmContracts.contracts[name as ContractName];
    contractAddressName[contract.address] = name;
  });

  const marketContracts = (marketAddresses as string[])
    .map(market => {
      return Object.values(realmContracts.contracts).find(contract => {
        return contract.address === market;
      });
    })
    .filter(contract => {
      const names = realmInfo?.markets.map(market => {
        return market.cToken;
      });
      return names?.includes(contractAddressName[contract?.address as any]);
    });

  const avaliableMarkets = realmInfo!.markets.map(market => {
    const address = realmContracts.contracts[market.cToken].address;
    return {
      ...market,
      address,
    };
  });

  marketContracts.forEach(marketContract => {
    if (!marketContract) {
      return;
    }
    const SimplePriceOracleContract = realmContracts.contracts.SimplePriceOracle;
    const ComptrollerContract = realmContracts.contracts.Comptroller;
    calls.push({
      ...marketContract,
      functionName: "getCash",
      chainId: parseInt(realmContracts.chainId),
    });
    calls.push({
      ...SimplePriceOracleContract,
      functionName: "getUnderlyingPrice",
      args: [marketContract.address],
      chainId: parseInt(realmContracts.chainId),
    });
    calls.push({
      ...marketContract,
      functionName: "totalSupply",
      chainId: parseInt(realmContracts.chainId),
    });
    calls.push({
      ...marketContract,
      functionName: "exchangeRateStored",
      chainId: parseInt(realmContracts.chainId),
    });
    calls.push({
      ...marketContract,
      functionName: "totalBorrows",
      chainId: parseInt(realmContracts.chainId),
    });
    calls.push({
      ...marketContract,
      functionName: "balanceOf",
      chainId: parseInt(realmContracts.chainId),
      args: [address],
    });
    calls.push({
      ...marketContract,
      functionName: "supplyRatePerBlock",
      chainId: parseInt(realmContracts.chainId),
    });
    calls.push({
      ...marketContract,
      functionName: "borrowBalanceStored",
      chainId: parseInt(realmContracts.chainId),
      args: [address],
    });
    calls.push({
      ...marketContract,
      functionName: "borrowRatePerBlock",
      chainId: parseInt(realmContracts.chainId),
    });
    calls.push({
      ...ComptrollerContract,
      functionName: "markets",
      chainId: parseInt(realmContracts.chainId),
      args: [marketContract.address],
    });
    calls.push({
      ...ComptrollerContract,
      functionName: "borrowCaps",
      chainId: parseInt(realmContracts.chainId),
      args: [marketContract.address],
    });
    calls.push({
      ...ComptrollerContract,
      functionName: "checkMembership",
      chainId: parseInt(realmContracts.chainId),
      args: [address, marketContract.address],
    });
  });

  const { data, refetch } = useContractReads({
    scopeKey: "market",
    contracts: calls,
    watch: true,
    cacheOnBlock: true,
    keepPreviousData: true,
    allowFailure: true,
    staleTime: 500,
    // @ts-ignore
    structuralSharing: (prev, next) => {
      const prevData = JSON.stringify(prev);
      const nextData = JSON.stringify(next);
      if (prevData === nextData) {
        return prev;
      }
      return next;
    },
  });

  const props = [
    "cash",
    "price",
    "totalSupply",
    "exchangeRate",
    "totalBorrows",
    "balance",
    "supplyRatePerBlock",
    "borrowBalanceStored",
    "borrowRatePerBlock",
    "markets",
    "borrowCaps",
    "isMember",
  ] as (
    | "cash"
    | "price"
    | "totalSupply"
    | "exchangeRate"
    | "totalBorrows"
    | "balance"
    | "supplyRatePerBlock"
    | "borrowBalanceStored"
    | "borrowRatePerBlock"
    | "markets"
    | "borrowCaps"
    | "isMember"
  )[];

  useEffect(() => {
    async function fetchMyAPI() {
      const price1 = await redstone.getPrice("USDC");
      const price2 = await redstone.getPrice("ETH");
      const priceArray = new Map();
      priceArray.set("USDC", ethers.utils.parseUnits(price1.value.toString()));
      priceArray.set("WETH", ethers.utils.parseUnits(price2.value.toString()));
      priceArray.set("ETH", ethers.utils.parseUnits(price2.value.toString()));

      const wrappedContract = await getContract(realm.contract.contracts.Comptroller.address, abi);
      let accountLiquidtityResult = undefined;
      try {
        const res = await wrappedContract.getAccountLiquidity(address);
        accountLiquidtityResult = res.map((item: any) => {
          return processContractValue(item);
        });
        accountLiquidtityResult[1] = accountLiquidtityResult[1].div(1e8);
      } catch (e) {
        console.error("fetch getAccountLiquidity fail");
      }

      const result = {} as Realm;
      data?.forEach((item, index) => {
        const marketIndex = Math.floor(index / props.length);
        const propIndex = index % props.length;
        const marketContract = marketContracts[marketIndex]!;
        const prop = props[propIndex];

        if (!result[marketContract.address]) {
          const market = realmInfo!.markets.find(market => {
            return market.cToken === contractAddressName[marketContract.address];
          })!;
          result[marketContract.address] = {
            token: realmInfo!.tokens.find(token => {
              return token.name === market.token;
            })!,
            address: marketContract.address,
          };
        }
        if (!item) {
          result[marketContract.address]![prop] = undefined;
        } else if (prop === "price") {
          const market = realmInfo!.markets.find(market => {
            return market.cToken === contractAddressName[marketContract.address];
          })!;

          // @ts-ignore
          result[marketContract.address].price = processContractValue(priceArray.get(market.token))?.div(p18);
        } else if (prop === "exchangeRate") {
          // @ts-ignore
          result[marketContract.address].exchangeRate = processContractValue(item)?.div(p18);
        } else if (Array.isArray(item)) {
          // @ts-ignore
          result[marketContract.address][prop] = item.map(value => {
            return processContractValue(value);
          });
        } else {
          // @ts-ignore
          result[marketContract.address][prop] = processContractValue(item);
        }
      });

      let marketTotalValueLocked = new BigNumber(0);
      let marketTotalSupply = new BigNumber(0);
      let marketTotalBorrow = new BigNumber(0);
      let marketDeposit = new BigNumber(0);
      let totalUserBorrowed = new BigNumber(0);
      let totalUserLimit = new BigNumber(0);
      let totalCollateralBalance = new BigNumber(0);
      let totalCollateralPrice = new BigNumber(0);

      let netAPYSUM = new BigNumber(0);
      let supplyAmountSUM = new BigNumber(0);
      let borrowAmountSUM = new BigNumber(0);

      marketContracts.forEach(marketContract => {
        const marketAddress = marketContract!.address;
        if (!result || !result[marketAddress]) {
          return;
        }
        const {
          cash,
          price,
          exchangeRate,
          totalSupply,
          totalBorrows,
          balance,
          supplyRatePerBlock,
          borrowRatePerBlock,
          borrowBalanceStored,
          markets,
          isMember,
        } = result[marketAddress]!;
        if (price && cash) {
          result[marketAddress]!.value = cash.div(p18).multipliedBy(price);
          marketTotalValueLocked = marketTotalValueLocked.plus(result[marketAddress]!.value!);
        }
        if (totalSupply && exchangeRate && price) {
          result[marketAddress]!.supply = totalSupply.div(p18).multipliedBy(exchangeRate).multipliedBy(price);
          marketTotalSupply = marketTotalSupply.plus(result[marketAddress]!.supply!);
        }
        if (totalBorrows && exchangeRate && price) {
          result[marketAddress]!.borrow = totalBorrows.div(p18).multipliedBy(price);
          marketTotalBorrow = marketTotalBorrow.plus(result[marketAddress]!.borrow!);
        }
        if (balance && supplyRatePerBlock && exchangeRate && price) {
          const supplyAmount = balance.div(p18).multipliedBy(price).multipliedBy(exchangeRate);
          result[marketAddress]!.supplyAPY = supplyAmount.multipliedBy(
            supplyRatePerBlock.div(p18).multipliedBy(7200).plus(1).pow(365).minus(1),
          );
          supplyAmountSUM = supplyAmountSUM.plus(supplyAmount);
        }

        if (supplyRatePerBlock) {
          result[marketAddress]!.tokenSupplyAPY = supplyRatePerBlock
            ?.div(p18)
            .multipliedBy(7200)
            .plus(1)
            .pow(365)
            .minus(1);
        }
        if (borrowRatePerBlock) {
          result[marketAddress]!.tokenBorrowAPY = borrowRatePerBlock
            ?.div(p18)
            .multipliedBy(7200)
            .plus(1)
            .pow(365)
            .minus(1);
        }
        if (borrowBalanceStored && borrowRatePerBlock && exchangeRate && price) {
          const borrowAmount = borrowBalanceStored.div(p18).multipliedBy(exchangeRate).multipliedBy(price);
          result[marketAddress]!.borrowAPY = borrowAmount.multipliedBy(
            borrowRatePerBlock.div(p18).multipliedBy(7200).plus(1).pow(365).minus(1),
          );
          borrowAmountSUM = borrowAmountSUM.plus(borrowAmount);
        }
        if (result[marketAddress]!.borrowAPY && result[marketAddress]!.supplyAPY) {
          result[marketAddress]!.netAPY = result[marketAddress]!.supplyAPY?.minus(
            result[marketAddress]!.borrowAPY as any,
          );
          netAPYSUM = netAPYSUM.plus(result[marketAddress]!.netAPY!);
        }
        if (balance && price && exchangeRate && typeof isMember !== "undefined") {
          result[marketAddress]!.deposit = balance.div(p18).multipliedBy(price).multipliedBy(exchangeRate);
          marketDeposit = marketDeposit.plus(result[marketAddress]!.deposit!);
          if (isMember) {
            result[marketAddress]!.collateralBalance = balance.div(p18).multipliedBy(exchangeRate);
            result[marketAddress]!.collateralPrice = result[marketAddress]!.collateralBalance?.multipliedBy(price);
            totalCollateralBalance = totalCollateralBalance.plus(result[marketAddress]!.collateralBalance!);
            totalCollateralPrice = totalCollateralPrice.plus(result[marketAddress]!.collateralPrice!);
          }
        }
        if (exchangeRate && borrowBalanceStored && price) {
          result[marketAddress]!.userBorrowed = borrowBalanceStored.div(p18).multipliedBy(price);
          totalUserBorrowed = totalUserBorrowed.plus(result[marketAddress]!.userBorrowed!);
        }
        if (markets && balance && price && exchangeRate) {
          result[marketAddress]!.borrowLimit = markets[1]
            .div(p18)
            .multipliedBy(balance)
            .div(p18)
            .multipliedBy(exchangeRate);
          result[marketAddress]!.borrowLimitPrice = result[marketAddress]!.borrowLimit?.multipliedBy(price);
          totalUserLimit = totalUserLimit.plus(result[marketAddress]!.borrowLimitPrice!);
        }
      });

      result.totalValueLocked = marketTotalValueLocked;
      result.deposit = marketDeposit;

      result.netAPY = supplyAmountSUM.eq(0) ? new BigNumber(0) : netAPYSUM.div(supplyAmountSUM);
      result.totalBorrow = marketTotalBorrow;
      result.totalSupply = marketTotalSupply;
      result.totalUserBorrowed = totalUserBorrowed;
      result.accountLiquidity = accountLiquidtityResult;
      result.totalUserLimit = (result.accountLiquidity?.[1] || new BigNumber(0)).plus(totalUserBorrowed);
      result.userBorrowLimit = result.totalUserBorrowed.div(result.totalUserLimit);
      if (result.userBorrowLimit.isNaN()) {
        result.userBorrowLimit = new BigNumber(0);
      }
      result.markets = avaliableMarkets;
      result.config = realmInfo;
      result.contract = realmContracts;
      result.collateralBalance = totalCollateralBalance;
      result.collateralPrice = totalCollateralPrice;
      console.log("update realm", result);
      setRealm(result);
    }

    fetchMyAPI();
  }, [data, address]);

  return {
    realm,
    refetch,
  };
}
