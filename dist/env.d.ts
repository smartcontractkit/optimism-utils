import { Watcher } from '@eth-optimism/core-utils';
import { Contract, Wallet } from 'ethers';
import { CrossDomainMessagePair, Direction } from './watcher-utils';
import { TransactionResponse } from '@ethersproject/providers';
import { BigNumberish } from '@ethersproject/bignumber';
export declare class OptimismEnv {
    addressManager: Contract;
    l1Bridge: Contract;
    l1Messenger: Contract;
    ctc: Contract;
    ovmEth: Contract;
    l2Bridge: Contract;
    l2Messenger: Contract;
    watcher: Watcher;
    l1Wallet: Wallet;
    l2Wallet: Wallet;
    constructor(args: any);
    static new(addressManagerAddr: string, l1Wallet: Wallet, l2Wallet: Wallet): Promise<OptimismEnv>;
    depositL2(amount: BigNumberish, requireBalance?: BigNumberish): Promise<void>;
    withdrawL1(amount: BigNumberish, requireBalance?: BigNumberish): Promise<void>;
    waitForXDomainTransaction(tx: Promise<TransactionResponse> | TransactionResponse, direction: Direction): Promise<CrossDomainMessagePair>;
}
//# sourceMappingURL=env.d.ts.map