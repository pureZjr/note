import * as React from 'react'
import { observer } from 'mobx-react'
import { RollbackOutlined, UnorderedListOutlined, CaretDownFilled } from '@ant-design/icons'
import { Empty, Spin } from 'antd'

import { useRootStore } from '@utils/customHooks'
import FolderList from './FolderList'
import FileList from './FileList'
import { Tabs } from '@store/extraStore'
import * as styles from './index.scss'

const FileAndFolder: React.FC = () => {
    const {
        folderStore: {
            folders,
            currSelectedFolderName,
            currSelectedFolderKey,
            setCurrSelectedFolderKey,
            setNameByParentKey
        },
        fileStore: { files },
        extraStore: { loading, currTabId, getFolderAndFile }
    } = useRootStore()

    const empty = React.useMemo(() => {
        return !folders.length && !files.length
    }, [folders, files])

    const canBack =
        !!currSelectedFolderKey && (currSelectedFolderKey.match(/-/g) || []).length > 1 && currTabId === Tabs.MyFolder
    const rollbackOutlinedStyle = canBack
        ? { color: 'rgba(0, 0, 0, 0.4)', cursor: 'pointer' }
        : { color: 'rgba(0, 0, 0, 0.1)', cursor: 'not-allowed' }

    const onBlack = async () => {
        if (canBack) {
            let parentKey = '2'
            // 根据当前的key获取父key,key是一层层拼接的所以可以经过下面判断获取父key
            const parentKeyLength = (currSelectedFolderKey.match(/-/g) || []).length / 5
            const item = currSelectedFolderKey.split('-')
            for (let i = 0; i < parentKeyLength - 1; i++) {
                parentKey += `-${item[1 + 5 * i]}-${item[2 + 5 * i]}-${item[3 + 5 * i]}-${item[4 + 5 * i]}-${
                    item[5 + 5 * i]
                }`
            }
            getFolderAndFile(parentKey)
            setCurrSelectedFolderKey(parentKey)
            setNameByParentKey(parentKey)
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <RollbackOutlined style={{ fontSize: 18, ...rollbackOutlinedStyle }} onClick={onBlack} />
                <div className={styles.name}>{currSelectedFolderName}</div>
                <div className={styles.sort}>
                    <UnorderedListOutlined style={{ fontSize: 18, color: 'rgba(0, 0, 0, 0.4)' }} />
                    <CaretDownFilled style={{ fontSize: 12, color: 'rgba(0, 0, 0, 0.4)' }} />
                </div>
            </div>
            <div className={styles.content}>
                {loading && <Spin className={styles.loading} />}
                {empty ? (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={'没数据'} />
                ) : (
                    <>
                        <FolderList />
                        <FileList />
                    </>
                )}
            </div>
        </div>
    )
}

export default observer(FileAndFolder)
