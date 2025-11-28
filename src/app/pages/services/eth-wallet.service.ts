import { Injectable, NgZone, OnDestroy } from "@angular/core";
import { BrowserProvider, Contract, ethers, formatEther } from "ethers";
import { BehaviorSubject, Observable } from "rxjs";
import { constants } from "src/app/constants";
import {
  getNetworkName,
  NETWORK_CONFIGS,
  toHex,
} from "src/app/utils/network.config.utils";
declare global {
  interface Window {
    ethereum?: any;
  }
}

export interface WalletState {
  account: string | null;
  chainId: string | null;
  networkName: string | null;
  provider: BrowserProvider | null;
  signer: any | null;
  isMetaMaskInstalled: boolean;
  isSupportedNetwork: boolean;
  balance: string | null;
  tokenContract: Contract | null;
  routerContract: Contract | null;
}
export type NetworkInfo = {
  chainId: number;
  name: string;
  explorer: string;
  logo: string;
  unsupported?: boolean;
};
@Injectable({
  providedIn: "root",
})
export class EthWalletService implements OnDestroy {
  private state$ = new BehaviorSubject<WalletState>({
    account: null,
    chainId: null,
    networkName: null,
    provider: null,
    isMetaMaskInstalled: !!window.ethereum,
    isSupportedNetwork: true,
    balance: null,
    signer: null,
    tokenContract: null,
    routerContract: null,
  });
  public walletState$: Observable<WalletState> = this.state$.asObservable();
  private handleAccountsChangedBound = this.handleAccountsChanged.bind(this);
  private handleChainChangedBound = this.handleChainChanged.bind(this);
  constructor(private ngZone: NgZone) {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", this.handleAccountsChangedBound);
      window.ethereum.on("chainChanged", this.handleChainChangedBound);
      this.initFromProvider();
    }
  }

  async initFromProvider(): Promise<void> {
    if (!window.ethereum) return;
    try {
      const provider = new BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      const accounts = (await provider.send("eth_accounts", [])) as string[];
      const signer = provider.getSigner();
      const address = (await signer).getAddress();
      let balance_in_big_int = await provider.getBalance(address);
      const tokenContract: Contract = new ethers.Contract(
        constants.att_contract_address,
        constants.ERC20_ABI,
        await signer
      );

      // const router = new ethers.Contract(
      //   constants.UNISWAP_ROUTER_ADDRESS,
      //   UNISWAP_V2_ROUTER_ABI,
      //   await signer
      // );
      this.setState({
        provider,
        chainId: toHex(Number()),
        networkName: getNetworkName(toHex(Number(network.chainId))),
        account: accounts.length ? accounts[0] : null,
        isMetaMaskInstalled: true,
        isSupportedNetwork: this.isSupportedChain(
          toHex(Number(network.chainId))
        ),
        signer: signer,
        balance: formatEther(balance_in_big_int),
        tokenContract: tokenContract,
        // routerContract: router,
      });
    } catch (err) {
      console.error("initFromProvider error", err);
    }
  }
  // Generic method to get a specific state property
  getStateProp<K extends keyof WalletState>(key: K): WalletState[K] {
    return this.state$.getValue()[key];
  }
  async connectWallet(): Promise<string | null> {
    if (!window.ethereum) {
      this.setState({ isMetaMaskInstalled: false });
      throw new Error("MetaMask not installed");
    }
    try {
      const provider = new BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();
      this.setState({
        provider,
        account: address,
        chainId: toHex(Number(network.chainId)),
        networkName: getNetworkName(toHex(Number(network.chainId))),
        isMetaMaskInstalled: true,
        isSupportedNetwork: this.isSupportedChain(
          toHex(Number(network.chainId))
        ),
      });

      return address;
    } catch (err) {
      console.error("connectWallet error", err);
      throw err;
    }
  }

  getCurrentAccount(): string | null {
    return this.state$.value.account;
  }

  getCurrentChainId(): string | null {
    return this.state$.value.chainId;
  }

  private handleAccountsChanged(accounts: string[]) {
    this.ngZone.run(() => {
      const acc = accounts.length ? accounts[0] : null;
      this.setState({ account: acc });
      this.initFromProvider();
    });
  }

  private async handleChainChanged(chainIdHex: string) {
    this.ngZone.run(async () => {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();
        const signer = await provider.getSigner();
        const accounts = [await signer.getAddress()];

        this.setState({
          provider,
          account: accounts[0],
          chainId: chainIdHex,
          networkName: getNetworkName(chainIdHex),
          isSupportedNetwork: this.isSupportedChain(chainIdHex),
        });
      } catch (error) {
        console.error("on chainChanged error", error);
      }
    });
  }

  private isSupportedChain(chainId: string | null): boolean {
    const supported = ["0x1", "0x5", "0xaa36a7", "0x38", "0x89", "0x13881"]; // mainnet, goerli, sepolia,bsc,Polygon,MumbaiTestnet
    return chainId ? supported.includes(chainId) : false;
  }

  public setState(newState: Partial<WalletState>) {
    this.state$.next({
      ...this.state$.value,
      ...newState,
    });
  }
  public getState() {
    return;
  }
  async switchTo(chainId: number) {
    const chainHex = "0x" + chainId.toString(16);
    try {
      // 1️⃣ Try switching normally
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainHex }],
      });

      this.updateNetwork(chainHex);
    } catch (error: any) {
      // 2️⃣ If chain is unknown -> add then switch
      if (error.code === 4902) {
        try {
          const config = this.getNetworkConfig(chainHex);

          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [config],
          });

          // Try switching again after adding
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: chainHex }],
          });

          this.updateNetwork(chainHex);
        } catch (addError) {
          console.error("Failed to add chain", addError);
          alert("Failed to add network. Please switch manually.");
        }
      } else {
        alert("Switch network manually in MetaMask");
      }
    }
  }

  updateNetwork(chainId: string) {
    let res = getNetworkName(chainId);
    res == null || res == "Unknown"
      ? this.setState({ isSupportedNetwork: false })
      : this.setState({ isSupportedNetwork: true });
  }
  private getNetworkConfig(chainHex: string) {
    return NETWORK_CONFIGS[chainHex];
  }
  //   transactins related stuff
  async signMessage(message: string): Promise<string> {
    if (!this.state$.value.provider) throw new Error("Wallet not connected");
    const signer = await this.state$.value.provider.getSigner();
    return signer.signMessage(message);
  }
  // Get token info
  async getTokenInfo() {
    const tokenContract = this.getStateProp("tokenContract");
    if (!tokenContract) {
      throw new Error("Token contract is not initialized yet.");
    }
    const name = await tokenContract["name"]();
    const symbol = await tokenContract["symbol"]();
    const decimals = await tokenContract["decimals"]();
    const totalSupply = await tokenContract["totalSupply"]();

    return {
      name,
      symbol,
      decimals,
      totalSupply: ethers.formatUnits(totalSupply, decimals),
    };
  }
  // Get token balance of a wallet
  async getBalance(walletAddress: string): Promise<string> {
    const tokenContract = this.getStateProp("tokenContract");
    if (!tokenContract) {
      throw new Error("Token contract is not initialized yet.");
    }

    const decimals = await tokenContract["decimals"]();
    const balance = await tokenContract["balanceOf"](walletAddress);
    return ethers.formatUnits(balance, decimals);
  }

  // Transfer tokens
  async transfer(to: string, amount: string): Promise<string> {
    const tokenContract = this.getStateProp("tokenContract");
    if (!tokenContract) {
      throw new Error("Token contract is not initialized yet.");
    }
    const decimals = await tokenContract["decimals"]();
    const tx = await tokenContract["transfer"](
      to,
      ethers.parseUnits(amount, decimals)
    );
    console.log("Transaction hash:", tx.hash);

    await tx.wait();
    console.log("Transfer completed!", tx);

    return tx.hash;
  }
  // Mint tokens (only owner can call)
  async mint(to: string, amount: string): Promise<string> {
    const tokenContract = this.getStateProp("tokenContract");
    if (!tokenContract) {
      throw new Error("Token contract is not initialized yet.");
    }

    const decimals = await tokenContract["decimals"]();
    const tx = await tokenContract["mint"](
      to,
      ethers.parseUnits(amount, decimals)
    );
    console.log(`Minted ${amount} tokens to ${to}`);

    await tx.wait();
    console.log("Mint transaction confirmed!");

    return tx.hash;
  }
  // swapin func
  async approveToken(token: string, amount: string) {
    const signer = this.getStateProp("signer");
    const routerAddress = constants.UNISWAP_ROUTER_ADDRESS;

    const tokenContract = new ethers.Contract(
      token,
      constants.ERC20_ABI,
      signer
    );
    const decimals = await tokenContract["decimals"]();

    const tx = await tokenContract["approve"](
      routerAddress,
      ethers.parseUnits(amount, decimals)
    );

    await tx.wait();
    return tx.hash;
  }
  async swapTokens(amount: string, path: string[]): Promise<string> {
    const router = this.getStateProp("routerContract");
    const signer = this.getStateProp("signer");
    const user = await signer.getAddress();
    if (!router) {
      throw new Error("RouterContract is not initialized yet.");
    }
    const decimals = await new ethers.Contract(
      path[0],
      constants.ERC20_ABI,
      signer
    )["decimals"]();

    const tx = await router["swapExactTokensForTokens"](
      ethers.parseUnits(amount, decimals),
      0, // min out
      path,
      user,
      Math.floor(Date.now() / 1000) + 60 * 5
    );

    await tx.wait();
    return tx.hash;
    //swap eth token
    // const tx = await router.swapExactETHForTokens(
    //   0,
    //   [WETH_ADDRESS, ATT_ADDRESS],
    //   userAddress,
    //   Math.floor(Date.now() / 1000) + 600,
    //   { value: ethers.parseEther("0.1") }
    // );
  }

  async getSwapOutput(amountIn: string, path: string[]): Promise<string> {
    const router = this.getStateProp("routerContract");
    if (!router) throw new Error("Router not initialized");
    const tokenIn = path[0];
    const tokenOut = path[path.length - 1];

    const decimalsIn = await new ethers.Contract(
      tokenIn,
      constants.ERC20_ABI,
      this.getStateProp("provider")
    )["decimals"]();
    const decimalsOut = await new ethers.Contract(
      tokenOut,
      constants.ERC20_ABI,
      this.getStateProp("provider")
    )["decimals"]();

    const amounts = await router["getAmountsOut"](
      ethers.parseUnits(amountIn, decimalsIn),
      path
    );

    return ethers.formatUnits(amounts[amounts.length - 1], decimalsOut);
  }

  // ✅ Unsubscribe listeners
  ngOnDestroy() {
    if (window.ethereum) {
      window.ethereum.removeListener(
        "accountsChanged",
        this.handleAccountsChangedBound
      );
      window.ethereum.removeListener(
        "chainChanged",
        this.handleChainChangedBound
      );
    }
  }
}
