import { observable, action, runInAction } from 'mobx'
import { uniq } from 'lodash'

import { getFolder, getFolderTree, getFolderInfo } from '@services/api/folder'
import extraStore, { Tabs } from '../extraStore'

/**
 * 文件夹store
 *
 * @export
 * @class FolderStore
 */

export class FolderStore {
    /**
     * 需要展开的文件夹keys
     *
     * @memberof FolderStore
     */
    @observable expandTreeKeys: string[] = []
    @action
    setExpandTreeKeys = (keys?: string) => {
        if (!keys) {
            this.expandTreeKeys = []
            return
        }
        let arr = [...this.expandTreeKeys]
        if (this.expandTreeKeys.includes(keys)) {
            arr = arr.filter(v => v.indexOf(keys) < 0)
        } else {
            arr.push(keys)
        }
        this.expandTreeKeys = uniq(arr)
    }

    /**
     * 文件夹数
     * @memberof FolderStore
     */
    @observable treeData: IFolderStore.ITreeData[] = []

    getTreeData = async () => {
        const res = await getFolderTree()
        runInAction('SET_TREE_DATA', () => {
            this.treeData = res
        })
    }

    /**
     * 当前选中文件夹的id
     *
     * @memberof FolderStore
     */
    @observable
    currSelectedFolderId: string = null
    @action
    setCurrSelectedFolderId = (id: string) => {
        this.currSelectedFolderId = id
    }

    /**
     * 当前选中文件夹的keey
     *
     * @memberof FolderStore
     */
    @observable
    currSelectedFolderKey: string = null
    @action
    setCurrSelectedFolderKey = (key: string) => {
        this.currSelectedFolderKey = key
    }

    /**
     * 文件夹列表
     *
     * @memberof FolderStore
     */
    @observable
    folders: IFolderStore.ITreeData[] = []
    @action
    setFolder = (folders: IFolderStore.ITreeData[]) => {
        this.folders = folders
    }

    /**
     * 获取文件夹列表
     *
     * @memberof FolderStore
     */
    getFolders = async (parentKey: string) => {
        const res = await getFolder({ parentKey })
        this.setFolder(res)
        return res
    }

    /**
     * 当前文件夹的名字
     *
     * @memberof FolderStore
     */
    @observable currSelectedFolderName: string = '最新文档'
    @action
    setCurrSelectedFolderName = (name: string) => {
        this.currSelectedFolderName = name
    }

    /**
     * 删除文件夹
     *
     * @memberof FolderStore
     */
    @action
    delFolder = (id: string) => {
        const idx = this.folders.findIndex(v => v.id === id)
        this.folders.splice(idx, 1)
    }

    /**
     * 删除文件夹
     *
     * @memberof FolderStore
     */
    setNameByParentKey = (key: string) => {
        getFolderInfo({ key }).then(res => {
            if (!!res.length) {
                this.setCurrSelectedFolderName(res[0].title)
            } else {
                const title =
                    extraStore.currTabId === Tabs.NewDoc
                        ? '最新文档'
                        : extraStore.currTabId === Tabs.MyFolder
                        ? '我的文件夹'
                        : '回收站'
                this.setCurrSelectedFolderName(title)
            }
        })
    }
}

export default new FolderStore()
