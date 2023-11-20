"use client";

import { useTokenInfo } from "@/hooks/useTokenInfo";
import { useHasMounted } from "@/hooks/useHasMounted";

export function RewardTokenSymbol() {
    const tokenInfo = useTokenInfo()
    const hasMounted = useHasMounted()

    const loaded = hasMounted && tokenInfo.isSuccess

    const symbol = tokenInfo.data?.reward.symbol.result ?? "-"

    return (
        <span>
            {loaded ? symbol : '-'}
        </span>
    )
}
