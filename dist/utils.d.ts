import { Contract, Wallet, providers, BigNumberish, BigNumber } from 'ethers';
import { Watcher } from './watcher';
export declare const GWEI: BigNumber;
export declare const l1Provider: providers.JsonRpcProvider;
export declare const l2Provider: providers.JsonRpcProvider;
export declare const l1Wallet: Wallet;
export declare const l2Wallet: Wallet;
export declare const PROXY_SEQUENCER_ENTRYPOINT_ADDRESS = "0x4200000000000000000000000000000000000004";
export declare const OVM_ETH_ADDRESS = "0x4200000000000000000000000000000000000006";
export declare const addressManagerAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export declare const getAddressManager: (provider: any) => any;
export declare const getGateway: (wallet: Wallet, AddressManager: Contract) => Promise<Contract>;
export declare const getOvmEth: (wallet: Wallet) => Contract;
export declare const fundUser: (watcher: Watcher, gateway: Contract, amount: BigNumberish, recipient?: string | undefined) => Promise<void>;
//# sourceMappingURL=utils.d.ts.map