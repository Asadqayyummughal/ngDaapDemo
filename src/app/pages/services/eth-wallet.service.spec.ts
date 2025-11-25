import { TestBed } from '@angular/core/testing';

import { EthWalletService } from './eth-wallet.service';

describe('EthWalletService', () => {
  let service: EthWalletService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EthWalletService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
