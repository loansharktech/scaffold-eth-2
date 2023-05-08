export type RealmType = "main" | "stakednear" | "aurora" | "multichain";

export type Realm = {
  id: RealmType;
  name: string;
  icon: string;
};

export const realms: Realm[] = [
  {
    id: "main",
    name: "Main Hub",
    icon: "/assets/realm/realm-main.png",
  },
  {
    id: "stakednear",
    name: "Staked NEAR Realm",
    icon: "/assets/realm/realm-main.png",
  },
  {
    id: "aurora",
    name: "Aurora Realm",
    icon: "/assets/realm/realm-main.png",
  },
  {
    id: "multichain",
    name: "Multichain Realm",
    icon: "/assets/realm/realm-main.png",
  },
];

export type Token = {
  name: string;
  icon: string;
};

export const tokens: Token[] = [
  { name: "near", icon: "/assets/tokens/near.svg" },
  {
    name: "usdc",
    icon: "/assets/tokens/usdc.svg",
  },
  {
    name: "usdt",
    icon: "/assets/tokens/usdt.svg",
  },
  {
    name: "btc",
    icon: "/assets/tokens/btc.svg",
  },
  {
    name: "eth",
    icon: "/assets/tokens/eth.svg",
  },
];
