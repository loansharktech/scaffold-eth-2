export declare const scrollAlphaTestnet: {
  readonly id: 534353;
  readonly name: "Scroll Alpha Tesnet";
  readonly network: "scrollAlphaTestnet";
  readonly nativeCurrency: { name: "Ether"; symbol: "ETH"; decimals: 18 };
  readonly rpcUrls: {
    default: {
      http: ["https://alpha-rpc.scroll.io/l2"];
      webSocket: ["wss://alpha-rpc.scroll.io/l2ws"];
    };
    public: {
      http: ["https://alpha-rpc.scroll.io/l2"];
      webSocket: ["wss://alpha-rpc.scroll.io/l2/ws"];
    };
  };
  readonly blockExplorers: {
    default: {
      name: "Block Scout";
      url: "https://blockscout.scroll.io/";
    };
  };
  readonly testnet: true;
};

export {
  Chain,
  arbitrum,
  arbitrumGoerli,
  aurora,
  auroraTestnet,
  avalanche,
  avalancheFuji,
  bronos,
  bronosTestnet,
  bsc,
  bscTestnet,
  canto,
  celo,
  celoAlfajores,
  crossbell,
  evmos,
  evmosTestnet,
  fantom,
  fantomTestnet,
  filecoin,
  filecoinCalibration,
  filecoinHyperspace,
  foundry,
  gnosis,
  gnosisChiado,
  goerli,
  hardhat,
  iotex,
  iotexTestnet,
  localhost,
  mainnet,
  metis,
  metisGoerli,
  moonbaseAlpha,
  moonbeam,
  moonriver,
  okc,
  optimism,
  optimismGoerli,
  polygon,
  polygonMumbai,
  sepolia,
  taraxa,
  taraxaTestnet,
  telos,
  telosTestnet,
  zkSync,
  zkSyncTestnet,
} from "wagmi/chains";
