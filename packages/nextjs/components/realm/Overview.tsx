import type { FunctionComponent } from "react";
import { Progress } from "@mantine/core";
import BigNumber from "bignumber.js";
import type { Realm } from "~~/hooks/useRealm";
import { amountDesc } from "~~/utils/amount";

const RealmOverview: FunctionComponent<{
  className: string;
  realm: Realm;
}> = ({ className, realm }) => {
  const netAPY = realm.netAPY ? realm.netAPY.multipliedBy(100).toNumber().toFixed(2) : (0).toFixed(2);
  const totalSupply = amountDesc(realm.totalSupply, 2);
  const totalBorrow = amountDesc(realm.totalBorrow, 2);
  const borrowed = amountDesc(realm.totalUserBorrowed, 2);
  const limit = amountDesc(realm.totalUserLimit, 2);
  const collateral = realm.deposit ? realm.deposit.toNumber().toFixed(2) : (0).toFixed(2);
  const userBorrowLimit =
    realm.totalUserBorrowed && realm.totalUserLimit && !realm.totalUserLimit?.eq(0)
      ? realm.totalUserBorrowed.div(realm?.totalUserLimit).multipliedBy(100)
      : new BigNumber(0);

  return (
    <div
      className={`rounded-lg  bg-white grid grid-cols-1 sm:grid-cols-2 ${className}`}
      style={{
        boxShadow: "2px 4px 4px rgba(148, 148, 148, 0.1)",
      }}
    >
      <div className="border border-[#E3F2FF] py-8 px-12 rounded-l-lg flex justify-between flex-wrap">
        <div className="flex-shrink-0">
          <div>Total Supply</div>
          <div className="text-[22px] font-bold mt-[11px]">${totalSupply}</div>
        </div>
        <div className="flex-shrink-0">
          <div>Total Borrow</div>
          <div className="text-[22px] font-bold mt-[11px]">${totalBorrow}</div>
        </div>
        <div className="flex-shrink-0">
          <div>Your Net APY</div>
          <div className="text-[22px] font-bold mt-[11px] text-[#538EE4]">{netAPY}%</div>
        </div>
      </div>
      <div className="border border-[#E3F2FF] p-8 rounded-r-lg flex">
        <div className="flex-1">
          <div>Your Borrow Limit</div>
          <div className="mt-[11px] flex items-center">
            <div className="font-bold text-[22px] flex-shrink-0">{userBorrowLimit.toFixed(2)}%</div>
            <div className="ml-3 flex-1">
              <Progress
                value={userBorrowLimit.toNumber()}
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
            <span className="text-[#2679B8] ml-[6px]">${borrowed}</span>
          </div>
          <div className="flex justify-end">
            <span>Limit</span>
            <span className="text-[#2679B8] ml-[6px]">${limit}</span>
          </div>
          <div className="flex justify-end">
            <span>Collateral</span>
            <span className="text-[#2679B8] ml-[6px]">${collateral}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealmOverview;
