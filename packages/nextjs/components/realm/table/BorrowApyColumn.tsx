import type { FunctionComponent } from "react";

const BorrowApyColumn: FunctionComponent<{
  value: number;
}> = ({ value }) => {
  return <div className={`font-bold text-base ${value <= 0 ? "text-[#36965D]" : ""}`}>{value.toFixed(2)}%</div>;
};

export default BorrowApyColumn;
