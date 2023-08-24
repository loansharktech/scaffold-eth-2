export declare const scrollSepoliaTestnet: {
  id: 534351;
  name: "Scroll Sepolia Tesnet";
  network: "scrollSepoliaTestnet";
  nativeCurrency: { name: "Ether"; symbol: "ETH"; decimals: 18 };
  rpcUrls: {
    default: {
      http: ["https://scroll-sepolia.blockpi.network/v1/rpc/003722cf3fe858ca24424df15e619a90e18f4220"];
      webSocket: ["wss://scroll-sepolia.blockpi.network/v1/ws/003722cf3fe858ca24424df15e619a90e18f4220"];
    };
    public: {
      http: ["https://scroll-sepolia.blockpi.network/v1/rpc/003722cf3fe858ca24424df15e619a90e18f4220"];
      webSocket: ["wss://scroll-sepolia.blockpi.network/v1/ws/003722cf3fe858ca24424df15e619a90e18f4220"];
    };
  };
  blockExplorers: {
    default: {
      name: "Block Scout";
      url: "https://sepolia-blockscout.scroll.io/";
    };
  };
  testnet: true;
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
