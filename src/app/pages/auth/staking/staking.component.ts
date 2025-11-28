import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { StakingService } from "@pages/services/staking.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-staking",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./staking.component.html",
  styleUrls: ["./staking.component.css"],
})
export class StakingComponent {
  account: string | null = null;
  staked = "0";
  earned = "0";
  balance = "0";
  decimals = 18;
  symbol = "ATT";

  amountToStake = "1";
  amountToUnstake = "1";

  // auto-refresh subscription
  private sub: Subscription | null = null;

  loading = false;
  txStatus = "";

  constructor(private eth: StakingService) {}

  async ngOnInit() {
    // nothing here; wait for user to connect
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  // async connect() {
  //   try {
  //     this.account = await this.eth.connectWallet();
  //     this.decimals = await this.eth.tokenDecimals();
  //     this.symbol = await this.eth.tokenSymbol();
  //     await this.refreshAll();

  //     // start polling for balances every 8s
  //     this.sub = interval(8000).subscribe(() => this.refreshAll());
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
