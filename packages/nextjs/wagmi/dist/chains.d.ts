export declare const scroll: {
  id: 534352;
  name: "Scroll";
  network: "scroll";
  nativeCurrency: { name: "Ether"; symbol: "ETH"; decimals: 18 };
  rpcUrls: {
    default: {
      http: ["https://rpc.scroll.io"];
      webSocket: ["wss://rpc.scroll.io"];
    };
    public: {
      http: ["https://rpc.scroll.io"];
      webSocket: ["wss://rpc.scroll.io"];
    };
  };
  blockExplorers: {
    default: {
      name: "Block Scout";
      url: "https://blockscout.scroll.io/";
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
