import {Avatar, Button, makeStyles, Text, tokens} from '@fluentui/react-components';
import {useAuth} from "../contexts/AuthContext.jsx";

const useStyles = makeStyles({
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
});

export const PageHeader = ({ title }) => {
    const styles = useStyles();
    const {user, logout} = useAuth();
    return (
        <div className={styles.header}>
            <Text className={styles.title} as="h1"
                  style={{fontSize: tokens.fontSizeHero800, fontWeight: tokens.fontWeightBold}}>
                人力资源管理系统
            </Text>
            <Text className={styles.title} as="h2" style={{
                fontSize: tokens.fontSizeHero400,
                fontWeight: tokens.fontWeightRegular,
                color: 'var(--colorNeutralForeground2)'
            }}>
                {title}
            </Text>
            <div className={styles.userInfo}>
                <Text>{`欢迎, ${user?.firstName} ${user?.lastName}`}</Text>
                <Avatar name={`${user?.firstName} ${user?.lastName}`}/>
                <Button appearance="primary" onClick={logout}>
                    退出登录
                </Button>
            </div>
        </div>
    );
};