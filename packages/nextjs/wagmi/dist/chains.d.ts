export declare const scroll: {
  id: 534352;
  name: "Scroll";
  network: "scroll";
  nativeCurrency: { name: "Ether"; symbol: "ETH"; decimals: 18 };
  rpcUrls: {
    default: {
      http: ["https://scroll.blockpi.network/v1/rpc/fed5ba0f86f2d35aba97807cdb1b31c400e5e52a"];
      webSocket: ["wss://wss-rpc.scroll.io/ws/"];
    };
    public: {
      http: ["https://scroll.blockpi.network/v1/rpc/fed5ba0f86f2d35aba97807cdb1b31c400e5e52a"];
      webSocket: ["wss://wss-rpc.scroll.io/ws/"];
    };
  };
  blockExplorers: {
    default: {
      name: "Block Scout";
      url: "https://scrollscan.com";
    };
  };
  testnet: false;
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
