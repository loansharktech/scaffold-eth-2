import type { FunctionComponent } from "react";
import { numberWithCommas } from "~~/utils/format";

const ValueLocked: FunctionComponent = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="text-[#538EE4] font-semibold text-lg">Total Value Locked</div>
      <div className="mt-1 text-dark2 font-bold text-5xl ">${numberWithCommas(10637355.93)}</div>
    </div>
  );
};

export default ValueLocked;
