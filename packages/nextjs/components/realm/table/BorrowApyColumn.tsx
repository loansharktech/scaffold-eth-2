import type { FunctionComponent } from "react";

const BorrowApyColumn: FunctionComponent<{
  value: number;
}> = ({ value }) => {
  return (
    <div className={`text-center text-lg whitespace-nowrap number ${value <= 0 ? "text-[#36965D]" : ""}`}>
      {value.toFixed(2)}%
    </div>
  );
};

export default BorrowApyColumn;
