import { FunctionComponent, useCallback, useEffect, useRef, useState } from "react";
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
  const inputRef = useRef<HTMLInputElement>(null);

  const borrowLimitPrice = realm?.totalUserLimit || new BigNumber(0);
  const globalBorrowPrice = realm.totalUserBorrowed || new BigNumber(0);

  const repayPrice = new BigNumber(repayToken.amount || 0).multipliedBy(marketData?.price || 0);

  const borrowUtilization1 = !borrowLimitPrice?.isEqualTo(0)
    ? globalBorrowPrice.minus(repayPrice).div(borrowLimitPrice || 0)
    : new BigNumber(0);

  const borrowUtilization2 = borrowLimitPrice?.isEqualTo(0) ? new BigNumber(0) : repayPrice.div(borrowLimitPrice || 0);

  const [maxAmount, setMaxAmount] = useState(new BigNumber(0));

  let gas = 0.001;

  if (market.token !== "ETH") {
    gas = 0;
  }

  useEffect(() => {
    const _balance = (balance || new BigNumber(0)).minus(gas);
    let maxAmount = BigNumber.min(_balance, borrowAmount);
    if (maxAmount.lt(0.0001)) {
      maxAmount = new BigNumber(0);
    }
    setMaxAmount(maxAmount);
  }, [balance?.toString(), borrowAmount?.toString(), gas]);

  const changeAmount = useCallback((amount: BigNumber | undefined | "") => {
    store.dispatch(
      actions.trade.updateRepay({
        amount: amount || undefined,
      }),
    );
  }, []);

  const isInsufficientBalance = repayToken.amount?.isGreaterThan(maxAmount);
  const isInvalidInput = repayToken.amount?.isLessThan(0);
  const isExceededAmountBorrowed = repayToken.amount?.isGreaterThan(borrowAmount);
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
              changeAmount(maxAmount);
              if (inputRef.current) {
                inputRef.current.value = maxAmount.toFixed(18);
              }
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
          ref={inputRef}
          max={maxAmount.toNumber()}
          defaultValue={repayToken.amount?.toString()}
          type="number"
          onChange={e => {
            changeAmount(e.currentTarget.value ? new BigNumber(e.currentTarget.value) : undefined);
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
            <div>{borrowAmount.isEqualTo(0) ? "-.--" : `${amountDesc(borrowAmount, 2)} ${market.token}`}</div>
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
      ) : isInvalidInput ? (
        <Button
          className="w-full rounded-lg h-16 flex items-center justify-center bg-[#039DED] mt-[10px] text-lg text-white font-semibold action"
          disabled
        >
          Invalid Input
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
          onClick={async () => {
            const isETH = market.token === "ETH";
            let amount = repayToken.amount || new BigNumber(0);
            let isMax = false;
            // click max
            if (maxAmount?.isEqualTo(amount)) {
              // wallet balance >= borrow amount
              if (amount?.isGreaterThanOrEqualTo(borrowAmount)) {
                isMax = true;
                // usdc token
                if (!isETH) {
                  amount = new BigNumber(-1);
                }
              }
            }
            await repayToken.repay(amount, isMax);
            setMaxAmount(amount.isEqualTo(new BigNumber(-1)) ? new BigNumber(0) : maxAmount.minus(amount || 0));
          }}
        >
          Repay
        </Button>
      )}
    </div>
  );
};

export default TokenRepay;
