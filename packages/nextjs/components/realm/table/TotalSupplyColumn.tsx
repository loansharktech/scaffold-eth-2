import type { FunctionComponent } from "react";
import BigNumber from "bignumber.js";
import type { Token } from "~~/configs/pool";
import { amountDesc } from "~~/utils/amount";

const TotalSupplyColumn: FunctionComponent<{
  token: Token;
  amount?: BigNumber;
  price?: BigNumber;
}> = ({ token, amount, price }) => {
  return (
    <div>
      <div className="font-bold">{amount ? `$${amountDesc(price, 2)}` : "-.--"}</div>
      <div className="text-xs text-[#6E788C]">
        {amountDesc(amount, 2)} {token.name.toUpperCase()}
      </div>
    </div>
  );
};

export default TotalSupplyColumn;
