import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class CryptoUtilsService {
    constructor() {}
    private explorers: Record<string, string> = {
        '0x1': 'https://etherscan.io',
        '0x5': 'https://goerli.etherscan.io',
        '0xaa36a7': 'https://sepolia.etherscan.io',
        '0x38': 'https://bscscan.com',
        '0x89': 'https://polygonscan.com',
        '0x13881': 'https://mumbai.polygonscan.com',
    };

    /** ✅ Returns a full explorer URL for an address */
    getAddressUrl(chainId: string | null, address: string): string {
        const base = this.explorers[chainId || ''] || 'https://etherscan.io';
        return `${base}/address/${address}`;
    }

    /** ✅ For transactions if needed later */
    getTxUrl(chainId: string | null, tx: string): string {
        const base = this.explorers[chainId || ''] || 'https://etherscan.io';
        return `${base}/tx/${tx}`;
    }

    /** ✅ Open in new tab safely */
    openAddressInExplorer(chainId: string | null, address: string) {
        const url = this.getAddressUrl(chainId, address);
        window.open(url, '_blank');
    }
}
