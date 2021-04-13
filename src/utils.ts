import { Contract, Wallet, constants, BigNumberish, BigNumber } from 'ethers'
import { getContractFactory, getContractInterface } from '@eth-optimism/contracts'
import { Watcher } from '@eth-optimism/core-utils'
import { Direction, waitForXDomainTransaction } from './watcher-utils'

// Predeploys
export const PROXY_SEQUENCER_ENTRYPOINT_ADDRESS = '0x4200000000000000000000000000000000000004'
export const OVM_ETH_ADDRESS = '0x4200000000000000000000000000000000000006'

// The address manager is always at the same address in testnet deployments
export const LOCAL_ADDRESS_MANAGER_ADDR = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
export const KOVAN_ADDRESS_MANAGER_ADDR = '0xFaf27b24ba54C6910C12CFF5C9453C0e8D634e05'
export const MAINNET_ADDRESS_MANAGER_ADDR = '0xd3EeD86464Ff13B4BFD81a3bB1e753b7ceBA3A39'

export const getAddressManager = (address: string, provider: any) =>
  getContractFactory('Lib_AddressManager').connect(provider).attach(address)

// Gets the gateway using the proxy if available
export const getGateway = async (wallet: Wallet, AddressManager: Contract) => {
  const l1GatewayInterface = getContractInterface('OVM_L1ETHGateway')
  const ProxyGatewayAddress = await AddressManager.getAddress('Proxy__OVM_L1ETHGateway')
  const addressToUse =
    ProxyGatewayAddress !== constants.AddressZero
      ? ProxyGatewayAddress
      : await AddressManager.getAddress('OVM_L1ETHGateway')

  const OVM_L1ETHGateway = new Contract(addressToUse, l1GatewayInterface, wallet)

  return OVM_L1ETHGateway
}

export const getOvmEth = (wallet: Wallet) => new Contract(OVM_ETH_ADDRESS, getContractInterface('OVM_ETH'), wallet)

export const depositL2 = async (
  watcher: Watcher,
  gateway: Contract,
  recipient: string | undefined,
  amount: BigNumberish,
) => {
  const value = BigNumber.from(amount)
  const tx = recipient ? gateway.depositTo(recipient, { value }) : gateway.deposit({ value })
  await waitForXDomainTransaction(watcher, tx, Direction.L1ToL2)
}

export const withdrawL1 = async (
  watcher: Watcher,
  gateway: Contract,
  recipient: string | undefined,
  amount: BigNumberish,
) => {
  const value = BigNumber.from(amount)
  const tx = recipient ? gateway.withdrawTo(recipient, { value }) : gateway.withdraw({ value })
  await waitForXDomainTransaction(watcher, tx, Direction.L1ToL2)
}
