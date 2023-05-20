import type { FunctionComponent } from "react";
import BigNumber from "bignumber.js";
import { amountDesc } from "~~/utils/amount";

const WalletBalanceColumn: FunctionComponent<{
  amount?: BigNumber;
  price?: BigNumber;
}> = ({ amount, price }) => {
  return (
    <div>
      <div className="font-semibold">{amount?.toString() !== "0" ? amount?.toFormat(2) : "-.--"}</div>
      <div className="text-xs">${amountDesc(price, 2)}</div>
    </div>
  );
};

export default WalletBalanceColumn;
