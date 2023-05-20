import type { FunctionComponent } from "react";

const SupplyApyColumn: FunctionComponent<{
  value: number;
}> = ({ value }) => {
  return <div className="">{value}%</div>;
};

export default SupplyApyColumn;
