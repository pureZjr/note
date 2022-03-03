import * as React from 'react'
import { observer } from 'mobx-react'
import { Tree } from 'antd'

import { useRootStore } from '@utils/customHooks'
import { Tabs } from '@store/extraStore'
import Icon from '@components/Icon'
import SectionLoading from '@components/SectionLoading'
import styles from './index.module.scss'

const { DirectoryTree } = Tree

const FolderTree: React.FC = () => {
    const { folderStore, extraStore, fileStore } = useRootStore()
    const { treeData, expandTreeKeys, currFolderInfo, loading } = folderStore

    // 点击树
    const onSelect = (keys, info) => {
        const { setExpandTreeKeys, setCurrFolderInfo } = folderStore
        const { getFolderAndFile } = extraStore
        const key = keys[0]
        setCurrFolderInfo({ id: info.node.id, title: info.node.title, key })
        setExpandTreeKeys(key)
        getFolderAndFile(key)
        fileStore.setCurrFileInfo(null)
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
        folderStore.setCurrFolderInfo({ key: info.node.key })
    }

    React.useEffect(() => {
        if (extraStore.currTabId === Tabs.MyFolder && !treeData.length) {
            folderStore.getTreeData()
        }
    }, [extraStore.currTabId])

    const svgProps = {
        width: 14,
        height: 14
    }

    return (
        <div className={styles.container}>
            {loading && <SectionLoading />}
            {!!treeData.length && (
                <DirectoryTree
                    selectedKeys={[currFolderInfo.key]}
                    expandedKeys={expandTreeKeys}
                    onSelect={onSelect}
                    treeData={treeData}
                    onRightClick={onHandleRightClick}
                    icon={({ expanded }) =>
                        expanded ? (
                            <Icon type="iconfolder-open" {...svgProps} />
                        ) : (
                            <Icon type="iconfolder-close" {...svgProps} />
                        )
                    }
                />
            )}
        </div>
    )
}

export default observer(FolderTree)
