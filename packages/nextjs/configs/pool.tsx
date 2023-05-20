import type { ContractName } from "~~/utils/scaffold-eth/contract";

export type RealmType = "main" | "stakednear" | "aurora" | "multichain";

export type Token = {
  name: "USDC" | "ETH" | "WETH";
  address: string;
  icon: string;
};

export type Market = {
  cToken: ContractName;
  token: string;
};

export type RealmConfig = {
  id: RealmType;
  name: string;
  icon: string;
  key: 534353;
  tokens: Token[];
  markets: Market[];
};

export const realms: RealmConfig[] = [
  {
    id: "main",
    name: "Main Hub",
    icon: "/assets/realm/realm-main.png",
    key: 534353,
    markets: [
      {
        cToken: "cUSDC",
        token: "WETH",
      },
      {
        cToken: "cWETH",
        token: "WETH",
      },
      {
        cToken: "cETH",
        token: "ETH",
      },
      {
        cToken: "LcEther",
        token: "ETH",
      },
      {
        cToken: "cUSDC2",
        token: "USDC",
      },
    ],
    tokens: [
      {
        name: "USDC",
        address: "0xA0D71B9877f44C744546D649147E3F1e70a93760",
        icon: "/assets/tokens/usdc.svg",
      },
      {
        name: "WETH",
        icon: "/assets/tokens/eth.svg",
        address: "0xa1EA0B2354F5A344110af2b6AD68e75545009a03",
      },
      {
        name: "ETH",
        icon: "/assets/tokens/eth.svg",
        address: "0x0000000000000000000000000000000000000000",
      },
    ],
  },
  // {
  //   id: "stakednear",
  //   name: "Staked NEAR Realm",
  //   icon: "/assets/realm/realm-main.png",
  // },
  // {
  //   id: "aurora",
  //   name: "Aurora Realm",
  //   icon: "/assets/realm/realm-main.png",
  // },
  // {
  //   id: "multichain",
  //   name: "Multichain Realm",
  //   icon: "/assets/realm/realm-main.png",
  // },
];
