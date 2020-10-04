import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
// 设置高亮样式
import { xonokai } from 'react-syntax-highlighter/dist/esm/styles/prism'
// 设置高亮的语言
import { javascript, jsx } from 'react-syntax-highlighter/dist/esm/languages/prism'
import { isUndefined } from 'lodash'

interface IProps {
    language?: any
    value?: any
}

class CodeBlock extends PureComponent<IProps> {
    static propTypes = {
        language: PropTypes.string
    }

    static defaultProps = {
        language: null
    }

    componentWillMount() {
        // 注册要高亮的语法，
        // 注意：如果不设置打包后供第三方使用是不起作用的
        SyntaxHighlighter.registerLanguage('jsx', jsx)
        SyntaxHighlighter.registerLanguage('javascript', javascript)
        SyntaxHighlighter.registerLanguage('js', javascript)
    }

    render() {
        const { language, value } = this.props
        return (
            <figure className="highlight">
                <SyntaxHighlighter language={language} style={xonokai}>
                    {isUndefined(value) ? '' : value}
                </SyntaxHighlighter>
            </figure>
        )
    }
}
export default CodeBlock
