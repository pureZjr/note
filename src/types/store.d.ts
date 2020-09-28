import { RouterStore as _RouterStore } from 'mobx-react-router'

declare global {
    /**
     * type from mobx-react-router
     *
     * @interface RouterStore
     * @extends {_RouterStore}
     */
    interface RouterStore extends _RouterStore {}

    declare interface IAllStore {
        articleStore: IArticleStore.ArticleStore
        folderStore: IFolderStore.FolderStore
        extraStore: IExtraStore.ExtraStore
        userInfoStore: IUserInfoStore.UserInfoStore
        routerStore: RouterStore
        fileStore: IFileStore.FileStore
    }
}
