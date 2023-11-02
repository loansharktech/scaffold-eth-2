import type { FunctionComponent } from "react";
import Image from "next/image";
import type { Token } from "~~/configs/pool";

const TokenColumn: FunctionComponent<{
  token: Token;
  price?: string;
}> = ({ token, price }) => {
  return (
    <div className="flex items-center">
      <Image alt={token.name} className="rounded-full" src={token.icon} width={30} height={30}></Image>
      <div className="ml-3">
        <div className="font-bold text-lg">{token.name}</div>
        <div className="text-sm text-[#6E788C] number">{price ? `$${price}` : "-.--"}</div>
      </div>
    </div>
  );
};

export default TokenColumn;
