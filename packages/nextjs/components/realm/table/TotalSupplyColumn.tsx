import type { FunctionComponent } from "react";
import type { Token } from "~~/configs/pool";

const TotalSupplyColumn: FunctionComponent<{
  token: Token;
}> = ({ token }) => {
  return (
    <div>
      <div>$4,762,857.84</div>
      <div className="text-xs text-[#6E788C]">2.49M {token.name.toUpperCase()}</div>
    </div>
  );
};

export default TotalSupplyColumn;
