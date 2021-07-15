import { Contract, Wallet, constants, BigNumberish, BigNumber, utils } from 'ethers'
import { getContractFactory, getContractInterface, predeploys } from '@eth-optimism/contracts'
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

// Gets the bridge contract
export const getL1Bridge = async (wallet: Wallet, AddressManager: Contract) => {
  const l1BridgeInterface = getContractInterface('OVM_L1StandardBridge')
  const ProxyBridgeAddress = await AddressManager.getAddress('Proxy__OVM_L1StandardBridge')

  if (!utils.isAddress(ProxyBridgeAddress) || ProxyBridgeAddress === constants.AddressZero) {
    throw new Error('Proxy__OVM_L1StandardBridge not found')
  }

  const OVM_L1StandardBridge = new Contract(ProxyBridgeAddress, l1BridgeInterface, wallet)
  return OVM_L1StandardBridge
}

export const getL2Bridge = async (wallet: Wallet) => {
  const L2BridgeInterface = getContractInterface('OVM_L2StandardBridge')

  const OVM_L2StandardBridge = new Contract(predeploys.OVM_L2StandardBridge, L2BridgeInterface, wallet)
  return OVM_L2StandardBridge
}

export const getOvmEth = (wallet: Wallet) => {
  const OVM_ETH = new Contract(OVM_ETH_ADDRESS, getContractInterface('OVM_ETH'), wallet)

  return OVM_ETH
}

export const depositL2 = async (
  watcher: Watcher,
  gateway: Contract,
  recipient: string | undefined,
  amount: BigNumberish,
) => {
  const value = BigNumber.from(amount)
  const tx = recipient
    ? gateway.depositETHTo(recipient, 1_300_000, '0x', { value })
    : gateway.depositETH(1_300_000, '0x', { value })
  await waitForXDomainTransaction(watcher, tx, Direction.L1ToL2)
}

export const withdrawL1 = async (
  watcher: Watcher,
  gateway: Contract,
  recipient: string | undefined,
  amount: BigNumberish,
) => {
  const value = BigNumber.from(amount)
  const tx = recipient ? gateway.withdrawTo(recipient, value, 300_000, '') : gateway.withdraw(value, 300_000, '')
  await waitForXDomainTransaction(watcher, tx, Direction.L2ToL1)
}
