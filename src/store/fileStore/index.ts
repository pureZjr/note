import { observable, action } from 'mobx'

import { getFileInFolder } from '@services/api/file'

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
    insertFile = (file: IFileStore.IFile) => {
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
    files: IFileStore.IFile[] = []
    @action
    setFiles = (files: IFileStore.IFile[]) => {
        this.files = files
    }

    /**
     * 获取文件
     *
     * @memberof FileStore
     */
    getFiles = async (parentKey: string) => {
        const res = await getFileInFolder({ parentKey })
        this.setFiles(res)
        return res
    }

    /**
     * 当前选中文件的id
     *
     * @memberof FileStore
     */
    @observable
    currFileId: string = null
    @action
    setCurrFileId = (id: string) => {
        this.currFileId = id
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
    updateFile = (args: IFileStore.IFile) => {
        const arr = [...this.files]
        const index = arr.findIndex(a => a.id === args.id)
        arr[index] = {
            ...arr[index],
            ...args
        }
        this.setFiles(arr)
    }
}

export default new FileStore()
