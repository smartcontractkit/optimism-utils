import { Contract, Wallet, BigNumberish } from 'ethers';
import { Watcher } from './watcher';
export declare const PROXY_SEQUENCER_ENTRYPOINT_ADDRESS = "0x4200000000000000000000000000000000000004";
export declare const OVM_ETH_ADDRESS = "0x4200000000000000000000000000000000000006";
export declare const LOCAL_ADDRESS_MANAGER_ADDR = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export declare const KOVAN_ADDRESS_MANAGER_ADDR = "0xFaf27b24ba54C6910C12CFF5C9453C0e8D634e05";
export declare const MAINNET_ADDRESS_MANAGER_ADDR = "0xd3EeD86464Ff13B4BFD81a3bB1e753b7ceBA3A39";
export declare const getAddressManager: (address: string, provider: any) => any;
export declare const getGateway: (wallet: Wallet, AddressManager: Contract) => Promise<Contract>;
export declare const getOvmEth: (wallet: Wallet) => Contract;
export declare const fundUser: (watcher: Watcher, gateway: Contract, recipient: string | undefined, amount: BigNumberish) => Promise<void>;
//# sourceMappingURL=utils.d.ts.map