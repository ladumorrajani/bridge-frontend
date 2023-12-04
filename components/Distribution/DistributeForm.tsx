"use client";

import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from "wagmi";
import { NativeTokenContract } from "@/config/contracts";
import { useExpectedRewards } from "@/hooks/useExpectedRewards";
import { Spinner } from "@/components/Spinner";
import { useRewardInfo } from "@/hooks/useRewardInfo";

function useDistribute() {
    const rewardInfo = useRewardInfo()
    const expectedRewards = useExpectedRewards()

    const expected = expectedRewards.data ?? 0n
    const donations = rewardInfo.data?.donations.result ?? 0n

    const prepare = usePrepareContractWrite({
        ...NativeTokenContract,
        "functionName": "distribute",
        args: [expected],
        enabled: (expected + donations) > 0
    })

    const action = useContractWrite(prepare.config)

    const wait = useWaitForTransaction({ hash: action.data?.hash })

    return { prepare, action, wait }
}

export function DistributeForm() {
    const { prepare, action, wait } = useDistribute()

    const rewardInfo = useRewardInfo()
    const expectedRewards = useExpectedRewards()

    const expected = expectedRewards.data ?? 0n
    const donations = rewardInfo.data?.donations.result ?? 0n

    const hasRewards = (expected + donations) > 0

    const loading = prepare.isLoading || action.isLoading || wait.isLoading
    const disabled = loading || !hasRewards || !action.write

    return (
        <form onSubmit={e => e.preventDefault()}>
            <button
                type="button"
                className="card-button"
                onClick={() => action.write?.()}
                disabled={disabled}
            >
                {loading ? <Spinner /> : "Distribute"}
            </button>
        </form>
    )
}
