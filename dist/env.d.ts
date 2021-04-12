import { Watcher } from './watcher';
import { BigNumberish, Contract, Wallet } from 'ethers';
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
    static new(addressManagerAddr: string, l1Wallet: Wallet, l2Wallet: Wallet): Promise<OptimismEnv>;
    fundL2(amount: BigNumberish, requireZeroBalance?: boolean): Promise<void>;
    waitForXDomainTransaction(tx: Promise<TransactionResponse> | TransactionResponse, direction: Direction): Promise<CrossDomainMessagePair>;
}
//# sourceMappingURL=env.d.ts.map