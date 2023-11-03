import type { FunctionComponent } from "react";
import BigNumber from "bignumber.js";
import type { Token } from "~~/configs/pool";
import { amountDecimal, amountDesc } from "~~/utils/amount";

const BorrowBalanceColumn: FunctionComponent<{
  amount?: BigNumber;
  price?: BigNumber;
  token: Token;
}> = ({ amount, price, token }) => {
  return (
    <div>
      <div className="text-lg whitespace-nowrap number">
        {amount?.toString() !== "0" ? `${amountDesc(amount, amountDecimal(amount))} ${token.name}` : "-.--"}
      </div>
      <div className="text-sm text-[#6E788C] number">${amountDesc(price, 2)}</div>
    </div>
  );
};

export default BorrowBalanceColumn;
