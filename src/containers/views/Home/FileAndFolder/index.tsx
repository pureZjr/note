import * as React from 'react'
import { observer } from 'mobx-react'
import { RollbackOutlined, UnorderedListOutlined, CaretDownFilled } from '@ant-design/icons'
import { Menu, Dropdown, Button } from 'antd'

import { useRootStore } from '@utils/customHooks'
import FolderList from './FolderList'
import { createFile } from '@services/api/file'
import FileList from './FileList'
import { Tabs } from '@store/extraStore'
import { LOCALSTORAGE } from '@constant/index'
import PerfectScroll from '@components/PerfectScroll'
import SectionLoading from '@components/SectionLoading'
import styles from './index.scss'

const FileAndFolder: React.FC = () => {
    const {
        folderStore: { folders, currFolderInfo, setCurrFolderInfo, setNameByParentKey },
        fileStore: { files, insertFile, setCurrFileInfo },
        extraStore: {
            loading,
            currTabId,
            fileAndFolderDisplay,
            fileAndFolderSort,
            getNewestFolderAndFile,
            getFolderAndFile,
            setFileAndFolderDisplay,
            setFileAndFolderSort,
            getDelFolderAndFile,
        },
    } = useRootStore()

    const empty = React.useMemo(() => {
        return !folders.length && !files.length
    }, [folders, files])

    /**
     * 通过currSelectedFolderKey判断是否有返回上一级
     * currSelectedFolderKey通过 ’-‘ 拼接父子key
     * 所有判断 ’-‘ 的数量是否大于1就能知道当前是否在子文件夹
     */
    const canBack =
        !!currFolderInfo.key && (currFolderInfo.key.match(/-/g) || []).length > 1 && currTabId === Tabs.MyFolder
    const rollbackOutlinedStyle = canBack
        ? { color: 'rgba(0, 0, 0, 0.4)', cursor: 'pointer' }
        : { color: 'rgba(0, 0, 0, 0.1)', cursor: 'not-allowed' }

    const onBlack = async () => {
        if (canBack) {
            let parentKey = '2'
            // 根据当前的key获取父key,key是一层层拼接的所以可以经过下面判断获取父key
            const parentKeyLength = (currFolderInfo.key.match(/-/g) || []).length / 5
            const item = currFolderInfo.key.split('-')
            for (let i = 0; i < parentKeyLength - 1; i++) {
                parentKey += `-${item[1 + 5 * i]}-${item[2 + 5 * i]}-${item[3 + 5 * i]}-${item[4 + 5 * i]}-${
                    item[5 + 5 * i]
                }`
            }
            getFolderAndFile(parentKey)
            setCurrFolderInfo({ key: parentKey })
            setNameByParentKey(parentKey)
        }
    }
    // 处理列表排序操作项
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
                    getFolderAndFile(currFolderInfo.key || '2')
                } else if (currTabId === Tabs.NewDoc) {
                    getNewestFolderAndFile(key)
                } else {
                    getDelFolderAndFile(key)
                }
                break
        }
    }
    // 新建笔记
    const createArticle = async () => {
        const fid = currFolderInfo.id || '2'
        const res = await createFile({
            title: '无标题笔记',
            type: 'article',
            content: '',
            parentId: fid,
        })
        insertFile(res)
        setCurrFileInfo(null)
        setCurrFileInfo(res)
    }

    // 列表排序项
    const hideSort = ![Tabs.ShareToMe, Tabs.MyShare, Tabs.Recycle].includes(currTabId)
    const menu = (
        <Menu onClick={(e) => onHandleList(e.key)} selectedKeys={[fileAndFolderDisplay, fileAndFolderSort]}>
            <Menu.Item key="abstract">摘要</Menu.Item>
            <Menu.Item key="list">列表</Menu.Item>
            {hideSort && <Menu.Divider />}
            {hideSort && <Menu.Item key="createTime">创建时间</Menu.Item>}
            {hideSort && <Menu.Item key="updateTime">修改时间</Menu.Item>}
            {hideSort && <Menu.Item key="size">文件大小</Menu.Item>}
        </Menu>
    )

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <RollbackOutlined style={{ fontSize: 18, ...rollbackOutlinedStyle }} onClick={onBlack} />
                <div className={styles.name}>{currFolderInfo.title}</div>
                <Dropdown overlay={menu} trigger={['click']}>
                    <div className={styles.sort}>
                        <UnorderedListOutlined style={{ fontSize: 18, color: 'rgba(0, 0, 0, 0.4)', marginRight: 6 }} />
                        <CaretDownFilled style={{ fontSize: 12, color: 'rgba(0, 0, 0, 0.4)' }} />
                    </div>
                </Dropdown>
            </div>
            <div className={styles.content}>
                <PerfectScroll>
                    {loading ? (
                        <SectionLoading />
                    ) : (
                        <React.Fragment>
                            {empty ? (
                                <div className={styles.empty}>
                                    <label>没有找到文件</label>
                                    {[Tabs.MyFolder, Tabs.NewDoc].includes(currTabId) && (
                                        <Button size="small" type="primary" onClick={createArticle}>
                                            新建笔记
                                        </Button>
                                    )}
                                </div>
                            ) : (
                                <React.Fragment>
                                    <FolderList />
                                    <FileList />
                                </React.Fragment>
                            )}
                        </React.Fragment>
                    )}
                </PerfectScroll>
            </div>
        </div>
    )
}

export default observer(FileAndFolder)
