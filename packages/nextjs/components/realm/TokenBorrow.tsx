import { FunctionComponent, useCallback, useRef } from "react";
import Image from "next/image";
import { Button, Input, LoadingOverlay, Select } from "@mantine/core";
import BigNumber from "bignumber.js";
import { useBorrowToken } from "~~/hooks/useBorrowToken";
import type { Market, Realm } from "~~/hooks/useRealm";
import store, { actions } from "~~/stores";
import { amountDesc } from "~~/utils/amount";
import { p18 } from "~~/utils/amount";
import  { ethers }  from "ethers";
import { Contract as EthersContract } from "ethers";
import { WrapperBuilder } from "@redstone-finance/evm-connector";

const abi = [{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"NO_ERROR","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"_acceptAdmin","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"_addReserves","inputs":[{"type":"uint256","name":"addAmount","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"_delegateCompLikeTo","inputs":[{"type":"address","name":"compLikeDelegatee","internalType":"address"}]},{"type":"function","stateMutability":"nonpayable","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"_reduceReserves","inputs":[{"type":"uint256","name":"reduceAmount","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"_setComptroller","inputs":[{"type":"address","name":"newComptroller","internalType":"contract ComptrollerInterface"}]},{"type":"function","stateMutability":"nonpayable","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"_setInterestRateModel","inputs":[{"type":"address","name":"newInterestRateModel","internalType":"contract InterestRateModel"}]},{"type":"function","stateMutability":"nonpayable","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"_setPendingAdmin","inputs":[{"type":"address","name":"newPendingAdmin","internalType":"address payable"}]},{"type":"function","stateMutability":"nonpayable","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"_setReserveFactor","inputs":[{"type":"uint256","name":"newReserveFactorMantissa","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"accrualBlockNumber","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"accrueInterest","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"address payable"}],"name":"admin","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"allowance","inputs":[{"type":"address","name":"owner","internalType":"address"},{"type":"address","name":"spender","internalType":"address"}]},{"type":"function","stateMutability":"nonpayable","outputs":[{"type":"bool","name":"","internalType":"bool"}],"name":"approve","inputs":[{"type":"address","name":"spender","internalType":"address"},{"type":"uint256","name":"amount","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"balanceOf","inputs":[{"type":"address","name":"owner","internalType":"address"}]},{"type":"function","stateMutability":"nonpayable","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"balanceOfUnderlying","inputs":[{"type":"address","name":"owner","internalType":"address"}]},{"type":"function","stateMutability":"nonpayable","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"borrow","inputs":[{"type":"uint256","name":"borrowAmount","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"borrowBalanceCurrent","inputs":[{"type":"address","name":"account","internalType":"address"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"borrowBalanceStored","inputs":[{"type":"address","name":"account","internalType":"address"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"borrowIndex","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"borrowRatePerBlock","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"contract ComptrollerInterface"}],"name":"comptroller","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint8","name":"","internalType":"uint8"}],"name":"decimals","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"exchangeRateCurrent","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"exchangeRateStored","inputs":[]},{"type":"function","stateMutability":"pure","outputs":[{"type":"uint256","name":"extractedTimestamp","internalType":"uint256"}],"name":"extractTimestampsAndAssertAllAreEqual","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"},{"type":"uint256","name":"","internalType":"uint256"},{"type":"uint256","name":"","internalType":"uint256"},{"type":"uint256","name":"","internalType":"uint256"}],"name":"getAccountSnapshot","inputs":[{"type":"address","name":"account","internalType":"address"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"getCash","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"initialize","inputs":[{"type":"address","name":"underlying_","internalType":"address"},{"type":"address","name":"comptroller_","internalType":"contract ComptrollerInterface"},{"type":"address","name":"interestRateModel_","internalType":"contract InterestRateModel"},{"type":"uint256","name":"initialExchangeRateMantissa_","internalType":"uint256"},{"type":"string","name":"name_","internalType":"string"},{"type":"string","name":"symbol_","internalType":"string"},{"type":"uint8","name":"decimals_","internalType":"uint8"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"initialize","inputs":[{"type":"address","name":"comptroller_","internalType":"contract ComptrollerInterface"},{"type":"address","name":"interestRateModel_","internalType":"contract InterestRateModel"},{"type":"uint256","name":"initialExchangeRateMantissa_","internalType":"uint256"},{"type":"string","name":"name_","internalType":"string"},{"type":"string","name":"symbol_","internalType":"string"},{"type":"uint8","name":"decimals_","internalType":"uint8"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"contract InterestRateModel"}],"name":"interestRateModel","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"bool","name":"","internalType":"bool"}],"name":"isCToken","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"liquidateBorrow","inputs":[{"type":"address","name":"borrower","internalType":"address"},{"type":"uint256","name":"repayAmount","internalType":"uint256"},{"type":"address","name":"cTokenCollateral","internalType":"contract CTokenInterface"}]},{"type":"function","stateMutability":"nonpayable","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"mint","inputs":[{"type":"uint256","name":"mintAmount","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"string","name":"","internalType":"string"}],"name":"name","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"address payable"}],"name":"pendingAdmin","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"protocolSeizeShareMantissa","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"redeem","inputs":[{"type":"uint256","name":"redeemTokens","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"redeemUnderlying","inputs":[{"type":"uint256","name":"redeemAmount","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"repayBorrow","inputs":[{"type":"uint256","name":"repayAmount","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"repayBorrowBehalf","inputs":[{"type":"address","name":"borrower","internalType":"address"},{"type":"uint256","name":"repayAmount","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"reserveFactorMantissa","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"seize","inputs":[{"type":"address","name":"liquidator","internalType":"address"},{"type":"address","name":"borrower","internalType":"address"},{"type":"uint256","name":"seizeTokens","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"supplyRatePerBlock","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"sweepToken","inputs":[{"type":"address","name":"token","internalType":"contract EIP20NonStandardInterface"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"string","name":"","internalType":"string"}],"name":"symbol","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"totalBorrows","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"totalBorrowsCurrent","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"totalReserves","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"totalSupply","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[{"type":"bool","name":"","internalType":"bool"}],"name":"transfer","inputs":[{"type":"address","name":"dst","internalType":"address"},{"type":"uint256","name":"amount","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[{"type":"bool","name":"","internalType":"bool"}],"name":"transferFrom","inputs":[{"type":"address","name":"src","internalType":"address"},{"type":"address","name":"dst","internalType":"address"},{"type":"uint256","name":"amount","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"address"}],"name":"underlying","inputs":[]},{"type":"event","name":"AccrueInterest","inputs":[{"type":"uint256","name":"cashPrior","indexed":false},{"type":"uint256","name":"interestAccumulated","indexed":false},{"type":"uint256","name":"borrowIndex","indexed":false},{"type":"uint256","name":"totalBorrows","indexed":false}],"anonymous":false},{"type":"event","name":"Approval","inputs":[{"type":"address","name":"owner","indexed":true},{"type":"address","name":"spender","indexed":true},{"type":"uint256","name":"amount","indexed":false}],"anonymous":false},{"type":"event","name":"Borrow","inputs":[{"type":"address","name":"borrower","indexed":false},{"type":"uint256","name":"borrowAmount","indexed":false},{"type":"uint256","name":"accountBorrows","indexed":false},{"type":"uint256","name":"totalBorrows","indexed":false}],"anonymous":false},{"type":"event","name":"LiquidateBorrow","inputs":[{"type":"address","name":"liquidator","indexed":false},{"type":"address","name":"borrower","indexed":false},{"type":"uint256","name":"repayAmount","indexed":false},{"type":"address","name":"cTokenCollateral","indexed":false},{"type":"uint256","name":"seizeTokens","indexed":false}],"anonymous":false},{"type":"event","name":"Mint","inputs":[{"type":"address","name":"minter","indexed":false},{"type":"uint256","name":"mintAmount","indexed":false},{"type":"uint256","name":"mintTokens","indexed":false}],"anonymous":false},{"type":"event","name":"NewAdmin","inputs":[{"type":"address","name":"oldAdmin","indexed":false},{"type":"address","name":"newAdmin","indexed":false}],"anonymous":false},{"type":"event","name":"NewComptroller","inputs":[{"type":"address","name":"oldComptroller","indexed":false},{"type":"address","name":"newComptroller","indexed":false}],"anonymous":false},{"type":"event","name":"NewMarketInterestRateModel","inputs":[{"type":"address","name":"oldInterestRateModel","indexed":false},{"type":"address","name":"newInterestRateModel","indexed":false}],"anonymous":false},{"type":"event","name":"NewPendingAdmin","inputs":[{"type":"address","name":"oldPendingAdmin","indexed":false},{"type":"address","name":"newPendingAdmin","indexed":false}],"anonymous":false},{"type":"event","name":"NewReserveFactor","inputs":[{"type":"uint256","name":"oldReserveFactorMantissa","indexed":false},{"type":"uint256","name":"newReserveFactorMantissa","indexed":false}],"anonymous":false},{"type":"event","name":"Redeem","inputs":[{"type":"address","name":"redeemer","indexed":false},{"type":"uint256","name":"redeemAmount","indexed":false},{"type":"uint256","name":"redeemTokens","indexed":false}],"anonymous":false},{"type":"event","name":"RepayBorrow","inputs":[{"type":"address","name":"payer","indexed":false},{"type":"address","name":"borrower","indexed":false},{"type":"uint256","name":"repayAmount","indexed":false},{"type":"uint256","name":"accountBorrows","indexed":false},{"type":"uint256","name":"totalBorrows","indexed":false}],"anonymous":false},{"type":"event","name":"ReservesAdded","inputs":[{"type":"address","name":"benefactor","indexed":false},{"type":"uint256","name":"addAmount","indexed":false},{"type":"uint256","name":"newTotalReserves","indexed":false}],"anonymous":false},{"type":"event","name":"ReservesReduced","inputs":[{"type":"address","name":"admin","indexed":false},{"type":"uint256","name":"reduceAmount","indexed":false},{"type":"uint256","name":"newTotalReserves","indexed":false}],"anonymous":false},{"type":"event","name":"Transfer","inputs":[{"type":"address","name":"from","indexed":true},{"type":"address","name":"to","indexed":true},{"type":"uint256","name":"amount","indexed":false}],"anonymous":false},{"type":"error","name":"AcceptAdminPendingAdminCheck","inputs":[]},{"type":"error","name":"AddReservesFactorFreshCheck","inputs":[{"type":"uint256","name":"actualAddAmount","internalType":"uint256"}]},{"type":"error","name":"BorrowCashNotAvailable","inputs":[]},{"type":"error","name":"BorrowComptrollerRejection","inputs":[{"type":"uint256","name":"errorCode","internalType":"uint256"}]},{"type":"error","name":"BorrowFreshnessCheck","inputs":[]},{"type":"error","name":"CalldataMustHaveValidPayload","inputs":[]},{"type":"error","name":"CalldataOverOrUnderFlow","inputs":[]},{"type":"error","name":"DataPackageTimestampMustNotBeZero","inputs":[]},{"type":"error","name":"DataPackageTimestampsMustBeEqual","inputs":[]},{"type":"error","name":"EachSignerMustProvideTheSameValue","inputs":[]},{"type":"error","name":"EmptyCalldataPointersArr","inputs":[]},{"type":"error","name":"IncorrectUnsignedMetadataSize","inputs":[]},{"type":"error","name":"InsufficientNumberOfUniqueSigners","inputs":[{"type":"uint256","name":"receivedSignersCount","internalType":"uint256"},{"type":"uint256","name":"requiredSignersCount","internalType":"uint256"}]},{"type":"error","name":"InvalidCalldataPointer","inputs":[]},{"type":"error","name":"LiquidateAccrueBorrowInterestFailed","inputs":[{"type":"uint256","name":"errorCode","internalType":"uint256"}]},{"type":"error","name":"LiquidateAccrueCollateralInterestFailed","inputs":[{"type":"uint256","name":"errorCode","internalType":"uint256"}]},{"type":"error","name":"LiquidateCloseAmountIsUintMax","inputs":[]},{"type":"error","name":"LiquidateCloseAmountIsZero","inputs":[]},{"type":"error","name":"LiquidateCollateralFreshnessCheck","inputs":[]},{"type":"error","name":"LiquidateComptrollerRejection","inputs":[{"type":"uint256","name":"errorCode","internalType":"uint256"}]},{"type":"error","name":"LiquidateFreshnessCheck","inputs":[]},{"type":"error","name":"LiquidateLiquidatorIsBorrower","inputs":[]},{"type":"error","name":"LiquidateRepayBorrowFreshFailed","inputs":[{"type":"uint256","name":"errorCode","internalType":"uint256"}]},{"type":"error","name":"LiquidateSeizeComptrollerRejection","inputs":[{"type":"uint256","name":"errorCode","internalType":"uint256"}]},{"type":"error","name":"LiquidateSeizeLiquidatorIsBorrower","inputs":[]},{"type":"error","name":"MintComptrollerRejection","inputs":[{"type":"uint256","name":"errorCode","internalType":"uint256"}]},{"type":"error","name":"MintFreshnessCheck","inputs":[]},{"type":"error","name":"ProxyCalldataFailedWithCustomError","inputs":[{"type":"bytes","name":"result","internalType":"bytes"}]},{"type":"error","name":"ProxyCalldataFailedWithStringMessage","inputs":[{"type":"string","name":"message","internalType":"string"}]},{"type":"error","name":"ProxyCalldataFailedWithoutErrMsg","inputs":[]},{"type":"error","name":"RedeemComptrollerRejection","inputs":[{"type":"uint256","name":"errorCode","internalType":"uint256"}]},{"type":"error","name":"RedeemFreshnessCheck","inputs":[]},{"type":"error","name":"RedeemTransferOutNotPossible","inputs":[]},{"type":"error","name":"RedstonePayloadMustHaveAtLeastOneDataPackage","inputs":[]},{"type":"error","name":"ReduceReservesAdminCheck","inputs":[]},{"type":"error","name":"ReduceReservesCashNotAvailable","inputs":[]},{"type":"error","name":"ReduceReservesCashValidation","inputs":[]},{"type":"error","name":"ReduceReservesFreshCheck","inputs":[]},{"type":"error","name":"RepayBorrowComptrollerRejection","inputs":[{"type":"uint256","name":"errorCode","internalType":"uint256"}]},{"type":"error","name":"RepayBorrowFreshnessCheck","inputs":[]},{"type":"error","name":"SetComptrollerOwnerCheck","inputs":[]},{"type":"error","name":"SetInterestRateModelFreshCheck","inputs":[]},{"type":"error","name":"SetInterestRateModelOwnerCheck","inputs":[]},{"type":"error","name":"SetPendingAdminOwnerCheck","inputs":[]},{"type":"error","name":"SetReserveFactorAdminCheck","inputs":[]},{"type":"error","name":"SetReserveFactorBoundsCheck","inputs":[]},{"type":"error","name":"SetReserveFactorFreshCheck","inputs":[]},{"type":"error","name":"SignerNotAuthorised","inputs":[{"type":"address","name":"receivedSigner","internalType":"address"}]},{"type":"error","name":"TransferComptrollerRejection","inputs":[{"type":"uint256","name":"errorCode","internalType":"uint256"}]},{"type":"error","name":"TransferNotAllowed","inputs":[]},{"type":"error","name":"TransferNotEnough","inputs":[]},{"type":"error","name":"TransferTooMuch","inputs":[]}];

const borrow = async (marketAddress: string, amount: number | undefined) => {
  const ethereum = (window as any).ethereum;
  const accounts = await ethereum.request({
    method: "eth_requestAccounts",
  });

  const provider = new ethers.providers.Web3Provider(ethereum)
  const walletAddress = accounts[0]    // first account in MetaMask

  const signer = provider.getSigner(walletAddress)
  const yourEthersContract = new EthersContract(
    marketAddress, 
    abi, 
    signer);
    const redstoneCacheLayerUrls = [
      "https://d33trozg86ya9x.cloudfront.net"
    ];
    const test = {
      dataServiceId: "redstone-main-demo",
      uniqueSignersCount: 1,
      dataFeeds: ["USDC", "ETH"],
      urls: redstoneCacheLayerUrls
    };
    const wrappedContract = WrapperBuilder.wrap(yourEthersContract).usingDataService(
      test
    );

    if (amount) {
      const amounts = ethers.utils.parseUnits(amount.toString(), 18);
      const result = await wrappedContract.borrow(amounts);
    }
}

const TokenBorrow: FunctionComponent<{
  market: Market;
  onChangeMarket: any;
  realm: Realm;
}> = ({ realm, market, onChangeMarket }) => {
  const selectRef = useRef<any>();
  const marketData = realm[market.address];
  const tokenSelectList =
    realm.markets?.map(market => {
      const marketData = realm[market.address];
      return {
        icon: marketData!.token.icon,
        value: market.address,
        label: market.token.toUpperCase(),
      };
    }) || [];

  const borrowToken = useBorrowToken(realm, market);

  const amountPrice = new BigNumber(borrowToken.amount || 0)?.multipliedBy(marketData?.price || 0);
  const borrowLimitPrice = realm?.totalUserLimit || new BigNumber(0);

  const borrowAmount = marketData?.borrowBalanceStored?.div(p18);
  const borrowPrice = borrowAmount?.multipliedBy(marketData?.price || 0);

  const totalBorrow = marketData?.totalBorrows?.div(p18);
  const totalBorrowPrice = totalBorrow?.multipliedBy(marketData?.price || 0);
  const globalBorrowPrice = realm.totalUserBorrowed;

  let _C = new BigNumber(borrowToken.amount || 0).multipliedBy(marketData?.price || 0);
  if (!marketData?.isMember) {
    _C = new BigNumber(0);
  }
  const borrowUtilization1 = !borrowLimitPrice.eq(0)
    ? _C
        .plus(globalBorrowPrice || 0)
        .div(borrowLimitPrice)
        .multipliedBy(100)
        .toNumber()
    : 0;
  const borrowUtilization2 = !borrowLimitPrice.eq(0) ? _C.div(borrowLimitPrice).multipliedBy(100).toNumber() : 0;

  const borrowCaps = marketData?.borrowCaps?.div(p18) || new BigNumber(0);

  const borrowAPY = marketData?.tokenBorrowAPY?.multipliedBy(100).toNumber() || 0;

  const maxAmount = marketData?.price
    ? realm.totalUserLimit?.minus(realm.totalUserBorrowed || 0).div(marketData.price)
    : new BigNumber(0);

  const changeAmount = useCallback((amount: number | undefined | "") => {
    store.dispatch(
      actions.trade.updateBorrow({
        amount: amount || undefined,
      }),
    );
  }, []);

  const isInsufficientBalance = (borrowToken.amount || 0) > (maxAmount?.toNumber() || 0);

  if (!marketData) {
    return null;
  }

  return (
    <div className="relative">
      <LoadingOverlay visible={borrowToken.executing} overlayBlur={2}></LoadingOverlay>
      <div className="flex items-center justify-between">
        <div className="font-bold text-xl"></div>
        <div className="flex items-center">
          <span className="text-sm text-[#3481BD] mr-2">
            Max: {maxAmount?.toFormat(2, BigNumber.ROUND_FLOOR)} {market.token}
          </span>
          <div
            className="action font-extrabold text-[#3481BD]"
            onClick={() => {
              changeAmount((maxAmount?.toNumber() || 0) * 0.8);
            }}
          >
            80%
          </div>
        </div>
      </div>
      <div className="mt-2 flex gap-1 flex-col sm:flex-row sm:items-center">
        <Select
          size="lg"
          classNames={{
            input: "border-none bg-[#F0F5F9] rounded-[12px]",
            root: "sm:w-[145px]",
          }}
          styles={{ rightSection: { pointerEvents: "none" } }}
          value={market.address}
          data={tokenSelectList}
          onChange={onChangeMarket}
          rightSectionWidth={70}
          ref={selectRef}
          rightSection={<Image alt={marketData.token.name} src={marketData.token.icon} width={32} height={32}></Image>}
        />
        <Input
          placeholder="0.00"
          classNames={{
            wrapper: "flex-1",
            input:
              "bg-[#F0F5F9] h-[50px] border-none bg-[#F0F5F9] rounded-[12px] text-lg font-bold placeholder:text-[#9CA3AF]",
          }}
          max={maxAmount?.toNumber()}
          value={borrowToken.amount}
          type="number"
          onChange={e => {
            changeAmount(parseFloat(e.currentTarget.value));
          }}
          styles={{ rightSection: { pointerEvents: "none" } }}
          rightSectionWidth={70}
          rightSection={<div className="flex items-center text-xs text-[#4E4E4E]">≈ ${amountDesc(amountPrice, 2)}</div>}
        ></Input>
      </div>
      <div className="h-[1px] bg-[#B1D2FE] mb-[10px] mt-6 "></div>
      <div className="rounded-lg bg-[#F0F6FA] border border-[#E3F2FF] p-5">
        <div className="flex items-center justify-between">
          <div>Borrow Limit</div>
          <div>${amountDesc(borrowLimitPrice, 2)}</div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div>Amount Borrowed</div>
          <div className="text-end">
            <div>{borrowAmount?.toFormat() !== "0" ? `${amountDesc(borrowAmount, 2)} ${market.token}` : "-.--"}</div>
            <div className="text-xs">${amountDesc(borrowPrice, 2)}</div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div>Borrow Utilization</div>
          <div className="text-[#039DED] font-bold">
            {borrowUtilization1.toFixed(2)}% [+{borrowUtilization2.toFixed(2)}%]
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div>Borrow Cap</div>
          <div>{borrowCaps.isEqualTo(0) ? "Unlimited" : amountDesc(borrowCaps.multipliedBy(100), 2)}</div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div>Total Borrow</div>
          <div className="text-end">
            <div className="">
              {amountDesc(totalBorrow, 2)} {market.token}
            </div>
            <div className="text-xs">${amountDesc(totalBorrowPrice, 2)}</div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div>Borrow APY</div>
          <div className="text-[#039DED] font-bold">{borrowAPY.toFixed(2)}%</div>
        </div>
      </div>

      {typeof borrowToken.amount === "undefined" ? (
        <Button
          className="w-full rounded-lg h-16 flex items-center justify-center bg-[#039DED] mt-[10px] text-lg text-white font-semibold action"
          disabled
        >
          Enter a Value
        </Button>
      ) : isInsufficientBalance ? (
        <Button
          className="w-full rounded-lg h-16 flex items-center justify-center bg-[#039DED] mt-[10px] text-lg text-white font-semibold action"
          disabled
        >
          Exceeded Borrow Limit
        </Button>
      ) : (
        <Button
          className="w-full rounded-lg h-16 flex items-center justify-center bg-[#039DED] mt-[10px] text-lg text-white font-semibold action"
          onClick={() => {
            borrow(market.address, borrowToken.amount);
            //borrowToken.borrow();
          }}
        >
          Borrow
        </Button>
      )}
    </div>
  );
};

export default TokenBorrow;
