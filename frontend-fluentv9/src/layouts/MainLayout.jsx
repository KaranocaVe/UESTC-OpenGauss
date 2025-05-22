import {makeStyles, Text, tokens} from '@fluentui/react-components';
import {Navigation} from '../components/Navigation';

import '../App.css'


const useStyles = makeStyles({
    layout: {
        display: 'flex',
        height: '100vh',
        width: '100%',
        overflowX: 'hidden', // 隐藏水平滚动
        boxSizing: 'border-box', // 确保宽度计算正确
    },
    content: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: tokens.spacingHorizontalL,
        overflowY: 'auto',
        maxWidth: '100%', // 限制最大宽度
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: tokens.spacingHorizontalM,
        borderRadius: '8px',
        backgroundColor: 'var(--colorNeutralBackground1)', // Header 背景色
        boxShadow: tokens.shadow4, // Fluent UI 阴影
        marginBottom: tokens.spacingVerticalM,
    },
    title: {
        color: 'var(--colorBrandForeground1)', // 品牌前景色
        fontSize: tokens.fontSizeHero700,
        fontWeight: tokens.fontWeightSemibold,
    },
    userInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacingHorizontalS,
    },
    footer: {
        marginTop: 'auto',
        textAlign: 'center',
        padding: tokens.spacingVerticalM,
        borderRadius: '8px',
        backgroundColor: 'var(--colorNeutralBackground1)', // Footer 背景色
        boxShadow: tokens.shadow4, // Fluent UI 阴影
    },
    footerText: {
        color: 'var(--colorNeutralForeground2)', // 次要前景色
        fontSize: tokens.fontSizeBase200,
    },
});

export const MainLayout = ({children}) => {
    const styles = useStyles();

    return (
        <div className={styles.layout}>
            {/* 侧边栏 */}
            <div>
                <Navigation/>
            </div>

            {/* 主内容区域 */}
            <div className={styles.content}>

                {/* 动态内容 */}
                {children}

                {/* Footer */}
                <div className={styles.footer}>
                    <Text className={styles.footerText}>
                        © 2025 鲲鹏聚数 保留所有权利
                    </Text>
                </div>
                </div>
            </div>
    );
};