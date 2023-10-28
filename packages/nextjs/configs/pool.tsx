import type { ContractName } from "~~/utils/scaffold-eth/contract";

export type RealmType = "main";

export type Token = {
  name: "USDC" | "ETH" | "WETH" | "USDT";
  address: string;
  icon: string;
  decimals: number;
};

export type Market = {
  cToken: ContractName;
  token: string;
};

export type RealmConfig = {
  id: RealmType;
  name: string;
  icon: string;
  key: 534352;
  tokens: Token[];
  markets: Market[];
};

export const realms: RealmConfig[] = [
  {
    id: "main",
    name: "Main Hub",
    icon: "/assets/realm/realm-main.png",
    key: 534352,
    markets: [
      {
        cToken: "cETH",
        token: "ETH",
      },
      {
        cToken: "cUSDC",
        token: "USDC",
      }, 
      {
        cToken: "cUSDT",
        token: "USDT",
      },
    ],
    tokens: [
      {
        name: "USDC",
        address: "0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4",
        icon: "/assets/tokens/usdc.svg",
        decimals: 6,
      },
      {
        name: "USDT",
        address: "0xf55BEC9cafDbE8730f096Aa55dad6D22d44099Df",
        icon: "/assets/tokens/usdt.svg",
        decimals: 6,
      },
      {
        name: "ETH",
        icon: "/assets/tokens/eth.svg",
        address: "0x0000000000000000000000000000000000000000",
        decimals: 18,
      },
    ],
  },
];
