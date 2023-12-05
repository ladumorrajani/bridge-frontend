"use client";

import { useAccount, usePrepareContractWrite, useContractWrite } from "wagmi";
import { RouterContract, NativeTokenContract } from "@/config/contracts";
import { useBigintInput } from "@/hooks/useBigintInput";

const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

function useBuyToken(amount: bigint, reset: () => void) {
    const { isConnected, address } = useAccount()

    const deadline = BigInt(Math.floor(Date.now() / 1000) + (60 * 60 * 24))

    const { config } = usePrepareContractWrite({
        ...RouterContract,
        "functionName": "swapExactETHForTokensSupportingFeeOnTransferTokens",
        args: [0n, [WETH, NativeTokenContract.address], address ?? "0x", deadline],
        account: address,
        value: amount,
        enabled: isConnected && amount > 0,
    })

    return useContractWrite({ ...config, onSuccess: reset })
}

export function BuyForm() {
    const amount = useBigintInput(0n, 18)
    const { isLoading, write } = useBuyToken(amount.value, amount.reset)

    const disabled = amount.value === 0n || !write || isLoading

    return (
        <form onSubmit={e => e.preventDefault()}>
            <input
                type="number"
                value={amount.valueStr}
                onChange={e => amount.setValueStr(e.target.value.trim())}
                className="border px-4 py-2"
                placeholder="$BBETH"
            />
            <button
                type="button"
                className="border px-4 py-2"
                onClick={() => write?.()}
                disabled={disabled}
            >
                Buy
            </button>
        </form>
    )
}
