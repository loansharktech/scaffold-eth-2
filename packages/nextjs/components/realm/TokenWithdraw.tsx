import { FunctionComponent, useRef } from "react";
import Image from "next/image";
import { NumberInput, Select } from "@mantine/core";
import type { Market, Realm } from "~~/hooks/useRealm";

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

  if (!marketData) {
    return null;
  }
  return (
    <div className="">
      <div className="flex items-center justify-between">
        <div className="font-bold text-xl">Enter a value</div>
        <div className="flex items-center">
          <span className="text-sm text-[#3481BD] mr-2">Balance: 0.00</span>
          <div className="action font-extrabold text-[#3481BD]">MAX</div>
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
          styles={{ rightSection: { pointerEvents: "none" } }}
          rightSectionWidth={70}
          rightSection={<div className="flex items-center text-xs text-[#4E4E4E]">≈ $0.00</div>}
        ></NumberInput>
      </div>
      <div className="h-[1px] bg-[#B1D2FE] mb-[10px] mt-6 "></div>
      <div className="rounded-lg bg-[#F0F6FA] border border-[#E3F2FF] p-5">
        <div className="flex items-center justify-between">
          <div>Max Withdrawal</div>
          <div className="text-end">
            <div className="text-[#039DED] font-bold">29.51K NEAR</div>
            <div className="text-xs">$48.61K</div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div>Amount Supplied</div>
          <div className="text-end">
            <div>-.--</div>
            <div className="text-xs">$0.00</div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div>Borrow Limit</div>
          <div className="">$0</div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div>Borrow Utilization</div>
          <div className="">0.54%</div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div>Supply APY</div>
          <div className="text-[#039DED] font-bold">0.02%</div>
        </div>
      </div>

      <div className="w-full rounded-lg h-16 flex items-center justify-center bg-[#039DED] mt-[10px] text-white font-semibold action">
        Select token
      </div>
    </div>
  );
};

export default TokenWithdraw;
