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
            arr = arr.filter((v) => v.indexOf(keys) < 0)
        } else {
            arr.push(keys)
        }
        this.expandTreeKeys = uniq(arr)
    }

    /**
     * 文件夹树
     * @memberof FolderStore
     */
    @observable loading = false
    @observable treeData: IFolderStore.TreeData[] = []

    getTreeData = async () => {
        this.loading = true
        const res = await getFolderTree()
        runInAction('SET_TREE_DATA', () => {
            this.treeData = res
            this.loading = false
        })
    }

    /**
     * 当前选中文件夹的信息
     *
     * @memberof FolderStore
     */
    @observable
    currFolderInfo: IFolderStore.Folder = {
        id: '',
        key: '',
        title: '最新文档',
    }
    @action
    setCurrFolderInfo = (info: IFolderStore.Folder) => {
        this.currFolderInfo = info ? { ...this.currFolderInfo, ...info } : null
    }

    /**
     * 文件夹列表
     *
     * @memberof FolderStore
     */
    @observable
    folders: IFolderStore.TreeData[] = []
    @action
    setFolder = (folders: IFolderStore.TreeData[]) => {
        this.folders = folders
    }

    /**
     * 获取文件夹列表
     *
     * @memberof FolderStore
     */
    getFolders = async (parentKey: string) => {
        const res = await getFolder({ parentKey, sort: extraStore.fileAndFolderSort })
        this.setFolder(res)
        return res
    }

    /**
     * 删除文件夹
     *
     * @memberof FolderStore
     */
    @action
    delFolder = (id: string) => {
        const idx = this.folders.findIndex((v) => v.id === id)
        this.folders.splice(idx, 1)
    }

    /**
     * 删除文件夹
     *
     * @memberof FolderStore
     */
    setNameByParentKey = (key: string) => {
        getFolderInfo({ key }).then((res) => {
            if (!!res.length) {
                this.setCurrFolderInfo({ title: res[0].title })
            } else {
                const title =
                    extraStore.currTabId === Tabs.NewDoc
                        ? '最新文档'
                        : extraStore.currTabId === Tabs.MyFolder
                        ? '我的文件夹'
                        : '回收站'
                this.setCurrFolderInfo({ title })
            }
        })
    }

    /**
     * 重命名
     *
     * @memberof FolderStore
     */
    @action
    setFolderName = (id: string, title: string) => {
        try {
            const currFolder = this.folders.find((v) => v.id === id)
            currFolder.title = title
        } catch {}
    }
}

export default new FolderStore()
