import type { FunctionComponent } from "react";
import BigNumber from "bignumber.js";
import type { Token } from "~~/configs/pool";
import { amountDesc } from "~~/utils/amount";

const SupplyBalanceColumn: FunctionComponent<{
  token: Token;
  amount?: BigNumber;
  price?: BigNumber;
}> = ({ amount, price, token }) => {
  return (
    <div>
      <div className="font-bold">
        {amount?.toString() !== "0" ? `${amountDesc(amount, 2)} ${token.name.toUpperCase()}` : "-.--"}
      </div>
      <div className="text-xs text-[#6E788C]">${amountDesc(price, 2)}</div>
    </div>
  );
};

export default SupplyBalanceColumn;
