import { FunctionComponent, useRef } from "react";
import Image from "next/image";
import { NumberInput, Select, Switch } from "@mantine/core";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Token, tokens } from "~~/configs/pool";

const tokenSelectList = tokens.map(token => {
  return {
    icon: token.icon,
    value: token.name,
    label: token.name.toUpperCase(),
  };
});

const TokenSupply: FunctionComponent<{
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
      <div className="mt-2 flex items-center">
        <Select
          size="lg"
          classNames={{
            input: "border-none bg-[#F0F5F9] rounded-[12px]",
            root: "w-[145px]",
          }}
          value={token.name}
          data={tokenSelectList}
          onChange={onChangeToken}
          rightSectionWidth={70}
          ref={selectRef}
          rightSection={
            <div className="flex items-center">
              <Image alt={token.name} src={token.icon} width={32} height={32}></Image>
              <ChevronDownIcon className="h-6 w-4 ml-2 flex-shrink-0"></ChevronDownIcon>
            </div>
          }
        />
        <NumberInput
          hideControls
          placeholder="0.00"
          classNames={{
            root: "flex-1",
            input:
              "bg-transparent h-[50px] border-none ml-1 bg-[#F0F5F9] rounded-[12px] text-lg font-bold placeholder:text-[#9CA3AF]",
          }}
        ></NumberInput>
      </div>
      <div className="flex items-center justify-end mt-4">
        <Switch size="lg"></Switch>
        <div className="text-[#3481BD] ml-2">Use as collateral</div>
      </div>
      <div className="h-[1px] bg-[#B1D2FE] mb-[10px] mt-6 "></div>
      <div className="rounded-lg bg-[#F0F6FA] border border-[#E3F2FF] p-5">
        <div className="flex items-center justify-between">
          <div>Amount Supplied</div>
          <div>$0.00</div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div>LTV</div>
          <div>85.00%</div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div>Borrow Limit</div>
          <div className="text-[#039DED] font-bold">+$0</div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div>Supply APY</div>
          <div className="text-[#039DED] font-bold">0.54%%</div>
        </div>
        <div className="mt-7 text-[#6F8394]">
          You are supplying without enabling the assets as collateral. You need to enable the asset as collateral to
          borrow against it. <a className="action text-dark1">Learn more.</a>
        </div>
      </div>

      <div className="w-full rounded-lg h-16 flex items-center justify-center bg-[#039DED] mt-[10px] text-white font-semibold action">
        Select token
      </div>
    </div>
  );
};

export default TokenSupply;
