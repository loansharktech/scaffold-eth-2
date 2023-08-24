import type { FunctionComponent } from "react";
import BigNumber from "bignumber.js";
import type { Token } from "~~/configs/pool";
import { amountDecimal, amountDesc } from "~~/utils/amount";

const WalletBalanceColumn: FunctionComponent<{
  amount?: BigNumber;
  price?: BigNumber;
  token: Token;
}> = ({ amount, price, token }) => {
  return (
    <div>
      <div className="font-bold text-base">
        {amount && amount?.toString() !== "0"
          ? `${amount?.toFormat(amountDecimal(amount))} ${token.name.toUpperCase()}`
          : "-.--"}
      </div>
      <div className="text-sm">${amountDesc(price, 2)}</div>
    </div>
  );
};

export default WalletBalanceColumn;
