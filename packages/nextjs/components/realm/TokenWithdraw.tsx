import { FunctionComponent, useCallback, useRef } from "react";
import Image from "next/image";
import { Button, LoadingOverlay, NumberInput, Select } from "@mantine/core";
import BigNumber from "bignumber.js";
import type { Market, Realm } from "~~/hooks/useRealm";
import { useWithdrawToken } from "~~/hooks/useWithdrawToken";
import store, { actions } from "~~/stores";
import { TradeStep } from "~~/stores/reducers/trade";
import { amountDesc } from "~~/utils/amount";
import { p18 } from "~~/utils/amount";

const TokenWithdraw: FunctionComponent<{
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

  const withdrawToken = useWithdrawToken(realm, market);

  const amountPrice = new BigNumber(withdrawToken.amount || 0)?.multipliedBy(marketData?.price || 0);

  const supplyBalanceAmount =
    marketData?.balance?.div(p18).multipliedBy(marketData.exchangeRate || 0) || new BigNumber(0);
  const supplyBalancePrice = supplyBalanceAmount.multipliedBy(marketData?.price || 0);

  const borrowLimitPrice = marketData?.borrowLimitPrice || new BigNumber(0);

  const borrowAmount = marketData?.borrowBalanceStored?.div(p18) || new BigNumber(0);
  const borrowPrice = borrowAmount?.multipliedBy(marketData?.price || 0);

  const _C = new BigNumber(withdrawToken.amount || 0).multipliedBy(marketData?.price || 0);
  const borrowUtilization1 = !borrowLimitPrice.eq(0)
    ? _C
        .plus(borrowPrice || 0)
        .div(borrowLimitPrice)
        .multipliedBy(100)
        .toNumber()
    : 0;
  const borrowUtilization2 = !borrowLimitPrice.eq(0) ? _C.div(borrowLimitPrice).multipliedBy(100).toNumber() : 0;

  const supplyAPY = marketData?.tokenSupplyAPY?.multipliedBy(100).toNumber() || 0;

  const supplyAmount = marketData?.balance?.div(p18).multipliedBy(marketData.exchangeRate || 0) || new BigNumber(0);
  const supplyPrice = supplyAmount.multipliedBy(marketData?.price || 0);

  let maxWithdrawAmount = supplyAmount.minus(borrowAmount || 0);
  if (maxWithdrawAmount.lt(0)) {
    maxWithdrawAmount = new BigNumber(0);
  }
  let maxWithdrawPrice = supplyPrice.minus(borrowPrice);
  if (maxWithdrawPrice.lt(0)) {
    maxWithdrawPrice = new BigNumber(0);
  }

  const changeAmount = useCallback((amount: number | undefined | "") => {
    store.dispatch(
      actions.trade.updateWithdraw({
        amount: amount || undefined,
      }),
    );
  }, []);

  if (!marketData) {
    return null;
  }
  return (
    <div className="relative">
      <LoadingOverlay visible={withdrawToken.executing} overlayBlur={2}></LoadingOverlay>
      <div className="flex items-center justify-between">
        <div className="font-bold text-xl">Enter a value</div>
        <div className="flex items-center">
          <span className="text-sm text-[#3481BD] mr-2">
            Max: {maxWithdrawAmount?.toFormat(2, BigNumber.ROUND_FLOOR)}
          </span>
          <div
            className="action font-extrabold text-[#3481BD]"
            onClick={() => {
              changeAmount(maxWithdrawAmount?.toNumber());
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
        <NumberInput
          hideControls
          placeholder="0.00"
          classNames={{
            root: "flex-1",
            input:
              "bg-[#F0F5F9] h-[50px] border-none bg-[#F0F5F9] rounded-[12px] text-lg font-bold placeholder:text-[#9CA3AF]",
          }}
          max={maxWithdrawAmount.toNumber()}
          styles={{ rightSection: { pointerEvents: "none" } }}
          rightSectionWidth={70}
          precision={2}
          value={withdrawToken.amount}
          onChange={changeAmount}
          rightSection={<div className="flex items-center text-xs text-[#4E4E4E]">≈ ${amountDesc(amountPrice, 2)}</div>}
        ></NumberInput>
      </div>
      <div className="h-[1px] bg-[#B1D2FE] mb-[10px] mt-6 "></div>
      <div className="rounded-lg bg-[#F0F6FA] border border-[#E3F2FF] p-5">
        <div className="flex items-center justify-between">
          <div>Max Withdrawal</div>
          <div className="text-end">
            <div className="text-[#039DED] font-bold">
              {amountDesc(maxWithdrawAmount, 2)} {market.token}
            </div>
            <div className="text-xs">${amountDesc(maxWithdrawPrice, 2)}</div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div>Amount Supplied</div>
          <div className="text-end">
            <div>
              {supplyBalanceAmount.isEqualTo(0) ? "-.--" : `${amountDesc(supplyBalanceAmount, 2)} ${market.token}`}
            </div>
            <div className="text-xs">${amountDesc(supplyBalancePrice, 2)}</div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div>Borrow Limit</div>
          <div className="">${amountDesc(borrowLimitPrice, 2)}</div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div>Borrow Utilization</div>
          <div className="">
            {borrowUtilization1.toFixed(2)}% [+{borrowUtilization2.toFixed(2)}%]
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div>Supply APY</div>
          <div className="text-[#039DED] font-bold">{supplyAPY.toFixed(2)}%</div>
        </div>
      </div>

      {withdrawToken.stepIndex === TradeStep.ENTER_AMOUNT && (
        <Button
          className="w-full rounded-lg h-16 flex items-center justify-center bg-[#039DED] mt-[10px] text-lg text-white font-semibold action"
          onClick={() => {
            withdrawToken.withdraw();
          }}
        >
          Select token
        </Button>
      )}

      {withdrawToken.stepIndex === TradeStep.EXECUTE && (
        <Button
          className="w-full rounded-lg h-16 flex items-center justify-center bg-[#039DED] mt-[10px] text-lg text-white font-semibold action"
          onClick={() => {
            withdrawToken.withdraw();
          }}
          loading={withdrawToken.executing}
        >
          Execute
        </Button>
      )}
    </div>
  );
};

export default TokenWithdraw;
