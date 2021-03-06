"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptimismEnv = void 0;
const contracts_1 = require("@eth-optimism/contracts");
const utils_1 = require("./utils");
const watcher_utils_1 = require("./watcher-utils");
const units_1 = require("@ethersproject/units");
/// Helper class for instantiating a test environment with a funded account
class OptimismEnv {
    constructor(args) {
        this.addressManager = args.addressManager;
        this.l1Bridge = args.l1Bridge;
        this.l1Messenger = args.l1Messenger;
        this.ovmEth = args.ovmEth;
        this.l2Bridge = args.l2Bridge;
        this.l2Messenger = args.l2Messenger;
        this.watcher = args.watcher;
        this.l1Wallet = args.l1Wallet;
        this.l2Wallet = args.l2Wallet;
        this.ctc = args.ctc;
    }
    static async new(addressManagerAddr, l1Wallet, l2Wallet) {
        const addressManager = utils_1.getAddressManager(addressManagerAddr, l1Wallet);
        const watcher = await watcher_utils_1.initWatcher(l1Wallet.provider, l2Wallet.provider, addressManager);
        const l1Bridge = await utils_1.getL1Bridge(l1Wallet, addressManager);
        const l2Bridge = await utils_1.getL2Bridge(l1Wallet);
        const ovmEth = utils_1.getOvmEth(l2Wallet);
        const l1Messenger = contracts_1.getContractFactory('iOVM_L1CrossDomainMessenger')
            .connect(l1Wallet)
            .attach(watcher.l1.messengerAddress);
        const l2Messenger = contracts_1.getContractFactory('iOVM_L2CrossDomainMessenger')
            .connect(l2Wallet)
            .attach(watcher.l2.messengerAddress);
        const ctcAddress = await addressManager.getAddress('OVM_CanonicalTransactionChain');
        const ctc = contracts_1.getContractFactory('OVM_CanonicalTransactionChain').connect(l1Wallet).attach(ctcAddress);
        return new OptimismEnv({
            addressManager,
            l1Bridge,
            l2Bridge,
            ctc,
            l1Messenger,
            ovmEth,
            l2Messenger,
            watcher,
            l1Wallet,
            l2Wallet,
        });
    }
    async depositL2(amount, requireBalance = units_1.parseEther('1')) {
        // fund the user if needed
        const balance = await this.l2Wallet.getBalance();
        if (balance.lt(requireBalance)) {
            await utils_1.depositL2(this.watcher, this.l1Bridge, this.l2Wallet.address, amount);
        }
    }
    // this will take a long time on networks other than local
    async withdrawL1(amount, requireBalance = units_1.parseEther('1')) {
        // fund the user if needed
        const balance = await this.l1Wallet.getBalance();
        if (balance.lt(requireBalance)) {
            await utils_1.withdrawL1(this.watcher, this.l2Bridge, this.l1Wallet.address, amount);
        }
    }
    async waitForXDomainTransaction(tx, direction) {
        return watcher_utils_1.waitForXDomainTransaction(this.watcher, tx, direction);
    }
}
exports.OptimismEnv = OptimismEnv;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW52LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2Vudi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx1REFBNEQ7QUFHNUQsbUNBQXVHO0FBQ3ZHLG1EQUEyRztBQUczRyxnREFBaUQ7QUFFakQsMkVBQTJFO0FBQzNFLE1BQWEsV0FBVztJQW1CdEIsWUFBWSxJQUFTO1FBQ25CLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQTtRQUN6QyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUE7UUFDN0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFBO1FBQ25DLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQTtRQUN6QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUE7UUFDN0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFBO1FBQ25DLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQTtRQUMzQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUE7UUFDN0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFBO1FBQzdCLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQTtJQUNyQixDQUFDO0lBRUQsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsa0JBQTBCLEVBQUUsUUFBZ0IsRUFBRSxRQUFnQjtRQUM3RSxNQUFNLGNBQWMsR0FBRyx5QkFBaUIsQ0FBQyxrQkFBa0IsRUFBRSxRQUFRLENBQUMsQ0FBQTtRQUN0RSxNQUFNLE9BQU8sR0FBRyxNQUFNLDJCQUFXLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsUUFBUSxFQUFFLGNBQWMsQ0FBQyxDQUFBO1FBQ3ZGLE1BQU0sUUFBUSxHQUFHLE1BQU0sbUJBQVcsQ0FBQyxRQUFRLEVBQUUsY0FBYyxDQUFDLENBQUE7UUFDNUQsTUFBTSxRQUFRLEdBQUcsTUFBTSxtQkFBVyxDQUFDLFFBQVEsQ0FBQyxDQUFBO1FBRTVDLE1BQU0sTUFBTSxHQUFHLGlCQUFTLENBQUMsUUFBUSxDQUFDLENBQUE7UUFDbEMsTUFBTSxXQUFXLEdBQUcsOEJBQWtCLENBQUMsNkJBQTZCLENBQUM7YUFDbEUsT0FBTyxDQUFDLFFBQVEsQ0FBQzthQUNqQixNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO1FBQ3RDLE1BQU0sV0FBVyxHQUFHLDhCQUFrQixDQUFDLDZCQUE2QixDQUFDO2FBQ2xFLE9BQU8sQ0FBQyxRQUFRLENBQUM7YUFDakIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtRQUV0QyxNQUFNLFVBQVUsR0FBRyxNQUFNLGNBQWMsQ0FBQyxVQUFVLENBQUMsK0JBQStCLENBQUMsQ0FBQTtRQUNuRixNQUFNLEdBQUcsR0FBRyw4QkFBa0IsQ0FBQywrQkFBK0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUE7UUFFcEcsT0FBTyxJQUFJLFdBQVcsQ0FBQztZQUNyQixjQUFjO1lBQ2QsUUFBUTtZQUNSLFFBQVE7WUFDUixHQUFHO1lBQ0gsV0FBVztZQUNYLE1BQU07WUFDTixXQUFXO1lBQ1gsT0FBTztZQUNQLFFBQVE7WUFDUixRQUFRO1NBQ1QsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUVELEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBb0IsRUFBRSxpQkFBK0Isa0JBQVUsQ0FBQyxHQUFHLENBQWlCO1FBQ2xHLDBCQUEwQjtRQUMxQixNQUFNLE9BQU8sR0FBRyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLENBQUE7UUFDaEQsSUFBSSxPQUFPLENBQUMsRUFBRSxDQUFDLGNBQWMsQ0FBQyxFQUFFO1lBQzlCLE1BQU0saUJBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUE7U0FDNUU7SUFDSCxDQUFDO0lBRUQsMERBQTBEO0lBQzFELEtBQUssQ0FBQyxVQUFVLENBQUMsTUFBb0IsRUFBRSxpQkFBK0Isa0JBQVUsQ0FBQyxHQUFHLENBQWlCO1FBQ25HLDBCQUEwQjtRQUMxQixNQUFNLE9BQU8sR0FBRyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLENBQUE7UUFDaEQsSUFBSSxPQUFPLENBQUMsRUFBRSxDQUFDLGNBQWMsQ0FBQyxFQUFFO1lBQzlCLE1BQU0sa0JBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUE7U0FDN0U7SUFDSCxDQUFDO0lBRUQsS0FBSyxDQUFDLHlCQUF5QixDQUM3QixFQUFzRCxFQUN0RCxTQUFvQjtRQUVwQixPQUFPLHlDQUF5QixDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxFQUFFLFNBQVMsQ0FBQyxDQUFBO0lBQy9ELENBQUM7Q0FDRjtBQXRGRCxrQ0FzRkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZXRDb250cmFjdEZhY3RvcnkgfSBmcm9tICdAZXRoLW9wdGltaXNtL2NvbnRyYWN0cydcbmltcG9ydCB7IFdhdGNoZXIgfSBmcm9tICdAZXRoLW9wdGltaXNtL2NvcmUtdXRpbHMnXG5pbXBvcnQgeyBDb250cmFjdCwgV2FsbGV0IH0gZnJvbSAnZXRoZXJzJ1xuaW1wb3J0IHsgZ2V0QWRkcmVzc01hbmFnZXIsIGdldE92bUV0aCwgZ2V0TDFCcmlkZ2UsIGdldEwyQnJpZGdlLCBkZXBvc2l0TDIsIHdpdGhkcmF3TDEgfSBmcm9tICcuL3V0aWxzJ1xuaW1wb3J0IHsgaW5pdFdhdGNoZXIsIENyb3NzRG9tYWluTWVzc2FnZVBhaXIsIERpcmVjdGlvbiwgd2FpdEZvclhEb21haW5UcmFuc2FjdGlvbiB9IGZyb20gJy4vd2F0Y2hlci11dGlscydcbmltcG9ydCB7IFRyYW5zYWN0aW9uUmVzcG9uc2UgfSBmcm9tICdAZXRoZXJzcHJvamVjdC9wcm92aWRlcnMnXG5pbXBvcnQgeyBCaWdOdW1iZXJpc2ggfSBmcm9tICdAZXRoZXJzcHJvamVjdC9iaWdudW1iZXInXG5pbXBvcnQgeyBwYXJzZUV0aGVyIH0gZnJvbSAnQGV0aGVyc3Byb2plY3QvdW5pdHMnXG5cbi8vLyBIZWxwZXIgY2xhc3MgZm9yIGluc3RhbnRpYXRpbmcgYSB0ZXN0IGVudmlyb25tZW50IHdpdGggYSBmdW5kZWQgYWNjb3VudFxuZXhwb3J0IGNsYXNzIE9wdGltaXNtRW52IHtcbiAgLy8gTDEgQ29udHJhY3RzXG4gIGFkZHJlc3NNYW5hZ2VyOiBDb250cmFjdFxuICBsMUJyaWRnZTogQ29udHJhY3RcbiAgbDFNZXNzZW5nZXI6IENvbnRyYWN0XG4gIGN0YzogQ29udHJhY3RcblxuICAvLyBMMiBDb250cmFjdHNcbiAgb3ZtRXRoOiBDb250cmFjdFxuICBsMkJyaWRnZTogQ29udHJhY3RcbiAgbDJNZXNzZW5nZXI6IENvbnRyYWN0XG5cbiAgLy8gVGhlIEwxIDw+IEwyIFN0YXRlIHdhdGNoZXJcbiAgd2F0Y2hlcjogV2F0Y2hlclxuXG4gIC8vIFRoZSB3YWxsZXRzXG4gIGwxV2FsbGV0OiBXYWxsZXRcbiAgbDJXYWxsZXQ6IFdhbGxldFxuXG4gIGNvbnN0cnVjdG9yKGFyZ3M6IGFueSkge1xuICAgIHRoaXMuYWRkcmVzc01hbmFnZXIgPSBhcmdzLmFkZHJlc3NNYW5hZ2VyXG4gICAgdGhpcy5sMUJyaWRnZSA9IGFyZ3MubDFCcmlkZ2VcbiAgICB0aGlzLmwxTWVzc2VuZ2VyID0gYXJncy5sMU1lc3NlbmdlclxuICAgIHRoaXMub3ZtRXRoID0gYXJncy5vdm1FdGhcbiAgICB0aGlzLmwyQnJpZGdlID0gYXJncy5sMkJyaWRnZVxuICAgIHRoaXMubDJNZXNzZW5nZXIgPSBhcmdzLmwyTWVzc2VuZ2VyXG4gICAgdGhpcy53YXRjaGVyID0gYXJncy53YXRjaGVyXG4gICAgdGhpcy5sMVdhbGxldCA9IGFyZ3MubDFXYWxsZXRcbiAgICB0aGlzLmwyV2FsbGV0ID0gYXJncy5sMldhbGxldFxuICAgIHRoaXMuY3RjID0gYXJncy5jdGNcbiAgfVxuXG4gIHN0YXRpYyBhc3luYyBuZXcoYWRkcmVzc01hbmFnZXJBZGRyOiBzdHJpbmcsIGwxV2FsbGV0OiBXYWxsZXQsIGwyV2FsbGV0OiBXYWxsZXQpOiBQcm9taXNlPE9wdGltaXNtRW52PiB7XG4gICAgY29uc3QgYWRkcmVzc01hbmFnZXIgPSBnZXRBZGRyZXNzTWFuYWdlcihhZGRyZXNzTWFuYWdlckFkZHIsIGwxV2FsbGV0KVxuICAgIGNvbnN0IHdhdGNoZXIgPSBhd2FpdCBpbml0V2F0Y2hlcihsMVdhbGxldC5wcm92aWRlciwgbDJXYWxsZXQucHJvdmlkZXIsIGFkZHJlc3NNYW5hZ2VyKVxuICAgIGNvbnN0IGwxQnJpZGdlID0gYXdhaXQgZ2V0TDFCcmlkZ2UobDFXYWxsZXQsIGFkZHJlc3NNYW5hZ2VyKVxuICAgIGNvbnN0IGwyQnJpZGdlID0gYXdhaXQgZ2V0TDJCcmlkZ2UobDFXYWxsZXQpXG5cbiAgICBjb25zdCBvdm1FdGggPSBnZXRPdm1FdGgobDJXYWxsZXQpXG4gICAgY29uc3QgbDFNZXNzZW5nZXIgPSBnZXRDb250cmFjdEZhY3RvcnkoJ2lPVk1fTDFDcm9zc0RvbWFpbk1lc3NlbmdlcicpXG4gICAgICAuY29ubmVjdChsMVdhbGxldClcbiAgICAgIC5hdHRhY2god2F0Y2hlci5sMS5tZXNzZW5nZXJBZGRyZXNzKVxuICAgIGNvbnN0IGwyTWVzc2VuZ2VyID0gZ2V0Q29udHJhY3RGYWN0b3J5KCdpT1ZNX0wyQ3Jvc3NEb21haW5NZXNzZW5nZXInKVxuICAgICAgLmNvbm5lY3QobDJXYWxsZXQpXG4gICAgICAuYXR0YWNoKHdhdGNoZXIubDIubWVzc2VuZ2VyQWRkcmVzcylcblxuICAgIGNvbnN0IGN0Y0FkZHJlc3MgPSBhd2FpdCBhZGRyZXNzTWFuYWdlci5nZXRBZGRyZXNzKCdPVk1fQ2Fub25pY2FsVHJhbnNhY3Rpb25DaGFpbicpXG4gICAgY29uc3QgY3RjID0gZ2V0Q29udHJhY3RGYWN0b3J5KCdPVk1fQ2Fub25pY2FsVHJhbnNhY3Rpb25DaGFpbicpLmNvbm5lY3QobDFXYWxsZXQpLmF0dGFjaChjdGNBZGRyZXNzKVxuXG4gICAgcmV0dXJuIG5ldyBPcHRpbWlzbUVudih7XG4gICAgICBhZGRyZXNzTWFuYWdlcixcbiAgICAgIGwxQnJpZGdlLFxuICAgICAgbDJCcmlkZ2UsXG4gICAgICBjdGMsXG4gICAgICBsMU1lc3NlbmdlcixcbiAgICAgIG92bUV0aCxcbiAgICAgIGwyTWVzc2VuZ2VyLFxuICAgICAgd2F0Y2hlcixcbiAgICAgIGwxV2FsbGV0LFxuICAgICAgbDJXYWxsZXQsXG4gICAgfSlcbiAgfVxuXG4gIGFzeW5jIGRlcG9zaXRMMihhbW91bnQ6IEJpZ051bWJlcmlzaCwgcmVxdWlyZUJhbGFuY2U6IEJpZ051bWJlcmlzaCA9IHBhcnNlRXRoZXIoJzEnKSBhcyBCaWdOdW1iZXJpc2gpIHtcbiAgICAvLyBmdW5kIHRoZSB1c2VyIGlmIG5lZWRlZFxuICAgIGNvbnN0IGJhbGFuY2UgPSBhd2FpdCB0aGlzLmwyV2FsbGV0LmdldEJhbGFuY2UoKVxuICAgIGlmIChiYWxhbmNlLmx0KHJlcXVpcmVCYWxhbmNlKSkge1xuICAgICAgYXdhaXQgZGVwb3NpdEwyKHRoaXMud2F0Y2hlciwgdGhpcy5sMUJyaWRnZSwgdGhpcy5sMldhbGxldC5hZGRyZXNzLCBhbW91bnQpXG4gICAgfVxuICB9XG5cbiAgLy8gdGhpcyB3aWxsIHRha2UgYSBsb25nIHRpbWUgb24gbmV0d29ya3Mgb3RoZXIgdGhhbiBsb2NhbFxuICBhc3luYyB3aXRoZHJhd0wxKGFtb3VudDogQmlnTnVtYmVyaXNoLCByZXF1aXJlQmFsYW5jZTogQmlnTnVtYmVyaXNoID0gcGFyc2VFdGhlcignMScpIGFzIEJpZ051bWJlcmlzaCkge1xuICAgIC8vIGZ1bmQgdGhlIHVzZXIgaWYgbmVlZGVkXG4gICAgY29uc3QgYmFsYW5jZSA9IGF3YWl0IHRoaXMubDFXYWxsZXQuZ2V0QmFsYW5jZSgpXG4gICAgaWYgKGJhbGFuY2UubHQocmVxdWlyZUJhbGFuY2UpKSB7XG4gICAgICBhd2FpdCB3aXRoZHJhd0wxKHRoaXMud2F0Y2hlciwgdGhpcy5sMkJyaWRnZSwgdGhpcy5sMVdhbGxldC5hZGRyZXNzLCBhbW91bnQpXG4gICAgfVxuICB9XG5cbiAgYXN5bmMgd2FpdEZvclhEb21haW5UcmFuc2FjdGlvbihcbiAgICB0eDogUHJvbWlzZTxUcmFuc2FjdGlvblJlc3BvbnNlPiB8IFRyYW5zYWN0aW9uUmVzcG9uc2UsXG4gICAgZGlyZWN0aW9uOiBEaXJlY3Rpb24sXG4gICk6IFByb21pc2U8Q3Jvc3NEb21haW5NZXNzYWdlUGFpcj4ge1xuICAgIHJldHVybiB3YWl0Rm9yWERvbWFpblRyYW5zYWN0aW9uKHRoaXMud2F0Y2hlciwgdHgsIGRpcmVjdGlvbilcbiAgfVxufVxuIl19