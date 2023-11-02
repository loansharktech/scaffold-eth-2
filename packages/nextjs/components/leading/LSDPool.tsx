import type { FunctionComponent } from "react";
import Image from "next/image";
import Link from "next/link";
import { realms } from "~~/configs/pool";
import { useRealm } from "~~/hooks/useRealm";
import { amountDesc } from "~~/utils/amount";

const LSDPool: FunctionComponent = () => {
  const defaultPool = realms.find(item => {
    return item.id === "lsd";
  })!;
  const { realm } = useRealm(defaultPool.id);

  const netAPY = realm.netAPY ? realm.netAPY.multipliedBy(100).toNumber() : 0;
  const deposit = realm.deposit ? amountDesc(realm.deposit, 2) : 0;
  const totalSupply = amountDesc(realm.totalSupply, 0);
  const totalBorrow = amountDesc(realm.totalBorrow, 0);

  return (
    <div className="flex flex-col items-center mx-4">
      <Link href={`/realms/${defaultPool.id}`}>
        <div className="mt-7 bg-white/80 rounded-lg sm:w-[872px] px-4 sm:px-8 py-7 pb-[43px] action relative">
          <div className="absolute top-[23px] w-[93px] h-[42px] right-[29px] flex items-center justify-center bg-white rounded-[10px] text-[#001910] font-DMSans font-[700]">
            Isolated
          </div>
          <div className="flex items-start">
            <Image alt="pool icon" src={defaultPool.icon} width={47} height={47}></Image>
            <div className="flex flex-col ml-[18px] mt-2 ">
              <div className="text-2xl font-medium text-dark2">{defaultPool.name}</div>
              <div className="text-[#606060] mt-2">Dedicated realm for Liquid Staking Derivatives (LSD).</div>
              <div className="flex items-center gap-2 w-fit mt-[13px]">
                {realm?.markets?.map(market => {
                  const cToken = realm[market.address];
                  return (
                    <img
                      key={market.cToken}
                      className="w-7 h-auto object-contain rounded-full"
                      src={cToken?.token?.icon}
                      alt="Img"
                    />
                  );
                })}
              </div>
              <div className="w-full flex flex-wrap mt-8 gap-[50px] leading-none">
                <div className="flex flex-col">
                  <span className="text-[18px]">Total Supply</span>
                  <div className={`text-[36px] font-bold number mt-[14px]`}>${totalSupply}</div>
                </div>
                <div className="flex flex-col ">
                  <span className="text-[18px]">Total Borrow</span>
                  <div className="text-[36px] font-bold number mt-[14px]">${totalBorrow}</div>
                </div>
                <div>
                  <div className="text-[18px]">Your Net APY</div>
                  <div className={`text-[36px] font-bold number  mt-[14px] ${netAPY <= 0 ? "text-green" : ""}`}>
                    {netAPY.toFixed(2)}%
                  </div>
                </div>
                <div>
                  <div className="text-[18px]">Amount Deposited</div>
                  <div className="text-[36px] font-bold  mt-[14px] number">${deposit}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default LSDPool;
