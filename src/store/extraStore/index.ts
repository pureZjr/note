import { observable, action } from 'mobx'

import { getDelFolder, searchFolder } from '@services/api/folder'
import { getDelFile, getNewestFile, searchFile } from '@services/api/file'
import { LOCALSTORAGE } from '@constant/index'
import * as store from '../index'

export enum Tabs {
    /**
     * 最新文档
     */
    NewDoc = '1',
    /**
     * 我的文件夹
     */
    MyFolder = '2',
    /**
     * 回收站
     */
    Recycle = '3'
}

/**
 * 杂项store
 *
 * @export
 * @class ExtraStore
 */
export class ExtraStore {
    /**
     * 获取文件夹和文件时候loading
     *
     * @type {boolean}
     * @memberof ExtraStore
     */
    @observable
    loading: boolean = false
    @action
    setLoading = (boo: boolean) => {
        this.loading = boo
    }

    /**
     * 获取文件和文件夹
     *
     * @memberof ExtraStore
     */
    getFolderAndFile = async (parentKey: string) => {
        this.setLoading(true)
        Promise.all([store.folderStore.getFolders(parentKey), store.fileStore.getFiles(parentKey)]).finally(() => {
            this.setLoading(false)
        })
    }

    /**
     * 获取回收站的文件和文件夹
     *
     * @memberof ExtraStore
     */
    getDelFolderAndFile = async (sort = 'updateTime') => {
        this.setLoading(true)
        Promise.all([getDelFolder(sort), getDelFile(sort)])
            .then(res => {
                store.folderStore.setFolder(res[0])
                store.fileStore.setFiles(res[1])
            })
            .finally(() => {
                this.setLoading(false)
            })
    }

    /**
     * 获取最新的文件
     *
     * @memberof ExtraStore
     */
    getNewestFolderAndFile = async (sort = 'updateTime') => {
        this.setLoading(true)
        getNewestFile({ sort })
            .then(res => {
                store.fileStore.setFiles(res)
            })
            .finally(() => {
                this.setLoading(false)
            })
    }

    /**
     * 搜索文件和文件夹
     *
     * @memberof ExtraStore
     */
    searchFolderAndFile = async (args: { key?: string; keyword: string; type: Tabs }) => {
        this.setLoading(true)
        const searchInMyFolder = () =>
            Promise.all([searchFolder(args), searchFile(args)])
                .then(res => {
                    store.folderStore.setFolder(res[0])
                    store.fileStore.setFiles(res[1])
                })
                .finally(() => {
                    this.setLoading(false)
                })
        if (args.keyword === '') {
            if (args.type === Tabs.NewDoc) {
                this.getNewestFolderAndFile()
            } else if (args.type === Tabs.MyFolder) {
                searchInMyFolder()
            } else {
                this.getDelFolderAndFile()
            }
        } else {
            searchInMyFolder()
        }
    }

    /**
     * 创建文件夹、文件弹框
     *
     * @memberof ExtraStore
     */
    @observable
    createFileFolderDialogvisible: boolean = false
    @action
    setCreateFileFolderDialogvisible = (boo: boolean) => {
        this.createFileFolderDialogvisible = boo
    }

    /**
     * 创建文件夹、文件类型
     *
     * @memberof ExtraStore
     */
    @observable
    createFileFolderType: IExtraStore.CreateType = null
    setCreateFileFolderType = (type: IExtraStore.CreateType) => {
        this.createFileFolderType = type
    }

    /**
     * 选中的tab的id
     *
     *
     * @memberof ExtraStore
     */
    @observable
    currTabId: Tabs = Tabs.NewDoc
    @action
    setCurrTabId = (id: Tabs) => {
        this.currTabId = id
    }

    /**
     * 新建文件夹、文件menu
     *
     * @memberof ExtraStore
     */
    @observable
    menuProps: IExtraStore.IMenuProps = {
        x: 0,
        y: 0,
        visible: false,
        folderId: '',
        articleId: '',
        key: ''
    }
    @action
    setMenuProps = (props: IExtraStore.IMenuProps) => {
        this.menuProps = { ...props }
    }

    /**
     * 搜索中
     *
     * @memberof ExtraStore
     */
    @observable
    isSearching = false
    @action
    setIsSearching = (boo: boolean) => {
        this.isSearching = boo
    }

    /**
     * 搜索关键字
     *
     * @memberof ExtraStore
     */
    @observable
    keyword = ''
    @action
    setKeyword = (kw: string) => {
        this.keyword = kw
    }

    /**
     * 文件文件夹列表显示方式
     * abstract: 摘要
     * list: 列表
     *
     * @memberof ExtraStore
     */
    @observable
    fileAndFolderDisplay: string = localStorage.getItem(LOCALSTORAGE.FILEANDFOLDERDISPLAY) || 'abstract'
    @action
    setFileAndFolderDisplay = type => {
        this.fileAndFolderDisplay = type
    }

    /**
     * 文件文件夹列表排序方式
     *
     * @memberof ExtraStore
     */
    @observable
    fileAndFolderSort: string = localStorage.getItem(LOCALSTORAGE.FILEANDFOLDERSORT) || 'updateTime'
    @action
    setFileAndFolderSort = sort => {
        this.fileAndFolderSort = sort
    }
}

export default new ExtraStore()
