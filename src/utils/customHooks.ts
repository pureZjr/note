import { useEffect, useContext } from 'react'

import { RootContext } from '@components/RootProvider'

export const useOnMount = (onMount: () => any) => {
    return useEffect(() => {
        if (onMount) {
            onMount()
        }
    }, [])
}

export const useOnUnMount = (onUnMount: () => any) => {
    return useEffect(() => {
        return () => onUnMount && onUnMount()
    }, [])
}

/**
 * 提供整个store
 */
export function useRootStore() {
    return useContext(RootContext)
}
