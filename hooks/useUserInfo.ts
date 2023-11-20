import { useAccount, useContractReads } from "wagmi";
import { NativeTokenContract } from "@/config/contract";

export function useUserInfo() {
    const { isConnected, address } = useAccount()

    return useContractReads({
        contracts: [
            {
                ...NativeTokenContract,
                functionName: "balanceOf",
                args: [address ?? "0x"],
            },
            {
                ...NativeTokenContract,
                functionName: "pendingRewards",
                args: [address ?? "0x"],
            },
        ],
        scopeKey: address,
        enabled: isConnected,
        select: (data) => ({
            balance: data[0],
            rewards: data[1]
        })
    })
}
