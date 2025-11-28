import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class StakingService {
  // provider: BrowserProvider | null = null;
  // signer: any = null;
  // account: string | null = null;
  // stakingContract: Contract | null = null;
  // tokenContract: Contract | null = null;
  // constructor() {}
  // // Connect wallet via MetaMask
  // async connectWallet(): Promise<string> {
  //   const detected = await detectEthereumProvider();
  //   if (!detected) throw new Error('MetaMask not found. Install MetaMask and try again.');
  //   this.provider = new BrowserProvider((window as any).ethereum);
  //   await this.provider.send('eth_requestAccounts', []);
  //   this.signer = await this.provider.getSigner();
  //   this.account = await this.signer.getAddress();
  //   this.tokenContract = new Contract(TOKEN_ADDRESS, ERC20_ABI, this.signer);
  //   this.stakingContract = new Contract(STAKING_ADDRESS, STAKING_ABI, this.signer);
  //   // Optional: listen to account/network changes
  //   (window as any).ethereum.on('accountsChanged', (accounts: string[]) => {
  //     this.account = accounts?.[0] ?? null;
  //   });
  //   (window as any).ethereum.on('chainChanged', async (chainId: Hex) => {
  //     // reload page or re-instantiate provider
  //     window.location.reload();
  //   });
  //   return this.account!;
  // }
  // // Read-only contract with provider (no signer)
  // private getReadOnlyProviderContract(address: string, abi: any) {
  //   if (!this.provider) this.provider = new BrowserProvider((window as any).ethereum);
  //   return new Contract(address, abi, this.provider);
  // }
  // // ERC20 helpers
  // async tokenDecimals(): Promise<number> {
  //   const c = this.tokenContract ?? this.getReadOnlyProviderContract(TOKEN_ADDRESS, ERC20_ABI);
  //   const d = await c.decimals();
  //   return Number(d);
  // }
  // async tokenSymbol(): Promise<string> {
  //   const c = this.tokenContract ?? this.getReadOnlyProviderContract(TOKEN_ADDRESS, ERC20_ABI);
  //   return await c.symbol();
  // }
  // async tokenBalance(address?: string) {
  //   const acct = address ?? this.account;
  //   const c = this.getReadOnlyProviderContract(TOKEN_ADDRESS, ERC20_ABI);
  //   const b = await c.balanceOf(acct);
  //   return b;
  // }
  // // Approve large allowance for staking contract
  // async approveForStaking(amountHuman: string, decimals = 18) {
  //   if (!this.tokenContract || !this.signer) throw new Error('Connect wallet first');
  //   const val = parseUnits(amountHuman, decimals);
  //   const tx = await this.tokenContract.approve(STAKING_ADDRESS, val);
  //   await tx.wait();
  //   return tx;
  // }
  // // Stake
  // async stake(amountHuman: string, decimals = 18) {
  //   if (!this.stakingContract || !this.signer) throw new Error('Connect wallet first');
  //   const amount = parseUnits(amountHuman, decimals);
  //   const tx = await this.stakingContract.stake(amount);
  //   await tx.wait();
  //   return tx;
  // }
  // // Claim
  // async claim() {
  //   if (!this.stakingContract || !this.signer) throw new Error('Connect wallet first');
  //   const tx = await this.stakingContract.claimReward();
  //   await tx.wait();
  //   return tx;
  // }
  // // Unstake
  // async unstake(amountHuman: string, decimals = 18) {
  //   if (!this.stakingContract || !this.signer) throw new Error('Connect wallet first');
  //   const amount = parseUnits(amountHuman, decimals);
  //   const tx = await this.stakingContract.unstake(amount);
  //   await tx.wait();
  //   return tx;
  // }
  // // Read staked + earned
  // async getStakedBalance(user?: string) {
  //   const acct = user ?? this.account;
  //   const c = this.getReadOnlyProviderContract(STAKING_ADDRESS, STAKING_ABI);
  //   const r = await c.stakedBalance(acct);
  //   return r;
  // }
  // async getEarned(user?: string) {
  //   const acct = user ?? this.account;
  //   const c = this.getReadOnlyProviderContract(STAKING_ADDRESS, STAKING_ABI);
  //   const r = await c.earned(acct);
  //   return r;
  // }
  // // Formatting helpers
  // formatUnits(value: any, decimals = 18) {
  //   return formatUnits(value, decimals);
  // }
  // ngOnDestroy() {
  //   this.sub?.unsubscribe();
  // }
  // async connect() {
  //   try {
  //     this.account = await this.eth.connectWallet();
  //     this.decimals = await this.eth.tokenDecimals();
  //     this.symbol = await this.eth.tokenSymbol();
  //     await this.refreshAll();
  //     // start polling for balances every 8s
  //     // this.sub = interval(8000).subscribe(() => this.refreshAll());
  //   } catch (err: any) {
  //     alert(err?.message ?? err);
  //   }
  // }
  // async refreshAll() {
  //   if (!this.account) return;
  //   try {
  //     const [stakedBn, earnedBn, balBn] = await Promise.all([
  //       this.eth.getStakedBalance(this.account),
  //       this.eth.getEarned(this.account),
  //       this.eth.tokenBalance(this.account)
  //     ]);
  //     this.staked = this.eth.formatUnits(stakedBn, this.decimals);
  //     this.earned = this.eth.formatUnits(earnedBn, this.decimals);
  //     this.balance = this.eth.formatUnits(balBn, this.decimals);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // }
  // async approve() {
  //   try {
  //     this.loading = true;
  //     this.txStatus = 'Approving...';
  //     await this.eth.approveForStaking('1000000', this.decimals); // approve large amount
  //     this.txStatus = 'Approved';
  //   } catch (e: any) {
  //     alert(e?.message ?? e);
  //   } finally {
  //     this.loading = false;
  //   }
  // }
  // async stake() {
  //   try {
  //     this.loading = true;
  //     this.txStatus = 'Staking...';
  //     await this.eth.stake(this.amountToStake, this.decimals);
  //     this.txStatus = 'Staked';
  //     await this.refreshAll();
  //   } catch (e: any) {
  //     alert(e?.message ?? e);
  //   } finally {
  //     this.loading = false;
  //   }
  // }
  // async claim() {
  //   try {
  //     this.loading = true;
  //     this.txStatus = 'Claiming...';
  //     await this.eth.claim();
  //     this.txStatus = 'Claimed';
  //     await this.refreshAll();
  //   } catch (e: any) {
  //     alert(e?.message ?? e);
  //   } finally {
  //     this.loading = false;
  //   }
  // }
  // async unstake() {
  //   try {
  //     this.loading = true;
  //     this.txStatus = 'Unstaking...';
  //     await this.eth.unstake(this.amountToUnstake, this.decimals);
  //     this.txStatus = 'Unstaked';
  //     await this.refreshAll();
  //   } catch (e: any) {
  //     alert(e?.message ?? e);
  //   } finally {
  //     this.loading = false;
  //   }
  // }
}
