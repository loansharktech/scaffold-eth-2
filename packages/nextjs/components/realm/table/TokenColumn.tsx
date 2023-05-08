import type { FunctionComponent } from "react";
import Image from "next/image";
import type { Token } from "~~/configs/pool";

const TokenColumn: FunctionComponent<{
  token: Token;
}> = ({ token }) => {
  return (
    <div className="flex items-center">
      <Image alt={token.name} src={token.icon} width={30} height={30}></Image>
      <div className="ml-3">
        <div className="font-semibold">{token.name.toUpperCase()}</div>
        <div className="text-xs">$1.9123</div>
      </div>
    </div>
  );
};

export default TokenColumn;
