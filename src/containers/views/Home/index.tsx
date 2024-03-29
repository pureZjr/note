import * as React from 'react'
import { Layout } from 'antd'
import { observer } from 'mobx-react'

import Header from '@components/Header'
import FileAndFolder from './FileAndFolder'
import File from './File'
import Tabs from './Tabs'
import Btns from './Btns'
import { useRootStore } from '@utils/customHooks'
import CreateFolderAndFile from '@components/CreateFolderAndFile'
import RightClickMenus from '@components/RightClickMenus'
import PerfectScroll from '@components/PerfectScroll'
import Icon from '@components/Icon'
import SectionLoading from '@components/SectionLoading'

import styles from './index.scss'

const { Sider, Content } = Layout

const Home: React.FC = () => {
    const {
        fileStore,
        extraStore: { updateScrollBar },
    } = useRootStore()

    const [scrollToTop, setScrollToTop] = React.useState(false)
    const scrollRef = React.useRef(null)

    React.useEffect(() => {
        const dom = document.querySelector('.ant-tree-node-selected')
        if (dom && updateScrollBar) {
            const scrollTop = dom.getBoundingClientRect().top - (56 + 48) + scrollRef.current.scrollbarYTop
            console.log(scrollTop, (scrollRef.current.element.scrollTop = scrollTop))
        }
    }, [updateScrollBar])

    return (
        <Layout className={styles.container}>
            <Header />
            <Layout className={styles.layout}>
                <Sider width={220} className={styles.sider}>
                    <Btns />
                    <PerfectScroll
                        setScrollbarRef={(ref) => (scrollRef.current = ref)}
                        scrollToTop={scrollToTop}
                        style={{ background: '#fff', borderRight: '1px solid rgba(0, 0, 0, 0.1)' }}
                    >
                        <Tabs setScrollToTop={setScrollToTop} />
                    </PerfectScroll>
                </Sider>
                <FileAndFolder />
                <Content className={styles.content}>
                    {fileStore.contentLoading ? (
                        <SectionLoading />
                    ) : !!fileStore.currFileInfo ? (
                        <File />
                    ) : (
                        <div className={styles.empty}>
                            <Icon type="iconwrite" width={40} height={40} />
                            <div>当前没有笔记，赶紧去新建吧！</div>
                        </div>
                    )}
                </Content>
            </Layout>
            <CreateFolderAndFile />
            <RightClickMenus />
        </Layout>
    )
}

export default observer(Home)
