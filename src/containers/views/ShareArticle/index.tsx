import * as React from 'react'
import { Input, Avatar, Button } from 'antd'
import dayjs from 'dayjs'
import { LikeOutlined, EyeOutlined } from '@ant-design/icons'

import Header from '@components/Header'
import RenderContent from '@shared/RenderContent'
import { useOnMount, useRootStore } from '@utils/customHooks'
import { getShareFileLink, recentReadShareFile, likeShareFile, commentShareFile } from '@services/api/file'
import CreateType from '@store/extraStore/CreateType'
import PerfectScroll from '@components/PerfectScroll'
import styles from './index.module.scss'

interface Creator {
    username: string
    email: string
    avatar: string
}

interface Responses {
    commenter: Creator & { createTime: string }
    comment: string
    id: string
}

const ShareArticle: React.FC = () => {
    const [title, setTitle] = React.useState('')
    const [content, setContent] = React.useState('')
    const [type, setType] = React.useState<CreateType>(null)
    const [creator, setCreator] = React.useState<Creator>(null)
    const [likes, setLikes] = React.useState<string[]>([])
    const [reads, setReads] = React.useState<string[]>([])
    const [responses, setResponses] = React.useState<Responses[]>([])
    const [createTime, setCreatTime] = React.useState<number>(null)
    const [comment, setComment] = React.useState<string>('')
    const [liked, setLiked] = React.useState<boolean>(false)
    const [scrollCommentToTop, setScrollCommentToTop] = React.useState<boolean>(false)

    const {
        userInfoStore: { userInfo },
    } = useRootStore()

    const key = location.href.split('/').at(-1)

    const setRecentReadShareFile = (key) => {
        if (userInfo.email) {
            try {
                recentReadShareFile({
                    key,
                    email: userInfo.email,
                })
            } catch (err) {
                console.error(err)
            }
        }
    }

    const cancel = () => {
        setComment('')
    }

    const submit = async () => {
        try {
            const { username, email, avatar } = userInfo
            await commentShareFile({
                key,
                commenter: {
                    username,
                    email,
                    avatar,
                    createTime: dayjs().valueOf(),
                },
                comment,
            })
            setComment('')
            fetch()
            setScrollCommentToTop(true)
            setTimeout(() => {
                setScrollCommentToTop(null)
            }, 200)
        } catch (err) {
            console.error(err)
        }
    }

    const like = async () => {
        try {
            await likeShareFile({
                key,
                email: userInfo.email,
                cancel: liked,
            })
            setLiked(!liked)
            fetch()
        } catch (err) {
            console.error(err)
        }
    }

    const fetch = () => {
        getShareFileLink({ key }).then((res) => {
            setTitle(res.title)
            setContent(res.content)
            setType(res.type)
            setCreator(res.creator)
            setLikes(res.likes)
            if (!res.reads.includes(userInfo.email)) {
                setReads([...res.reads, userInfo.email])
            } else {
                setReads(res.reads)
            }

            setResponses(res.responses.reverse())
            setCreatTime(res.createTime)
            setLiked(res.likes.includes(userInfo.email))
        })
    }

    useOnMount(async () => {
        fetch()
        setRecentReadShareFile(key)
    })

    const isLogin = !!userInfo.token

    if (!creator) {
        return null
    }

    return (
        <div className={styles.container}>
            <Header hideSearch showLogin></Header>
            <div className={styles.header}>
                <span className={styles.title}>{title}</span>
            </div>
            <div className={styles.content}>
                <PerfectScroll
                    style={{
                        flex: 1,
                    }}
                >
                    <RenderContent type={type} content={content} />
                </PerfectScroll>
                <div className={styles.commentWrap}>
                    <div className={styles.creator}>
                        <div className={styles.userInfo}>
                            <Avatar size={30} src={creator.avatar}></Avatar>
                            <span className={styles.name}>{creator.username}</span>
                        </div>
                        <div className={styles.toolbar}>
                            <div className={styles.read}>
                                <EyeOutlined width={14} height={14} />
                                <span>{reads.length}</span>
                            </div>
                            <div
                                className={styles.like}
                                onClick={like}
                                style={{ color: liked ? '#3e77ff' : '#898989' }}
                            >
                                <LikeOutlined width={14} height={14} />
                                <span>{likes.length}</span>
                            </div>
                        </div>
                        <div className={styles.createTime}>
                            <label>分享时间：</label>
                            <span>{dayjs(createTime).format('YYYY-MM-DD')}</span>
                        </div>
                    </div>
                    <div className={styles.comments}>
                        {isLogin && (
                            <div className={styles.top}>
                                <div className={styles.commentLabel}>评论</div>
                                <Input.TextArea
                                    className={styles.textarea}
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    onFocus={(e) => {
                                        e.target.style.height = '80px'
                                        ;(e.target.nextSibling as HTMLDivElement).style.display = 'flex'
                                    }}
                                    onBlur={(e) => {
                                        const target = e.currentTarget
                                        setTimeout(() => {
                                            target.style.height = '40px'
                                            ;(target.nextSibling as HTMLDivElement).style.display = 'none'
                                        }, 100)
                                    }}
                                />
                                <div className={styles.btns}>
                                    <Button onClick={cancel}>取消</Button>
                                    <Button
                                        style={{ marginLeft: 7 }}
                                        type="primary"
                                        onClick={submit}
                                        disabled={!comment.length}
                                    >
                                        评论
                                    </Button>
                                </div>
                            </div>
                        )}
                        <PerfectScroll style={{ overflow: 'hidden', flex: 1 }} scrollToTop={scrollCommentToTop}>
                            <div className={styles.commentList}>
                                {responses.map((r) => {
                                    return (
                                        <div className={styles.commentItem} key={r.id}>
                                            <Avatar src={r?.commenter?.avatar}></Avatar>
                                            <div className={styles.right}>
                                                <div className={styles.commentorName}>{r?.commenter?.username}</div>
                                                <div className={styles.comment}>{r.comment}</div>
                                                <div className={styles.commentCreateTime}>
                                                    {dayjs(r.commenter.createTime).format('YYYY-MM-DD hh:mm:ss')}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </PerfectScroll>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShareArticle
