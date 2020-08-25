import React, { createContext, ReactElement } from 'react'
import { Observer } from 'mobx-react'

import * as store from '@store/index'

interface ChildrenProps<T> {
    children: (value: T) => ReactElement<any>
}

/**
 * 创建context
 */
export const RootContext = createContext<IAllStore>(null)

/**
 * store提供者
 */
export function RootProvider({ children }: { children?: React.ReactNode }) {
    return <RootContext.Provider value={store}>{children}</RootContext.Provider>
}

/**
 * RootStoreConsumer
 *
 * 提供整个store, 替代inject
 *
 * 用于class component, 已包含Observer
 *
 * @export
 * @param {ChildrenProps<IAllStore>} { children }
 * @returns
 */
export function RootConsumer({ children }: ChildrenProps<IAllStore>) {
    return <RootContext.Consumer>{value => <Observer>{() => children(value)}</Observer>}</RootContext.Consumer>
}
