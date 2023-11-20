"use client";

import { useTokenInfo } from "@/hooks/useTokenInfo";
import { useHasMounted } from "@/hooks/useHasMounted";

export function NativeTokenSymbol() {
    const tokenInfo = useTokenInfo()
    const hasMounted = useHasMounted()

    const loaded = hasMounted && tokenInfo.isSuccess

    const symbol = tokenInfo.data?.native.symbol.result ?? ""

    return (
        <span>
            {loaded ? symbol : '-'}
        </span>
    )
}
