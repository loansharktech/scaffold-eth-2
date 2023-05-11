import { FunctionComponent, useRef } from "react";
import Image from "next/image";
import { NumberInput, Select } from "@mantine/core";
import { Token, tokens } from "~~/configs/pool";

const tokenSelectList = tokens.map(token => {
  return {
    icon: token.icon,
    value: token.name,
    label: token.name.toUpperCase(),
  };
});

const TokenRepay: FunctionComponent<{
  token: Token;
  onChangeToken: any;
}> = ({ token, onChangeToken }) => {
  const selectRef = useRef<any>();
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
          value={token.name}
          data={tokenSelectList}
          onChange={onChangeToken}
          rightSectionWidth={70}
          ref={selectRef}
          rightSection={<Image alt={token.name} src={token.icon} width={32} height={32}></Image>}
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
          <div>Amount Borrowed</div>
          <div className="text-end">
            <div>-.--</div>
            <div className="text-xs">$0.00</div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div>Borrow Limit</div>
          <div className="text-[#039DED] font-bold">0.00% [+0.00%]</div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div>Supply APY</div>
          <div className="text-[#039DED] font-bold">-13.03%</div>
        </div>
      </div>

      <div className="w-full rounded-lg h-16 flex items-center justify-center bg-[#039DED] mt-[10px] text-white font-semibold action">
        Select token
      </div>
    </div>
  );
};

export default TokenRepay;
