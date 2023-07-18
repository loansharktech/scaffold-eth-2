import { FunctionComponent, useCallback, useRef } from "react";
import Image from "next/image";
import { Button, Input, LoadingOverlay, Select } from "@mantine/core";
import BigNumber from "bignumber.js";
import type { Market, Realm } from "~~/hooks/useRealm";
import { useRepayToken } from "~~/hooks/useRepayToken";
import { useToken } from "~~/hooks/useToken";
import store, { actions } from "~~/stores";
import { amountDecimal, amountDesc } from "~~/utils/amount";
import { p18 } from "~~/utils/amount";

const TokenRepay: FunctionComponent<{
  market: Market;
  onChangeMarket: any;
  realm: Realm;
}> = ({ market, onChangeMarket, realm }) => {
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

  const tokenInfo = useToken(realm, market);

  const repayToken = useRepayToken(realm, market);

  const balance = tokenInfo.balance?.div(p18);
  const balancePrice = balance?.multipliedBy(marketData?.price || 0);
  const amountPrice = new BigNumber(repayToken.amount || 0)?.multipliedBy(marketData?.price || 0);

  const borrowAmount = marketData?.borrowBalanceStored?.div(p18) || new BigNumber(0);
  const borrowPrice = borrowAmount?.multipliedBy(marketData?.price || 0);

  const borrowAPY = marketData?.tokenBorrowAPY?.multipliedBy(100).toNumber() || 0;

  const borrowLimitPrice = realm?.totalUserLimit || new BigNumber(0);
  const globalBorrowPrice = realm.totalUserBorrowed || new BigNumber(0);

  const repayPrice = new BigNumber(repayToken.amount || 0).multipliedBy(marketData?.price || 0);

  const borrowUtilization1 = !borrowLimitPrice?.isEqualTo(0)
    ? globalBorrowPrice.minus(repayPrice).div(borrowLimitPrice || 0)
    : new BigNumber(0);

  const borrowUtilization2 = borrowLimitPrice?.isEqualTo(0) ? new BigNumber(0) : repayPrice.div(borrowLimitPrice || 0);

  let maxAmount = new BigNumber(Math.min(balance?.toNumber() || 0, borrowAmount?.toNumber() || 0));
  if (maxAmount.lt(0.0001)) {
    maxAmount = new BigNumber(0);
  }

  const changeAmount = useCallback((amount: number | undefined | "") => {
    store.dispatch(
      actions.trade.updateRepay({
        amount: amount || undefined,
      }),
    );
  }, []);

  const isInsufficientBalance = (repayToken.amount || 0) > (balance?.toNumber() || 0);
  const isExceededAmountBorrowed = (repayToken.amount || 0) > (borrowAmount?.toNumber() || 0);
  const needApprove = !repayToken.isNativeToken && repayToken.approveAllowanceAmount.isLessThan(repayToken.amount || 0);
  if (!marketData) {
    return null;
  }

  return (
    <div className="relative">
      <LoadingOverlay visible={repayToken.approving || repayToken.executing} overlayBlur={2}></LoadingOverlay>
      <div className="flex items-center justify-between">
        <div className="font-bold text-xl"></div>
        <div className="flex items-center">
          <span className="text-sm text-[#3481BD] mr-2">
            Max: {maxAmount.toFormat(amountDecimal(maxAmount), BigNumber.ROUND_FLOOR)} {market.token}
          </span>
          <div
            className="action font-extrabold text-[#3481BD]"
            onClick={() => {
              changeAmount(maxAmount.toNumber());
            }}
          >
            MAX
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
          max={maxAmount.toNumber()}
          value={repayToken.amount}
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
          <div>Wallet Balance</div>
          <div className="text-end">
            <div className="">
              {balance?.toFormat(2, BigNumber.ROUND_FLOOR)} {market.token}
            </div>
            <div className="text-xs">${amountDesc(balancePrice, 2)}</div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div>Amount Borrowed</div>
          <div className="text-end">
            <div>{borrowAmount.isEqualTo(0) ? "-.--" : `${amountDesc(borrowAmount, 2)}${market.token}`}</div>
            <div className="text-xs">${amountDesc(borrowPrice, 2)}</div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div>Borrow Utilization</div>
          <div className="text-[#039DED] font-bold">
            {amountDesc(borrowUtilization1.multipliedBy(100), 2)}% [{borrowUtilization2.eq(0) ? "+" : "-"}
            {borrowUtilization2.multipliedBy(100).toFixed(2)}%]
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div>Borrow APY</div>
          <div className="text-[#039DED] font-bold">{borrowAPY.toFixed(2)}%</div>
        </div>
      </div>

      {typeof repayToken.amount === "undefined" ? (
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
          Insufficient Balance
        </Button>
      ) : isExceededAmountBorrowed ? (
        <Button
          className="w-full rounded-lg h-16 flex items-center justify-center bg-[#039DED] mt-[10px] text-lg text-white font-semibold action"
          disabled
        >
          Exceeded Amount Borrowed
        </Button>
      ) : needApprove ? (
        <Button
          className="w-full rounded-lg h-16 flex items-center justify-center bg-[#039DED] mt-[10px] text-lg text-white font-semibold action"
          onClick={() => {
            repayToken.approveToken();
          }}
        >
          Approve
        </Button>
      ) : (
        <Button
          className="w-full rounded-lg h-16 flex items-center justify-center bg-[#039DED] mt-[10px] text-lg text-white font-semibold action"
          onClick={() => {
            const isETH = market.token === "ETH";
            let amount = repayToken.amount || 0;
            let isMax = false;
            if (maxAmount.toNumber() === repayToken.amount) {
              isMax = true;
              if (!isETH) {
                amount = -1;
              } else {
                amount = new BigNumber(
                  Math.min(balance?.toNumber() || 0, borrowAmount.multipliedBy(1.01)?.toNumber() || 0),
                ).toNumber();
              }
            }
            repayToken.repay(amount as number, isMax);
          }}
        >
          Repay
        </Button>
      )}
    </div>
  );
};

export default TokenRepay;
