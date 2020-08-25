import * as React from 'react'
import { Dropdown, Menu } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import { observer } from 'mobx-react'
import classnames from 'classnames'

import { useRootStore } from '@utils/customHooks'
import CreateType from '@store/extraStore/CreateType'
import { Tabs } from '@store/extraStore'
import * as styles from './index.scss'

const Btns: React.FC = () => {
    const { extraStore } = useRootStore()

    const menu = () => {
        const { setCreateFileFolderDialogvisible, setCreateFileFolderType } = extraStore

        const handleSelect = (type: IExtraStore.CreateType) => {
            setCreateFileFolderType(type)
            setCreateFileFolderDialogvisible(true)
        }

        return (
            <Menu>
                <Menu.Item
                    onClick={() => {
                        handleSelect(CreateType.MarkDown)
                    }}
                >
                    MarkDown
                </Menu.Item>
                <Menu.Item
                    onClick={() => {
                        handleSelect(CreateType.Folder)
                    }}
                >
                    文件夹
                </Menu.Item>
            </Menu>
        )
    }

    // 最新文档、回收站没有新建功能
    const disabled = [Tabs.NewDoc, Tabs.Recycle].includes(extraStore.currTabId)

    return (
        <div className={styles.container}>
            <Dropdown overlay={menu()} disabled={disabled}>
                <div className={classnames(styles.btn, disabled && styles.disabled)}>
                    <PlusCircleOutlined
                        width={14}
                        height={14}
                        style={{ color: disabled ? 'rgba(0, 0, 0, 0.2)' : 'rgb(25, 144, 255)' }}
                    />
                    <span className={styles.add}>新增</span>
                </div>
            </Dropdown>
        </div>
    )
}

export default observer(Btns)
