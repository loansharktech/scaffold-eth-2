import { FunctionComponent, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { Button, Loader, LoadingOverlay, NumberInput, Select, Switch } from "@mantine/core";
import BigNumber from "bignumber.js";
import { useCollateral } from "~~/hooks/useCollateral";
import type { Market, Realm } from "~~/hooks/useRealm";
import { useSupplyToken } from "~~/hooks/useSupplyToken";
import { useToken } from "~~/hooks/useToken";
import store, { actions } from "~~/stores";
import { TradeStep } from "~~/stores/reducers/trade";
import { amountDesc } from "~~/utils/amount";
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
    .multipliedBy(marketData?.price || 0)
    .multipliedBy(marketData?.markets?.[1] || 0)
    .div(p18);

  const supplyAPY = marketData?.tokenSupplyAPY?.multipliedBy(100).toNumber() || 0;

  const changeAmount = useCallback((amount: number | undefined | "") => {
    store.dispatch(
      actions.trade.updateSupply({
        amount: amount || undefined,
      }),
    );
  }, []);

  useEffect(() => {
    if ((suppyToken.amount || 0) > (balance?.toNumber() || 0)) {
      changeAmount(balance?.toNumber());
    }
  }, [balance, suppyToken.amount]);

  if (!marketData) {
    return null;
  }
  return (
    <div className="relative">
      <LoadingOverlay visible={suppyToken.approving || suppyToken.executing} overlayBlur={2}></LoadingOverlay>
      <div className="flex items-center justify-between">
        <div className="font-bold text-xl">Enter a value</div>
        <div className="flex items-center">
          <span className="text-sm text-[#3481BD] mr-2">Balance: {balance?.toFormat(2, BigNumber.ROUND_FLOOR)}</span>
          <div
            className="action font-extrabold text-[#3481BD]"
            onClick={() => {
              changeAmount(parseFloat(balance?.toFixed(2, BigNumber.ROUND_FLOOR) || "0"));
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
          max={balance?.toNumber()}
          precision={2}
          value={suppyToken.amount}
          onChange={changeAmount}
          styles={{ rightSection: { pointerEvents: "none" } }}
          rightSectionWidth={70}
          rightSection={<div className="flex items-center text-xs text-[#4E4E4E]">≈ ${amountDesc(amountPrice, 2)}</div>}
        ></NumberInput>
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
        <div className="mt-7 text-[#6F8394]">
          You are supplying without enabling the assets as collateral. You need to enable the asset as collateral to
          borrow against it. <a className="action text-dark1 font-semibold">Learn more.</a>
        </div>
      </div>

      {suppyToken.stepIndex === TradeStep.ENTER_AMOUNT && (
        <Button
          className="w-full rounded-lg h-16 flex items-center justify-center bg-[#039DED] mt-[10px] text-lg text-white font-semibold action"
          onClick={() => {
            suppyToken.approveToken();
          }}
        >
          Select token
        </Button>
      )}
      {suppyToken.stepIndex === TradeStep.APPROVE && (
        <Button
          className="w-full rounded-lg h-16 flex items-center justify-center bg-[#039DED] mt-[10px] text-lg text-white font-semibold action"
          onClick={() => {
            suppyToken.approveToken();
          }}
          loading={suppyToken.approving}
        >
          Approve
        </Button>
      )}
      {suppyToken.stepIndex === TradeStep.EXECUTE && (
        <Button
          className="w-full rounded-lg h-16 flex items-center justify-center bg-[#039DED] mt-[10px] text-lg text-white font-semibold action"
          onClick={() => {
            suppyToken.mint();
          }}
          loading={suppyToken.executing}
        >
          Execute
        </Button>
      )}
    </div>
  );
};

export default TokenSupply;
