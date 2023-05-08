import type { FunctionComponent } from "react";
import { Progress } from "@mantine/core";
import type { Realm } from "~~/configs/pool";

const RealmOverview: FunctionComponent<{
  className: string;
  realm: Realm;
}> = ({ className }) => {
  return (
    <div
      className={`rounded-lg  bg-white grid grid-cols-2 ${className}`}
      style={{
        boxShadow: "2px 4px 4px rgba(148, 148, 148, 0.1)",
      }}
    >
      <div className="border border-[#E3F2FF] py-8 px-12 rounded-l-lg flex justify-between flex-wrap">
        <div className="flex-shrink-0">
          <div>Total Supply</div>
          <div className="text-[22px] font-bold mt-[11px]">$8.28M</div>
        </div>
        <div className="flex-shrink-0">
          <div>Total Borrow</div>
          <div className="text-[22px] font-bold mt-[11px]">$1.61M</div>
        </div>
        <div className="flex-shrink-0">
          <div>Your Net APY</div>
          <div className="text-[22px] font-bold mt-[11px] text-[#538EE4]">0.00%</div>
        </div>
      </div>
      <div className="border border-[#E3F2FF] p-8 rounded-r-lg flex">
        <div className="flex-1">
          <div>Your Borrow Limit</div>
          <div className="mt-[11px] flex items-center">
            <div className="font-bold text-[22px] flex-shrink-0">0.00%</div>
            <div className="ml-3 flex-1">
              <Progress
                value={50}
                classNames={{
                  root: "bg-[#CFE7FC]",
                  bar: "bg-blue",
                }}
              />
            </div>
          </div>
        </div>
        <div className="text-[#9CA3AF] text-sm w-[110px] flex flex-col gap-1 ml-10 flex-shrink-0">
          <div className="flex justify-end">
            <span>Borrowed</span>
            <span className="text-[#2679B8] ml-[6px]">$0.00</span>
          </div>
          <div className="flex justify-end">
            <span>Limit</span>
            <span className="text-[#2679B8] ml-[6px]">$0.00</span>
          </div>
          <div className="flex justify-end">
            <span>Collateral</span>
            <span className="text-[#2679B8] ml-[6px]">$0.00</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealmOverview;
