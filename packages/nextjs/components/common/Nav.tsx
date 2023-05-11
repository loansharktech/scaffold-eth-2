import { FunctionComponent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ActionIcon, Menu } from "@mantine/core";
import { BiMenu } from "react-icons/bi";
import ConnectWallet from "~~/components/common/ConnectWallet";
import { navTabs } from "~~/configs/app";
import { useDevice } from "~~/hooks/useDevice";

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

const NavMenu: FunctionComponent = () => {
  const router = useRouter();

  return (
    <>
      <Menu
        shadow="md"
        position="bottom-start"
        offset={14}
        width={200}
        classNames={{
          item: "p-3",
        }}
      >
        <Menu.Target>
          <ActionIcon className="block  sm:hidden mr-3">
            <BiMenu className="h-6 w-6"></BiMenu>
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          {navTabs.map(tab => {
            const isActive = router.asPath === tab.route;
            const style = isActive
              ? {
                  color: "#039DED",
                  fontWeight: "bold",
                }
              : {};
            return (
              <Menu.Item
                style={style}
                key={tab.id}
                onClick={() => {
                  router.push(tab.route);
                }}
              >
                {tab.label}
              </Menu.Item>
            );
          })}
        </Menu.Dropdown>
      </Menu>
    </>
  );
};

const Nav: FunctionComponent = () => {
  const router = useRouter();
  const { isMobile } = useDevice();
  const hideNavShadow = router.route === "/realms/[id]" && isMobile;
  return (
    <div
      className="z-40 h-[68px] sticky top-0 left-0 bg-white/60"
      style={{
        boxShadow: hideNavShadow ? "" : "2px 4px 4px rgba(148, 148, 148, 0.1)",
      }}
    >
      <div className="flex h-full items-center px-5 sm:px-6">
        <NavMenu></NavMenu>
        <Link href={"/"} className="hidden sm:block">
          <Image className="action flex-shrink-0" alt="logo" src="/logo.png" width={144} height={16}></Image>
        </Link>
        <div className="flex-1 ml-[117px] hidden sm:flex gap-[10px] items-center">
          {navTabs.map(tab => {
            return <Tab tab={tab} key={tab.id}></Tab>;
          })}
        </div>
        <div className="flex-1"></div>
        <div className="flex-shrink-0 ml-8">
          <ConnectWallet></ConnectWallet>
        </div>
      </div>
    </div>
  );
};

export default Nav;
