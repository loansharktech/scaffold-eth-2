import type { ContractName } from "~~/utils/scaffold-eth/contract";

export type RealmType = "main";

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
  key: 534351;
  tokens: Token[];
  markets: Market[];
};

export const realms: RealmConfig[] = [
  {
    id: "main",
    name: "Main Hub",
    icon: "/assets/realm/realm-main.png",
    key: 534351,
    markets: [
      {
        cToken: "cETH",
        token: "ETH",
      },
      {
        cToken: "cUSDC",
        token: "USDC",
      },
    ],
    tokens: [
      {
        name: "USDC",
        address: "0x2FfCCE0faaECA62993c031Fd325F482B8cb54684",
        icon: "/assets/tokens/usdc.svg",
      },
      {
        name: "ETH",
        icon: "/assets/tokens/eth.svg",
        address: "0x0000000000000000000000000000000000000000",
      },
    ],
  },
];
