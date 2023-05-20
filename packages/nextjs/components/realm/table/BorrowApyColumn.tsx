import type { FunctionComponent } from "react";

const BorrowApyColumn: FunctionComponent<{
  value: number;
}> = ({ value }) => {
  return <div className="text-[#36965D]">{value}%</div>;
};

export default BorrowApyColumn;
