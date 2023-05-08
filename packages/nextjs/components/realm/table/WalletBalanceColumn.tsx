import type { FunctionComponent } from "react";

const WalletBalanceColumn: FunctionComponent = () => {
  return (
    <div>
      <div>-.--</div>
      <div className="text-xs">$0.00</div>
    </div>
  );
};

export default WalletBalanceColumn;
