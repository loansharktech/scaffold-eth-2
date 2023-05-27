import type { FunctionComponent } from "react";

const SupplyApyColumn: FunctionComponent<{
  value: number;
}> = ({ value }) => {
  return <div className={`${value <= 0 ? "text-[#36965D]" : ""}`}>{value.toFixed(2)}%</div>;
};

export default SupplyApyColumn;
