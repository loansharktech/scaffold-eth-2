import { FunctionComponent, useCallback, useRef } from "react";
import Image from "next/image";
import { Button, Input, Loader, LoadingOverlay, Select, Switch } from "@mantine/core";
import BigNumber from "bignumber.js";
import { useCollateral } from "~~/hooks/useCollateral";
import type { Market, Realm } from "~~/hooks/useRealm";
import { useSupplyToken } from "~~/hooks/useSupplyToken";
import { useToken } from "~~/hooks/useToken";
import store, { actions } from "~~/stores";
import { amountDecimal, amountDesc } from "~~/utils/amount";
import { p18 } from "~~/utils/amount";

const TokenSupply: FunctionComponent<{
  market: Market;
  onChangeMarket: any;
  realm: Realm;
}> = ({ market, onChangeMarket, realm }) => {
  const selectRef = useRef<any>();
  const marketData = realm[market.address];
  const tokenInfo = useToken(realm, market);
  const { isMember, enterMarkets, exitMarket, loading } = useCollateral(realm, market);

  const suppyToken = useSupplyToken(realm, market);

  const tokenSelectList =
    realm.markets?.map(market => {
      const marketData = realm[market.address];
      return {
        icon: marketData?.token?.icon,
        value: market.address,
        label: market.token.toUpperCase(),
      };
    }) || [];

  const balance = tokenInfo.balance?.div(p18);
  const amountPrice = new BigNumber(suppyToken.amount || 0)?.multipliedBy(marketData?.price || 0);
  const supplied = marketData?.balance?.div(p18).multipliedBy(marketData.exchangeRate || 0);
  const suppliedPrice = supplied?.multipliedBy(marketData?.price || 0);
  const LTV = marketData?.markets?.[1].div(p18).toNumber() || 0;
  const borrowLimit = new BigNumber(suppyToken.amount || 0)
    .multipliedBy(marketData?.markets?.[1] || 0)
    .div(p18)
    .multipliedBy(marketData?.price || 0);

  const supplyAPY = marketData?.tokenSupplyAPY?.multipliedBy(100).toNumber() || 0;

  const changeAmount = useCallback((amount: number | undefined | "") => {
    store.dispatch(
      actions.trade.updateSupply({
        amount: amount || undefined,
      }),
    );
  }, []);

  const isInsufficientBalance = (suppyToken.amount || 0) > (balance?.toNumber() || 0);
  const needApprove = !suppyToken.isNativeToken && suppyToken.approveAllowanceAmount.isLessThan(suppyToken.amount || 0);

  if (!marketData) {
    return null;
  }
  return (
    <div className="relative">
      <LoadingOverlay visible={suppyToken.approving || suppyToken.executing} overlayBlur={2}></LoadingOverlay>
      <div className="flex items-center justify-between">
        <div className="font-bold text-xl"></div>
        <div className="flex items-center">
          <span className="text-sm text-[#3481BD] mr-2">
            Balance: {balance?.toFormat(amountDecimal(balance), BigNumber.ROUND_FLOOR)} {market.token}
          </span>
          <div
            className="action font-extrabold text-[#3481BD]"
            onClick={() => {
              let amount = balance?.toNumber() || 0;
              if (market.token === "ETH") {
                if (amount > 0.001) {
                  amount = amount - 0.001;
                } else {
                  amount = 0;
                }
              }
              changeAmount(balance?.toNumber());
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
          max={balance?.toNumber()}
          value={suppyToken.amount}
          type="number"
          onChange={e => {
            changeAmount(parseFloat(e.currentTarget.value));
          }}
          styles={{ rightSection: { pointerEvents: "none" } }}
          rightSectionWidth={70}
          rightSection={<div className="flex items-center text-xs text-[#4E4E4E]">≈ ${amountDesc(amountPrice, 2)}</div>}
        ></Input>
      </div>
      <div className="flex items-center justify-end mt-4">
        <Switch
          size="lg"
          checked={isMember}
          disabled={loading}
          classNames={{
            track: "cursor-pointer",
          }}
          thumbIcon={loading && <Loader size="sm"></Loader>}
          onChange={e => {
            if (e.currentTarget.checked) {
              enterMarkets();
            } else {
              exitMarket();
            }
          }}
        ></Switch>
        <div className="text-[#3481BD] ml-2">Use as collateral</div>
      </div>
      <div className="h-[1px] bg-[#B1D2FE] mb-[10px] mt-6 "></div>
      <div className="rounded-lg bg-[#F0F6FA] border border-[#E3F2FF] p-5">
        <div className="flex items-center justify-between">
          <div>Amount Supplied</div>
          <div>${amountDesc(suppliedPrice, 2)}</div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div>LTV</div>
          <div>{LTV * 100}%</div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div>Borrow Limit</div>
          <div className="text-[#039DED] font-bold">+${amountDesc(borrowLimit, 2)}</div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div>Supply APY</div>
          <div className="text-[#039DED] font-bold">{supplyAPY.toFixed(2)}%</div>
        </div>
      </div>

      {typeof suppyToken.amount === "undefined" ? (
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
      ) : needApprove ? (
        <Button
          className="w-full rounded-lg h-16 flex items-center justify-center bg-[#039DED] mt-[10px] text-lg text-white font-semibold action"
          onClick={() => {
            suppyToken.approveToken();
          }}
        >
          Approve
        </Button>
      ) : (
        <Button
          className="w-full rounded-lg h-16 flex items-center justify-center bg-[#039DED] mt-[10px] text-lg text-white font-semibold action"
          onClick={() => {
            suppyToken.mint();
          }}
        >
          Supply
        </Button>
      )}
    </div>
  );
};

export default TokenSupply;
