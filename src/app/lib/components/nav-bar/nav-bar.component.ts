import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component } from "@angular/core";
import { EthWalletService } from "@pages/services/eth-wallet.service";
import { BrowserProvider, Contract, ethers, Signer } from "ethers";
import { Subscription } from "rxjs";
import { ERC20_ABI } from "src/app/abis/erc20.abi";
import { constants } from "src/app/constants";
import { FormateAddressPipe } from "src/app/shared/pipes/formate-address.pipe";
import { copyToClipboard } from "src/app/utils/crypto.utils";
import {
  getNativeCurrency,
  openAddressInExplorer,
} from "src/app/utils/network.config.utils";
@Component({
  selector: "app-nav-bar",
  standalone: true,
  imports: [CommonModule, FormateAddressPipe],
  templateUrl: "./nav-bar.component.html",
  styleUrls: ["./nav-bar.component.css"],
})
export class NavBarComponent {
  account: string | null = null;
  chainName: string | null = null;
  isMetaMaskInstalled = true;
  isSupportedNetwork = true;
  chainId: string | null = null;
  balance: string | number = 0;
  nativeSymbol: string | null = null;
  provider: BrowserProvider | any = "";
  signer: Signer | null = null;

  private sub = new Subscription();
  tokenContract: Contract | undefined;

  constructor(
    private walletService: EthWalletService,
    private cdr: ChangeDetectorRef
  ) {
    this.sub.add(
      this.walletService.walletState$.subscribe((s: any) => {
        this.account = s.account;
        this.chainName = s.networkName;
        this.isMetaMaskInstalled = s.isMetaMaskInstalled;
        this.isSupportedNetwork = s.isSupportedNetwork;
        this.chainId = s.chainId;
        this.balance = s.balance;
        this.nativeSymbol = getNativeCurrency(s.chainId);
        this.provider = s.provider;
        this.signer = s.signer;
        this.cdr.markForCheck();
      })
    );
  }
  ngOnInit() {
    this.walletService.initFromProvider();
  }
  getTokenInfo() {
    this.walletService
      .getTokenInfo()
      .then((resp) => console.log("res of  getTokenINfo--------->", resp));
  }
  async connect() {
    try {
      await this.walletService.connectWallet();
    } catch (err: any) {
      console.error("connect error", err);
      alert(err?.message ?? "Failed to connect wallet");
    }
  }
  disConnectWallet() {
    this.walletService.setState({ account: null });
  }
  switchTo(networkId: number) {
    this.walletService.switchTo(networkId);
  }
  copyAddress() {
    if (!this.account) return;
    copyToClipboard(this.account);
  }

  openInExplorer() {
    if (!this.account || !this.chainId) return;
    openAddressInExplorer(this.chainId, this.account);
  }
  async signMessage() {
    let msg = "hy from Asad Qayyum";
    let res = await this.walletService.signMessage(msg);
    debugger;
    console.log("signature rs==>", res);
  }
  async sendTransaction(to: string, amountInEth: string) {
    try {
      debugger;
      this.walletService.initFromProvider();
      // Get signer (connected MetaMask account)
      const signer = await this.provider.getSigner();
      if (this.balance > amountInEth) {
        if (signer) {
          const tx = {
            to,
            value: ethers.parseEther(amountInEth), // amount in ETH
          };
          // Create transaction object
          // Send transaction
          const txResponse = await signer.sendTransaction(tx);
          console.log("Transaction sent:", txResponse);
          // Wait for confirmation
          const receipt = await txResponse.wait();
          this.walletService.initFromProvider();
          console.log("Transaction mined:", receipt);
          return receipt;
        }
      } else {
        alert("Insufficient Fuds to transfer.");
      }
    } catch (err: any) {
      console.error("Transaction error:", err);
      throw err;
    }
  }
  //sending sepoliaEth Token
  async sendEth() {
    try {
      const receipt = await this.sendTransaction(
        "0xf238718ad10db1a00bb5763cb5becfd9d26ea747",
        "0.01"
      );

      console.log("Transaction successful:", receipt);
    } catch (error) {
      console.error("Failed to send:", error);
    }
  }
  async sendERC20(tokenAddress: string, to: string, amount: string) {
    try {
      const signer = await this.provider.getSigner();
      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
      // MUST use bracket notation for v6
      const decimals = await contract["decimals"]();
      const parsedAmount = ethers.parseUnits(amount, decimals);
      const tx = await contract["transfer"](to, parsedAmount);
      console.log("Token Transfer Sent:", tx);
      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      console.error("ERC20 transfer failed:", error);
      throw error;
    }
  }

  async getTokenBalance(tokenAddress: string, wallet: string) {
    debugger;
    const signer = await this.provider.getSigner();
    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
    const decimals = await contract["decimals"]();
    const balance = await contract["balanceOf"](wallet);
    return ethers.formatUnits(balance, decimals);
  }
  async checkBalance() {
    let bal = await this.getTokenBalance(
      "0x9ab08019a0a63246181ac529295c333c8c66923c", // Working USDT testnet
      "0x8259cc3d9090c824fdf8aa010514acdc5f56dfed"
    );
  }
  async sendToken() {
    try {
      const receipt = await this.sendERC20(
        "0x8301F2213c0eeD49a7E28Ae4c3e91722919B8B47", // e.g., USDT on testnet
        "0xReceiverWalletAddress",
        "10" // send 10 tokens
      );

      console.log("Transfer success:", receipt);
    } catch (err) {
      console.error("Transfer failed:", err);
    }
  }
  async initContract() {
    const signer = await this.provider.getSigner();
    this.tokenContract = new ethers.Contract(
      constants.mtt_contract_address,
      constants.ERC20_ABI,
      signer
    );
  }
  transferToken() {
    this.walletService.transfer(constants.receiver, "10").then((resp) => {
      console.log("check transfer tokens", resp);
    });
  }
  getTokenBal() {
    if (this.account)
      this.walletService.getBalance(this.account).then((resp) => {
        console.log(`getTokenBal of ${this.account}`, resp);
      });
  }
  goToSwapUi() {}
  mintToken() {
    this.walletService.mint(constants.receiver, "10").then((resp) => {
      console.log("response of token minting", resp);
    });
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
