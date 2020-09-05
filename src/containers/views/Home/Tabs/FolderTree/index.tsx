import * as React from 'react'
import { observer } from 'mobx-react'
import { Empty, Tree } from 'antd'

import { useRootStore } from '@utils/customHooks'
import { Tabs } from '@store/extraStore'
import * as styles from './index.scss'
import IconFolderOpen from '@assets/svgs/folder-open.svg'
import IconFolderClose from '@assets/svgs/folder-close.svg'

const { DirectoryTree } = Tree

const FolderTree: React.FC = () => {
    const { folderStore, extraStore, articleStore } = useRootStore()

    React.useEffect(() => {
        if (extraStore.currTabId === Tabs.MyFolder && !folderStore.treeData.length) {
            folderStore.getTreeData()
        }
    }, [extraStore.currTabId])

    // 点击树
    const onSelect = (keys, info) => {
        const {
            setExpandTreeKeys,
            setCurrSelectedFolderId,
            setCurrSelectedFolderKey,
            setCurrSelectedFolderName
        } = folderStore
        const { getFolderAndFile } = extraStore
        setCurrSelectedFolderId(info.node.id)
        setCurrSelectedFolderName(info.node.title)
        const key = keys[0]
        setCurrSelectedFolderKey(key)
        setExpandTreeKeys(key)
        getFolderAndFile(key)
        articleStore.setCurrArticleId(null)
    }

    // 右击
    const onHandleRightClick = info => {
        const { pageX, pageY } = info.event
        extraStore.setMenuProps({
            x: pageX,
            y: pageY,
            visible: true,
            folderId: info.node.id,
            key: info.node.key,
            isFolder: true,
            isTree: true,
            title: info.node.title
        })
        folderStore.setCurrSelectedFolderKey(info.node.key)
    }

    const { treeData, expandTreeKeys, currSelectedFolderKey } = folderStore

    const svgProps = {
        className: 'no-fill',
        width: 14,
        height: 14
    }

    return (
        <div className={styles.container}>
            {!folderStore.treeData.length ? (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={'没数据'} />
            ) : (
                <DirectoryTree
                    selectedKeys={[currSelectedFolderKey]}
                    expandedKeys={expandTreeKeys}
                    onSelect={onSelect}
                    treeData={treeData}
                    onRightClick={onHandleRightClick}
                    icon={({ expanded }) =>
                        expanded ? <IconFolderOpen {...svgProps} /> : <IconFolderClose {...svgProps} />
                    }
                />
            )}
        </div>
    )
}

export default observer(FolderTree)
