"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitForXDomainTransaction = exports.Direction = exports.initWatcher = void 0;
const core_utils_1 = require("@eth-optimism/core-utils");
const initWatcher = async (l1Provider, l2Provider, AddressManager) => {
    const l1MessengerAddress = await AddressManager.getAddress('Proxy__OVM_L1CrossDomainMessenger');
    const l2MessengerAddress = await AddressManager.getAddress('OVM_L2CrossDomainMessenger');
    return new core_utils_1.Watcher({
        l1: {
            provider: l1Provider,
            messengerAddress: l1MessengerAddress,
        },
        l2: {
            provider: l2Provider,
            messengerAddress: l2MessengerAddress,
        },
    });
};
exports.initWatcher = initWatcher;
var Direction;
(function (Direction) {
    Direction[Direction["L1ToL2"] = 0] = "L1ToL2";
    Direction[Direction["L2ToL1"] = 1] = "L2ToL1";
})(Direction = exports.Direction || (exports.Direction = {}));
const waitForXDomainTransaction = async (watcher, tx, direction) => {
    const { src, dest } = direction === Direction.L1ToL2 ? { src: watcher.l1, dest: watcher.l2 } : { src: watcher.l2, dest: watcher.l1 };
    // await it if needed
    tx = await tx;
    // get the receipt and the full transaction
    const receipt = await tx.wait();
    const fullTx = await src.provider.getTransaction(tx.hash);
    // get the message hash which was created on the SentMessage
    const [xDomainMsgHash] = await watcher.getMessageHashesFromTx(src, tx.hash);
    // Get the transaction and receipt on the remote layer
    const remoteReceipt = (await watcher.getTransactionReceipt(dest, xDomainMsgHash));
    const remoteTx = await dest.provider.getTransaction(remoteReceipt.transactionHash);
    return {
        tx: fullTx,
        receipt,
        remoteTx,
        remoteReceipt,
    };
};
exports.waitForXDomainTransaction = waitForXDomainTransaction;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2F0Y2hlci11dGlscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy93YXRjaGVyLXV0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUdBLHlEQUFrRDtBQUUzQyxNQUFNLFdBQVcsR0FBRyxLQUFLLEVBQUUsVUFBb0IsRUFBRSxVQUFvQixFQUFFLGNBQXdCLEVBQUUsRUFBRTtJQUN4RyxNQUFNLGtCQUFrQixHQUFHLE1BQU0sY0FBYyxDQUFDLFVBQVUsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFBO0lBQy9GLE1BQU0sa0JBQWtCLEdBQUcsTUFBTSxjQUFjLENBQUMsVUFBVSxDQUFDLDRCQUE0QixDQUFDLENBQUE7SUFDeEYsT0FBTyxJQUFJLG9CQUFPLENBQUM7UUFDakIsRUFBRSxFQUFFO1lBQ0YsUUFBUSxFQUFFLFVBQVU7WUFDcEIsZ0JBQWdCLEVBQUUsa0JBQWtCO1NBQ3JDO1FBQ0QsRUFBRSxFQUFFO1lBQ0YsUUFBUSxFQUFFLFVBQVU7WUFDcEIsZ0JBQWdCLEVBQUUsa0JBQWtCO1NBQ3JDO0tBQ0YsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFBO0FBYlksUUFBQSxXQUFXLGVBYXZCO0FBU0QsSUFBWSxTQUdYO0FBSEQsV0FBWSxTQUFTO0lBQ25CLDZDQUFNLENBQUE7SUFDTiw2Q0FBTSxDQUFBO0FBQ1IsQ0FBQyxFQUhXLFNBQVMsR0FBVCxpQkFBUyxLQUFULGlCQUFTLFFBR3BCO0FBRU0sTUFBTSx5QkFBeUIsR0FBRyxLQUFLLEVBQzVDLE9BQWdCLEVBQ2hCLEVBQXNELEVBQ3RELFNBQW9CLEVBQ2EsRUFBRTtJQUNuQyxNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUNqQixTQUFTLEtBQUssU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsT0FBTyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxPQUFPLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsRUFBRSxFQUFFLENBQUE7SUFFaEgscUJBQXFCO0lBQ3JCLEVBQUUsR0FBRyxNQUFNLEVBQUUsQ0FBQTtJQUNiLDJDQUEyQztJQUMzQyxNQUFNLE9BQU8sR0FBRyxNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtJQUMvQixNQUFNLE1BQU0sR0FBRyxNQUFNLEdBQUcsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUV6RCw0REFBNEQ7SUFDNUQsTUFBTSxDQUFDLGNBQWMsQ0FBQyxHQUFHLE1BQU0sT0FBTyxDQUFDLHNCQUFzQixDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDM0Usc0RBQXNEO0lBQ3RELE1BQU0sYUFBYSxHQUFHLENBQUMsTUFBTSxPQUFPLENBQUMscUJBQXFCLENBQUMsSUFBSSxFQUFFLGNBQWMsQ0FBQyxDQUF1QixDQUFBO0lBQ3ZHLE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxDQUFBO0lBRWxGLE9BQU87UUFDTCxFQUFFLEVBQUUsTUFBTTtRQUNWLE9BQU87UUFDUCxRQUFRO1FBQ1IsYUFBYTtLQUNkLENBQUE7QUFDSCxDQUFDLENBQUE7QUExQlksUUFBQSx5QkFBeUIsNkJBMEJyQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbnRyYWN0LCBUcmFuc2FjdGlvbiB9IGZyb20gJ2V0aGVycydcbmltcG9ydCB7IFRyYW5zYWN0aW9uUmVjZWlwdCwgVHJhbnNhY3Rpb25SZXNwb25zZSB9IGZyb20gJ0BldGhlcnNwcm9qZWN0L3Byb3ZpZGVycydcbmltcG9ydCB7IFByb3ZpZGVyIH0gZnJvbSAnQGV0aGVyc3Byb2plY3QvYWJzdHJhY3QtcHJvdmlkZXInXG5pbXBvcnQgeyBXYXRjaGVyIH0gZnJvbSAnQGV0aC1vcHRpbWlzbS9jb3JlLXV0aWxzJ1xuXG5leHBvcnQgY29uc3QgaW5pdFdhdGNoZXIgPSBhc3luYyAobDFQcm92aWRlcjogUHJvdmlkZXIsIGwyUHJvdmlkZXI6IFByb3ZpZGVyLCBBZGRyZXNzTWFuYWdlcjogQ29udHJhY3QpID0+IHtcbiAgY29uc3QgbDFNZXNzZW5nZXJBZGRyZXNzID0gYXdhaXQgQWRkcmVzc01hbmFnZXIuZ2V0QWRkcmVzcygnUHJveHlfX09WTV9MMUNyb3NzRG9tYWluTWVzc2VuZ2VyJylcbiAgY29uc3QgbDJNZXNzZW5nZXJBZGRyZXNzID0gYXdhaXQgQWRkcmVzc01hbmFnZXIuZ2V0QWRkcmVzcygnT1ZNX0wyQ3Jvc3NEb21haW5NZXNzZW5nZXInKVxuICByZXR1cm4gbmV3IFdhdGNoZXIoe1xuICAgIGwxOiB7XG4gICAgICBwcm92aWRlcjogbDFQcm92aWRlcixcbiAgICAgIG1lc3NlbmdlckFkZHJlc3M6IGwxTWVzc2VuZ2VyQWRkcmVzcyxcbiAgICB9LFxuICAgIGwyOiB7XG4gICAgICBwcm92aWRlcjogbDJQcm92aWRlcixcbiAgICAgIG1lc3NlbmdlckFkZHJlc3M6IGwyTWVzc2VuZ2VyQWRkcmVzcyxcbiAgICB9LFxuICB9KVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIENyb3NzRG9tYWluTWVzc2FnZVBhaXIge1xuICB0eDogVHJhbnNhY3Rpb25cbiAgcmVjZWlwdDogVHJhbnNhY3Rpb25SZWNlaXB0XG4gIHJlbW90ZVR4OiBUcmFuc2FjdGlvblxuICByZW1vdGVSZWNlaXB0OiBUcmFuc2FjdGlvblJlY2VpcHRcbn1cblxuZXhwb3J0IGVudW0gRGlyZWN0aW9uIHtcbiAgTDFUb0wyLFxuICBMMlRvTDEsXG59XG5cbmV4cG9ydCBjb25zdCB3YWl0Rm9yWERvbWFpblRyYW5zYWN0aW9uID0gYXN5bmMgKFxuICB3YXRjaGVyOiBXYXRjaGVyLFxuICB0eDogUHJvbWlzZTxUcmFuc2FjdGlvblJlc3BvbnNlPiB8IFRyYW5zYWN0aW9uUmVzcG9uc2UsXG4gIGRpcmVjdGlvbjogRGlyZWN0aW9uLFxuKTogUHJvbWlzZTxDcm9zc0RvbWFpbk1lc3NhZ2VQYWlyPiA9PiB7XG4gIGNvbnN0IHsgc3JjLCBkZXN0IH0gPVxuICAgIGRpcmVjdGlvbiA9PT0gRGlyZWN0aW9uLkwxVG9MMiA/IHsgc3JjOiB3YXRjaGVyLmwxLCBkZXN0OiB3YXRjaGVyLmwyIH0gOiB7IHNyYzogd2F0Y2hlci5sMiwgZGVzdDogd2F0Y2hlci5sMSB9XG5cbiAgLy8gYXdhaXQgaXQgaWYgbmVlZGVkXG4gIHR4ID0gYXdhaXQgdHhcbiAgLy8gZ2V0IHRoZSByZWNlaXB0IGFuZCB0aGUgZnVsbCB0cmFuc2FjdGlvblxuICBjb25zdCByZWNlaXB0ID0gYXdhaXQgdHgud2FpdCgpXG4gIGNvbnN0IGZ1bGxUeCA9IGF3YWl0IHNyYy5wcm92aWRlci5nZXRUcmFuc2FjdGlvbih0eC5oYXNoKVxuXG4gIC8vIGdldCB0aGUgbWVzc2FnZSBoYXNoIHdoaWNoIHdhcyBjcmVhdGVkIG9uIHRoZSBTZW50TWVzc2FnZVxuICBjb25zdCBbeERvbWFpbk1zZ0hhc2hdID0gYXdhaXQgd2F0Y2hlci5nZXRNZXNzYWdlSGFzaGVzRnJvbVR4KHNyYywgdHguaGFzaClcbiAgLy8gR2V0IHRoZSB0cmFuc2FjdGlvbiBhbmQgcmVjZWlwdCBvbiB0aGUgcmVtb3RlIGxheWVyXG4gIGNvbnN0IHJlbW90ZVJlY2VpcHQgPSAoYXdhaXQgd2F0Y2hlci5nZXRUcmFuc2FjdGlvblJlY2VpcHQoZGVzdCwgeERvbWFpbk1zZ0hhc2gpKSBhcyBUcmFuc2FjdGlvblJlY2VpcHRcbiAgY29uc3QgcmVtb3RlVHggPSBhd2FpdCBkZXN0LnByb3ZpZGVyLmdldFRyYW5zYWN0aW9uKHJlbW90ZVJlY2VpcHQudHJhbnNhY3Rpb25IYXNoKVxuXG4gIHJldHVybiB7XG4gICAgdHg6IGZ1bGxUeCxcbiAgICByZWNlaXB0LFxuICAgIHJlbW90ZVR4LFxuICAgIHJlbW90ZVJlY2VpcHQsXG4gIH1cbn1cbiJdfQ==