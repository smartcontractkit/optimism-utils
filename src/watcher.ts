// https://github.com/ethereum-optimism/optaimism/blob/master/packages/core-utils/src/watcher.ts

/* External Imports */
import { ethers } from 'ethers'
import { Provider, TransactionReceipt } from '@ethersproject/abstract-provider'

export interface Layer {
  provider: Provider
  messengerAddress: string
}

export interface WatcherOptions {
  l1: Layer
  l2: Layer
}

export class Watcher {
  public l1: Layer
  public l2: Layer
  public NUM_BLOCKS_TO_FETCH: number = 10_000_000

  constructor(opts: WatcherOptions) {
    this.l1 = opts.l1
    this.l2 = opts.l2
  }

  public async getMessageHashesFromL1Tx(l1TxHash: string): Promise<string[]> {
    return this.getMessageHashesFromTx(this.l1, l1TxHash)
  }
  public async getMessageHashesFromL2Tx(l2TxHash: string): Promise<string[]> {
    return this.getMessageHashesFromTx(this.l2, l2TxHash)
  }

  public async getL1TransactionReceipt(
    l2ToL1MsgHash: string,
    pollForPending: boolean = true,
  ): Promise<TransactionReceipt | undefined> {
    return this.getTransactionReceipt(this.l2, l2ToL1MsgHash, pollForPending)
  }

  public async getL2TransactionReceipt(
    l1ToL2MsgHash: string,
    pollForPending: boolean = true,
  ): Promise<TransactionReceipt | undefined> {
    return this.getTransactionReceipt(this.l2, l1ToL2MsgHash, pollForPending)
  }

  public async getMessageHashesFromTx(layer: Layer, txHash: string): Promise<string[]> {
    const receipt = await layer.provider.getTransactionReceipt(txHash)
    if (!receipt) {
      return []
    }

    const msgHashes = []
    for (const log of receipt.logs) {
      if (log.address === layer.messengerAddress && log.topics[0] === ethers.utils.id('SentMessage(bytes)')) {
        const [message] = ethers.utils.defaultAbiCoder.decode(['bytes'], log.data)
        msgHashes.push(ethers.utils.solidityKeccak256(['bytes'], [message]))
      }
    }
    return msgHashes
  }

  public async getTransactionReceipt(
    layer: Layer,
    msgHash: string,
    pollForPending: boolean = true,
  ): Promise<TransactionReceipt | undefined> {
    const blockNumber = await layer.provider.getBlockNumber()
    const startingBlock = Math.max(blockNumber - this.NUM_BLOCKS_TO_FETCH, 0)
    const filter = {
      address: layer.messengerAddress,
      topics: [ethers.utils.id(`RelayedMessage(bytes32)`)],
      fromBlock: startingBlock,
    }
    const logs = await layer.provider.getLogs(filter)
    const matches = logs.filter((log: any) => log.data === msgHash)

    // Message was relayed in the past
    if (matches.length > 0) {
      if (matches.length > 1) {
        throw Error('Found multiple transactions relaying the same message hash.')
      }
      return layer.provider.getTransactionReceipt(matches[0].transactionHash)
    }
    if (!pollForPending) {
      return Promise.resolve(undefined)
    }

    // Message has yet to be relayed, poll until it is found
    return new Promise(async (resolve, reject) => {
      layer.provider.on(filter, async (log: any) => {
        if (log.data === msgHash) {
          try {
            const txReceipt = await layer.provider.getTransactionReceipt(log.transactionHash)
            layer.provider.off(filter)
            resolve(txReceipt)
          } catch (e) {
            reject(e)
          }
        }
      })
    })
  }
}
