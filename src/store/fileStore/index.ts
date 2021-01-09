import { observable, action } from 'mobx'

import { getFileInFolder } from '@services/api/file'
import extraStore from '../extraStore'

/**
 * 文件store
 *
 * @export
 * @class FileStore
 */

export class FileStore {
    /**
     * 文件置顶
     *
     * @memberof FileStore
     */
    @action
    setFileTop = (id: string, isTop: 0 | 1) => {
        const currFile = this.files.find(v => v.id === id)
        currFile.isTop = isTop
    }

    /**
     * 修改文件信息
     *
     * @memberof FileStore
     */
    @action
    setFileName = (id: string, title: string) => {
        const currFile = this.files.find(v => v.id === id)
        currFile.title = title
    }

    /**
     * 插入文件
     *
     * @memberof FileStore
     */
    @action
    insertFile = (file: IFileStore.File) => {
        const arr = JSON.parse(JSON.stringify(this.files))
        arr.splice(0, 0, file)
        this.setFiles(arr)
    }

    /**
     * 删除文件
     *
     * @memberof FileStore
     */
    @action
    delFile = (id: string) => {
        const arr = JSON.parse(JSON.stringify(this.files))
        const idx = this.files.findIndex(v => v.id === id)
        arr.splice(idx, 1)
        this.setFiles(arr)
    }

    /**
     * 文件列表
     *
     * @memberof FileStore
     */
    @observable
    files: IFileStore.File[] = []
    @action
    setFiles = (files: IFileStore.File[]) => {
        this.files = files
    }

    /**
     * 获取文件
     *
     * @memberof FileStore
     */
    getFiles = async (parentKey: string) => {
        const res = await getFileInFolder({ parentKey, sort: extraStore.fileAndFolderSort })
        this.setFiles(res)
        return res
    }

    /**
     * 获取文件loading
     *
     * @memberof FileStore
     */
    @observable
    contentLoading = false
    @action
    setContentLoading = (boo: boolean) => {
        this.contentLoading = boo
    }

    /**
     * 更新文件
     *
     * @memberof FileStore
     */
    @action
    updateFile = (args: IFileStore.File) => {
        const arr = [...this.files]
        const index = arr.findIndex(a => a.id === args.id)
        arr[index] = {
            ...arr[index],
            ...args
        }
        this.setFiles(arr)
    }

    /**
     * 当前文件信息
     *
     * @memberof FileStore
     */
    @observable
    currFileInfo: IFileStore.File = {
        id: '',
        content: '',
        title: ''
    }
    @action
    setCurrFileInfo = (info: IFileStore.File) => {
        this.currFileInfo = info ? { ...this.currFileInfo, ...info } : null
    }
}

export default new FileStore()
