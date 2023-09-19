import type { FunctionComponent } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { realms } from "~~/configs/pool";

const SideMenu: FunctionComponent = () => {
  const { query } = useRouter();
  const id = query.id as string;
  return (
    <div className="bg-[#9FC9F3]/20 px-4 sm:w-[270px] sm:p-[17px] shadow-block sm:shadow-none border-r border-r-[#D7F0F] overflow-x-scroll scrollbar-hide">
      <div className="flex sm:flex-col gap-y-2">
        {realms.map(realm => {
          const isActive = id === realm.id;
          return (
            <Link href={`/realms/${realm.id}`} key={realm.id}>
              <div
                className={`whitespace-nowrap px-4 py-[10px] action transition-all ${
                  isActive ? "text-dark1 sm:bg-[#9FC9F3] rounded-lg font-semibold" : ""
                }`}
              >
                {realm.name}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SideMenu;
