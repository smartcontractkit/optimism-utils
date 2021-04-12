import { Watcher } from './watcher';
import { Contract, Wallet } from 'ethers';
import { CrossDomainMessagePair, Direction } from './watcher-utils';
import { TransactionResponse } from '@ethersproject/providers';
export declare class OptimismEnv {
    addressManager: Contract;
    gateway: Contract;
    l1Messenger: Contract;
    ctc: Contract;
    ovmEth: Contract;
    l2Messenger: Contract;
    watcher: Watcher;
    l1Wallet: Wallet;
    l2Wallet: Wallet;
    constructor(args: any);
    static new(): Promise<OptimismEnv>;
    waitForXDomainTransaction(tx: Promise<TransactionResponse> | TransactionResponse, direction: Direction): Promise<CrossDomainMessagePair>;
}
//# sourceMappingURL=env.d.ts.map