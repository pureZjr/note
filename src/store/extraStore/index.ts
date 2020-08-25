import { observable, action } from 'mobx'

import { getDelFolder, searchFolder } from '@services/api/folder'
import { getDelArticle, getNewestArticle, searchArticle } from '@services/api/article'
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
        Promise.all([store.folderStore.getFolders(parentKey), store.articleStore.getArticles(parentKey)])
            .then(() => {})
            .finally(() => {
                this.setLoading(false)
            })
    }

    /**
     * 获取回收站的文件和文件夹
     *
     * @memberof ExtraStore
     */
    getDelFolderAndFile = async () => {
        this.setLoading(true)
        Promise.all([getDelFolder(), getDelArticle()])
            .then(res => {
                store.folderStore.setFolder(res[0])
                store.articleStore.setArticles(res[1])
            })
            .catch(() => {})
            .finally(() => {
                this.setLoading(false)
            })
    }

    /**
     * 获取最新的文件和文件夹
     *
     * @memberof ExtraStore
     */
    getNewestFolderAndFile = async (key?: string) => {
        this.setLoading(true)
        Promise.all([getNewestArticle({ key })])
            .then(res => {
                store.articleStore.setArticles(res[0])
            })
            .catch(() => {})
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
        Promise.all([searchFolder(args), searchArticle(args)])
            .then(res => {
                store.folderStore.setFolder(res[0])
                store.articleStore.setArticles(res[1])
            })
            .catch(() => {})
            .finally(() => {
                this.setLoading(false)
            })
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
}

export default new ExtraStore()
