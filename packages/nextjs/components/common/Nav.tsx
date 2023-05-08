import { FunctionComponent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import ConnectWallet from "~~/components/common/ConnectWallet";
import { navTabs } from "~~/configs/app";

const Tab: FunctionComponent<{
  tab: (typeof navTabs)[0];
}> = ({ tab }) => {
  const router = useRouter();
  const isActive = router.asPath === tab.route;

  return (
    <Link
      href={`${tab.route}`}
      className={`action py-[6px] px-4 rounded-lg font-medium leading-6 ${
        isActive ? "text-white bg-blue shadow-[0px_1px_2px_rgba(0,0,0,0.05)]" : "text-dark1"
      }`}
      aria-label={tab.label}
    >
      {tab.label}
    </Link>
  );
};

const Nav: FunctionComponent = () => {
  return (
    <div
      className="z-40 h-[68px] sticky top-0 left-0 backdrop-blur bg-white/60"
      style={{
        boxShadow: "2px 4px 4px rgba(148, 148, 148, 0.1)",
      }}
    >
      <div className="">
        <div className="flex h-[60px] items-center px-6">
          <Link href={"/"}>
            <Image className="action flex-shrink-0" alt="logo" src="/logo.png" width={144} height={16}></Image>
          </Link>
          <div className="flex-1 ml-[117px] flex gap-[10px] items-center">
            {navTabs.map(tab => {
              return <Tab tab={tab} key={tab.id}></Tab>;
            })}
          </div>
          <div className="flex-shrink-0 ml-8">
            <ConnectWallet></ConnectWallet>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nav;
