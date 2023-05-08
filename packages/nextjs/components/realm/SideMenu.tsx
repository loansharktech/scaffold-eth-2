import type { FunctionComponent } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { realms } from "~~/configs/pool";

const SideMenu: FunctionComponent = () => {
  const { query } = useRouter();
  const id = query.id as string;
  return (
    <div className="w-[270px] p-[17px] border-r border-r-[#D7F0F]">
      <div className="flex flex-col gap-y-2">
        {realms.map(realm => {
          const isActive = id === realm.id;
          return (
            <Link href={`/realms/${realm.id}`} key={realm.id}>
              <div
                className={`px-4 py-[10px] action transition-all ${
                  isActive ? "bg-[#C6DFEC] rounded-lg font-semibold" : ""
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
