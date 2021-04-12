import { Contract, Transaction } from 'ethers';
import { TransactionReceipt, TransactionResponse } from '@ethersproject/providers';
import { Provider } from '@ethersproject/abstract-provider';
import { Watcher } from './watcher';
export declare const initWatcher: (l1Provider: Provider, l2Provider: Provider, AddressManager: Contract) => Promise<Watcher>;
export interface CrossDomainMessagePair {
    tx: Transaction;
    receipt: TransactionReceipt;
    remoteTx: Transaction;
    remoteReceipt: TransactionReceipt;
}
export declare enum Direction {
    L1ToL2 = 0,
    L2ToL1 = 1
}
export declare const waitForXDomainTransaction: (watcher: Watcher, tx: Promise<TransactionResponse> | TransactionResponse, direction: Direction) => Promise<CrossDomainMessagePair>;
//# sourceMappingURL=watcher-utils.d.ts.map