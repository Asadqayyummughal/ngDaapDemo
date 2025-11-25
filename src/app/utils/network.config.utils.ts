export interface NetworkConfig {
  chainId: string;
  chainName: string;
  rpcUrls: string[];
  blockExplorerUrls: string[];
  nativeCurrency: { name: string; symbol: string; decimals: number };
}
export const EXPLORERS: Record<string, string> = {
  "0x1": "https://etherscan.io",
  "0x5": "https://goerli.etherscan.io",
  "0xaa36a7": "https://sepolia.etherscan.io",
  "0x38": "https://bscscan.com",
  "0x89": "https://polygonscan.com",
  "0x13881": "https://mumbai.polygonscan.com",
};

export const NETWORK_CONFIGS: Record<string, NetworkConfig> = {
  "0xaa36a7": {
    chainId: "0xaa36a7",
    chainName: "Sepolia",
    rpcUrls: ["https://rpc.sepolia.org"],
    blockExplorerUrls: ["https://sepolia.etherscan.io"],
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
  },
  "0x89": {
    chainId: "0x89",
    chainName: "Polygon Mainnet",
    rpcUrls: ["https://polygon-rpc.com"],
    blockExplorerUrls: ["https://polygonscan.com"],
    nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
  },
  "0x38": {
    chainId: "0x38",
    chainName: "BSC Mainnet",
    rpcUrls: ["https://bsc-dataseed.binance.org"],
    blockExplorerUrls: ["https://bscscan.com"],
    nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
  },
};

export function getChainLogo(chainId: string): string {
  const logos: Record<string, string> = {
    "0x1": "assets/chains/eth.svg",
    "0x38": "assets/chains/bnb.svg",
    "0x89": "assets/chains/polygon.svg",
    "0xa86a": "assets/chains/avax.svg",
    "0xa": "assets/chains/op.svg",
    "0xa4b1": "assets/chains/arbitrum.svg",
  };

  return logos[chainId] || "assets/chains/default.svg";
}

export function getNativeCurrency(chainId: number): string {
  const currencies: Record<string, string> = {
    "0x1": "ETH",
    "0x38": "BNB",
    "0x89": "MATIC",
    "0xa86a": "AVAX",
    "0xa": "ETH",
    "0xa4b1": "ETH",
  };

  return currencies[chainId] || "UNKNOWN";
}

export function getAddressUrl(chainId: string | null, address: string): string {
  const base = EXPLORERS[chainId || ""] || "https://etherscan.io";
  return `${base}/address/${address}`;
}

export function getTxUrl(chainId: string | null, tx: string): string {
  const base = EXPLORERS[chainId || ""] || "https://etherscan.io";
  return `${base}/tx/${tx}`;
}

export function openAddressInExplorer(chainId: string | null, address: string) {
  window.open(getAddressUrl(chainId, address), "_blank", "noopener,noreferrer");
}

export function getNetworkName(chainId: string | null): string | null {
  const map: any = {
    "0x1": "Ethereum Mainnet",
    "0x5": "Goerli",
    "0xaa36a7": "Sepolia",
    "0x38": "BSC Mainnet",
    "0x89": "Polygon",
    "0x13881": "Mumbai Testnet",
  };
  return chainId ? map[chainId] || "Unknown" : null;
}
export function toHex(num: number): string {
  return "0x" + num.toString(16);
}
