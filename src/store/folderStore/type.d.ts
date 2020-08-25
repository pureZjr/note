import { FolderStore as FolderStoreModel } from './index'

export as namespace IFolderStore

export interface FolderStore extends FolderStoreModel {}

interface ITreeData {
    id: string
    title: string
    key: string
    updateTime: number
    children?: ITreeData[]
}
