import type { FunctionComponent } from "react";
import BigNumber from "bignumber.js";
import type { Token } from "~~/configs/pool";
import { amountDesc } from "~~/utils/amount";

const WalletBalanceColumn: FunctionComponent<{
  amount?: BigNumber;
  price?: BigNumber;
  token: Token;
}> = ({ amount, price, token }) => {
  return (
    <div>
      <div className="font-bold">
        {amount?.toString() !== "0" ? `${amount?.toFormat(2)} ${token.name.toUpperCase()}` : "-.--"}
      </div>
      <div className="text-xs">${amountDesc(price, 2)}</div>
    </div>
  );
};

export default WalletBalanceColumn;
