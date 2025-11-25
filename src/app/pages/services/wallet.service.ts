import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import Web3 from 'web3';
// declare let window: any;
declare global {
    interface Window {
        ethereum?: any;
    }
}
export type NetworkInfo = {
    chainId: number;
    name: string;
    unsupported?: boolean;
};

@Injectable({
    providedIn: 'root',
})
export class WalletService {
    // private walletAddressSubject = new BehaviorSubject<string | null>(null);
    // walletAddress$ = this.walletAddressSubject.asObservable();
    // private chainIdSubject = new BehaviorSubject<string | null>(null);
    // chainId$ = this.chainIdSubject.asObservable();
    private web3!: Web3;
    public address$ = new BehaviorSubject<string | null>(null);
    public network$ = new BehaviorSubject<NetworkInfo | null>(null);
    public metamaskAvailable$ = new BehaviorSubject<boolean>(!!window.ethereum);
    private SUPPORTED_CHAIN_IDS = new Set<number>([
        1, // Mainnet
        5, // Goerli
        11155111, // Sepolia
    ]);

    constructor() {
        if (window.ethereum) {
            this.web3 = new Web3(window.ethereum);
            this.init();
            this.registerListeners();
        }
    }

    // async connectWallet(): Promise<void> {
    //     if (!window.ethereum) {
    //         alert('MetaMask is not installed! Please install it.');
    //         return;
    //     }
    //     try {
    //         const accounts = await window.ethereum.request({
    //             method: 'eth_requestAccounts',
    //         });
    //         const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    //         this.walletAddressSubject.next(accounts[0]);
    //         this.listenForChanges();
    //     } catch (error) {
    //         console.error('Wallet connection failed:', error);
    //     }
    // }

    // listenForChanges() {
    //     if (!window.ethereum) return;
    //     window.ethereum.on('chainChanged', (chainId: string) => {
    //         console.log('Network changed:', chainId);
    //         this._ngZone.run(() => {
    //             this.chainIdSubject.next(chainId);
    //         });
    //     });
    //     window.ethereum.on('accountsChanged', (accounts: string[]) => {
    //         this._ngZone.run(() => {
    //             this.walletAddressSubject.next(accounts[0] || null);
    //         });
    //     });
    // }

    // async checkExistingConnection() {
    //     if (!window.ethereum) return;

    //     try {
    //         const accounts = await window.ethereum.request({ method: 'eth_accounts' });

    //         if (accounts.length > 0) {
    //             // ✅ Update inside Angular zone
    //             this._ngZone.run(() => {
    //                 this.walletAddressSubject.next(accounts[0]);
    //             });
    //         }
    //         const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    //         this._ngZone.run(() => {
    //             this.chainIdSubject.next(chainId);
    //         });
    //     } catch (error) {
    //         console.error('Failed to check existing wallet connection', error);
    //     }
    // }

    //second way
    private async init() {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                this.address$.next(accounts[0]);
            }

            const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
            const chainId = parseInt(chainIdHex, 16);
            this.network$.next({
                chainId,
                name: this.chainIdToName(chainId),
                unsupported: !this.SUPPORTED_CHAIN_IDS.has(chainId),
            });
        } catch (err) {
            console.error('Init error:', err);
        }
    }

    async connectWallet() {
        if (!window.ethereum) {
            this.metamaskAvailable$.next(false);
            throw new Error('MetaMask is not installed');
        }

        try {
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts',
            });

            this.address$.next(accounts[0]);

            const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
            const chainId = parseInt(chainIdHex, 16);

            this.network$.next({
                chainId,
                name: this.chainIdToName(chainId),
                unsupported: !this.SUPPORTED_CHAIN_IDS.has(chainId),
            });
        } catch (err) {
            console.error('connectWallet error:', err);
            throw err;
        }
    }

    private registerListeners() {
        if (!window.ethereum) return;

        // Account changed
        window.ethereum.on('accountsChanged', (accounts: string[]) => {
            if (accounts.length === 0) {
                this.address$.next(null);
            } else {
                this.address$.next(accounts[0]);
            }
        });

        // Network changed
        window.ethereum.on('chainChanged', (chainIdHex: string) => {
            const chainId = parseInt(chainIdHex, 16);
            this.network$.next({
                chainId,
                name: this.chainIdToName(chainId),
                unsupported: !this.SUPPORTED_CHAIN_IDS.has(chainId),
            });
        });
    }

    private chainIdToName(chainId: number): string {
        switch (chainId) {
            case 1:
                return 'Ethereum Mainnet';
            case 5:
                return 'Goerli';
            case 11155111:
                return 'Sepolia';
            case 3:
                return 'Ropsten (deprecated)';
            case 4:
                return 'Rinkeby (deprecated)';
            default:
                return `Chain ${chainId}`;
        }
    }

    public disconnectLocal() {
        this.address$.next(null);
    }
}
