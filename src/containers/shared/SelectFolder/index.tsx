import * as React from 'react'
import { Modal, Tree, Button } from 'antd'
import { observer } from 'mobx-react'

import IconFolderOpen from '@assets/svgs/folder-open.svg'
import IconFolderClose from '@assets/svgs/folder-close.svg'
import { useRootStore, useOnMount } from '@utils/customHooks'
import RenderFileIcon from '@shared/RenderFileIcon'
import CreateType from '@store/extraStore/CreateType'
import PerfectScroll from '@components/PerfectScroll'
import styles from './index.scss'

interface Props {
    file: File
    defaultPath: string
    defaultParentId: string
    onSelectFolder: (parentId: string) => void
    close: () => void
}

const { DirectoryTree } = Tree

const SelectFolder: React.FC<Props> = ({ file, defaultPath, defaultParentId, onSelectFolder, close }: Props) => {
    const [openFolders, setOpenFolders] = React.useState(false)
    const [uploadPath, setUploadPath] = React.useState(defaultPath)
    const [uploadParentId, setUploadParentId] = React.useState(defaultParentId)
    const fileType =
        file.type.indexOf('image') !== -1 ? CreateType.Img : file.type.indexOf('video') !== -1 ? CreateType.Video : null

    const {
        folderStore: { treeData, getTreeData }
    } = useRootStore()

    const onSelect = (_, info) => {
        const { id, title } = info.node
        setUploadPath(title)
        setUploadParentId(id)
    }

    const changePath = () => {
        setOpenFolders(true)
    }

    const onSubmit = () => {
        onSelectFolder(uploadParentId)
        close()
    }

    useOnMount(() => {
        if (!treeData.length) {
            getTreeData()
        }
    })

    const svgProps = {
        className: 'no-fill',
        width: 14,
        height: 14,
        style: {
            fontSize: 14,
            marginTop: 4
        }
    }

    return (
        <Modal
            visible
            width={400}
            okText="上传"
            cancelText="取消"
            onOk={onSubmit}
            onCancel={close}
            maskClosable={false}
        >
            <div className={styles.pathWrapper}>
                <div className={styles.selectedFile}>
                    <RenderFileIcon size={26} type={fileType} />
                    <span>{file.name}</span>
                </div>
                {openFolders ? (
                    <div className={styles.treeWrapper}>
                        <div>上传到：{uploadPath}</div>
                        <PerfectScroll>
                            <DirectoryTree
                                className={styles.folderTree}
                                onSelect={onSelect}
                                treeData={[{ title: '我的文件夹', key: '2', children: treeData }]}
                                icon={({ expanded }) =>
                                    expanded ? <IconFolderOpen {...svgProps} /> : <IconFolderClose {...svgProps} />
                                }
                            />
                        </PerfectScroll>
                    </div>
                ) : (
                    <div className={styles.path}>
                        <span>上传到：{uploadPath}</span>
                        <Button type="primary" onClick={changePath}>
                            修改
                        </Button>
                    </div>
                )}
            </div>
        </Modal>
    )
}

export default observer(SelectFolder)
