import {useState} from 'react';
import {Button, Card, Input, Label, makeStyles, Spinner, Text, tokens} from '@fluentui/react-components';
import {LockClosed24Regular, Person24Regular} from '@fluentui/react-icons';
import {useAuth} from '../contexts/AuthContext';

const useStyles = makeStyles({
    // 全局样式，确保页面高度固定，禁止滚动
    global: {
        html: {
            height: '100%',
            margin: 0,
            padding: 0,
            overflow: 'hidden', // 禁止滚动
        },
        body: {
            height: '100%',
            margin: 0,
            padding: 0,
            overflow: 'hidden', // 禁止滚动
        },
    },
    container: {
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // 确保高度完全适配视口
        background: `linear-gradient(135deg, rgba(74, 144, 226, 0.8), rgba(144, 19, 254, 0.8))`,
        overflow: 'hidden', // 避免内部元素导致滚动
    },
    svgBackground: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundImage: `url('https://opengauss.org/assets/logo.CITHvJJ-.svg')`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: '60vw', // 限制背景图大小
        width: '60vw',
        height: '60vw',
        opacity: 0.4, // 背景图半透明
        pointerEvents: 'none', // 禁止交互
    },
    card: {
        zIndex: 1, // 保证卡片在背景图之上
        width: '400px',
        maxHeight: '90vh', // 限制卡片最大高度，防止内容溢出
        padding: tokens.spacingHorizontalXXL,
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // 半透明白色背景
        boxShadow: tokens.shadow64,
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: tokens.spacingVerticalL,
        overflow: 'auto', // 如果内容溢出，卡片内部滚动
        animation: 'fadeIn 0.6s ease-in-out',
        '@media (max-width: 480px)': {
            width: '90%',
            padding: tokens.spacingHorizontalL,
        },
    },
    header: {
        textAlign: 'center',
        color: tokens.colorBrandForeground1,
        fontSize: tokens.fontSizeHero700,
        fontWeight: tokens.fontWeightSemibold,
    },
    divider: {
        height: '3px',
        backgroundColor: tokens.colorNeutralStroke1,
        margin: `${tokens.spacingVerticalM} 0`,
        borderRadius: '2px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: tokens.spacingVerticalM,
    },
    field: {
        display: 'grid',
        gridRowGap: tokens.spacingVerticalXXS,
    },
    input: {
        width: '100%',
        borderRadius: '6px',
        transition: 'box-shadow 0.3s ease-in-out',
        ':focus-within': {
            boxShadow: `0 0 0 2px ${tokens.colorBrandBackground}`,
        },
    },
    button: {
        marginTop: tokens.spacingVerticalM,
        height: tokens.spacingVerticalXXL,
        fontSize: tokens.fontSizeBase400,
        fontWeight: tokens.fontWeightSemibold,
        backgroundColor: tokens.colorBrandBackground,
        color: tokens.colorNeutralForegroundOnBrand,
        borderRadius: '8px',
        transition: 'transform 0.2s ease, background-color 0.3s ease',
        ':hover': {
            backgroundColor: tokens.colorBrandBackgroundHover,
            transform: 'translateY(-2px)',
        },
        ':disabled': {
            backgroundColor: tokens.colorNeutralBackgroundDisabled,
            color: tokens.colorNeutralForegroundDisabled,
        },
    },
    footer: {
        textAlign: 'center',
        marginTop: tokens.spacingVerticalXXL,
        color: tokens.colorNeutralForeground2,
        fontSize: tokens.fontSizeBase200,
    },
    spinner: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: tokens.colorPaletteRedForeground1,
        textAlign: 'center',
        fontSize: tokens.fontSizeBase300,
        fontWeight: tokens.fontWeightSemibold,
        marginBottom: tokens.spacingVerticalM,
    },
    '@keyframes fadeIn': {
        from: { opacity: 0, transform: 'translateY(-20px)' },
        to: { opacity: 1, transform: 'translateY(0)' },
    },
});

export const Login = () => {
    const styles = useStyles();
    const [staffId, setStaffId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(staffId, password);
        } catch {
            setError('无效的凭据，请重试。');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.svgBackground}></div>
            <Card className={styles.card}>
                <Text as="h1" className={styles.header}>欢迎登录</Text>
                <div className={styles.divider}></div>

                {error && <Text className={styles.errorText}>{error}</Text>}

                <form onSubmit={handleLogin} className={styles.form}>
                    <div className={styles.field}>
                        <Label htmlFor="staffId">员工编号</Label>
                        <Input
                            id="staffId"
                            className={styles.input}
                            appearance="filled-lighter"
                            contentBefore={<Person24Regular />}
                            value={staffId}
                            onChange={(e) => setStaffId(e.target.value)}
                            required
                            placeholder="请输入您的员工编号"
                        />
                    </div>

                    <div className={styles.field}>
                        <Label htmlFor="password">密码</Label>
                        <Input
                            id="password"
                            className={styles.input}
                            appearance="filled-lighter"
                            contentBefore={<LockClosed24Regular />}
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="请输入您的密码"
                        />
                    </div>

                    <Button
                        appearance="primary"
                        type="submit"
                        disabled={loading}
                        className={styles.button}
                    >
                        {loading ? (
                            <div className={styles.spinner}>
                                <Spinner size="small" label="登录中..." />
                            </div>
                        ) : (
                            '登录'
                        )}
                    </Button>
                </form>

                <Text className={styles.footer}>
                    © 2025 鲲鹏聚数:基于华为GaussDB数据库的应用与实践
                </Text>
            </Card>
        </div>
    );
};