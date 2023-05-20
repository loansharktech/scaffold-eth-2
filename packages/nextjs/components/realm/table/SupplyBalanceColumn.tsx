import type { FunctionComponent } from "react";
import BigNumber from "bignumber.js";
import { amountDesc } from "~~/utils/amount";

const SupplyBalanceColumn: FunctionComponent<{
  amount?: BigNumber;
  price?: BigNumber;
}> = ({ amount, price }) => {
  return (
    <div>
      <div className="font-semibold">{amount?.toString() !== "0" ? `${amountDesc(amount, 2)}` : "-.--"}</div>
      <div className="text-xs text-[#6E788C]">${amountDesc(price, 2)}</div>
    </div>
  );
};

export default SupplyBalanceColumn;
