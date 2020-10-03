import * as React from 'react'
import { observer } from 'mobx-react'
import { RollbackOutlined, UnorderedListOutlined, CaretDownFilled } from '@ant-design/icons'
import { Empty, Spin, Menu, Dropdown } from 'antd'

import { useRootStore } from '@utils/customHooks'
import FolderList from './FolderList'
import FileList from './FileList'
import { Tabs } from '@store/extraStore'
import { LOCALSTORAGE } from '@constant/index'
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
        extraStore: {
            loading,
            currTabId,
            fileAndFolderDisplay,
            fileAndFolderSort,
            getNewestFolderAndFile,
            getFolderAndFile,
            setFileAndFolderDisplay,
            setFileAndFolderSort,
            getDelFolderAndFile
        }
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
    const onHandleList = (key: string) => {
        switch (key) {
            case 'abstract':
            case 'list':
                setFileAndFolderDisplay(key)
                localStorage.setItem(LOCALSTORAGE.FILEANDFOLDERDISPLAY, key)
                break
            case 'createTime':
            case 'updateTime':
            case 'size':
                localStorage.setItem(LOCALSTORAGE.FILEANDFOLDERSORT, key)
                setFileAndFolderSort(key)
                if (currTabId === Tabs.MyFolder) {
                    getFolderAndFile(currSelectedFolderKey || '2')
                } else if (currTabId === Tabs.NewDoc) {
                    getNewestFolderAndFile(key)
                } else {
                    getDelFolderAndFile(key)
                }
                break
        }
    }

    const menu = (
        <Menu onClick={e => onHandleList(e.key)} selectedKeys={[fileAndFolderDisplay, fileAndFolderSort]}>
            <Menu.Item key="abstract">摘要</Menu.Item>
            <Menu.Item key="list">列表</Menu.Item>
            <Menu.Divider />
            <Menu.Item key="createTime">创建时间</Menu.Item>
            <Menu.Item key="updateTime">修改时间</Menu.Item>
            <Menu.Item key="size">文件大小</Menu.Item>
        </Menu>
    )

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <RollbackOutlined style={{ fontSize: 18, ...rollbackOutlinedStyle }} onClick={onBlack} />
                <div className={styles.name}>{currSelectedFolderName}</div>
                <Dropdown overlay={menu} trigger={['click']}>
                    <div className={styles.sort}>
                        <UnorderedListOutlined style={{ fontSize: 18, color: 'rgba(0, 0, 0, 0.4)' }} />
                        <CaretDownFilled style={{ fontSize: 12, color: 'rgba(0, 0, 0, 0.4)' }} />
                    </div>
                </Dropdown>
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
