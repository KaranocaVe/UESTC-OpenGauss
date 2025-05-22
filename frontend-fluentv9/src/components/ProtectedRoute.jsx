import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Spinner, makeStyles, Card, Text } from '@fluentui/react-components';

const useStyles = makeStyles({
    centerContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: 'var(--colorNeutralBackground1)', // Fluent Design 背景色
        textAlign: 'center',
        gap: '10px',
    },
    card: {
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // 添加阴影
        backgroundColor: 'var(--colorNeutralBackground2)', // 卡片背景色
    },
    textPrimary: {
        color: 'var(--colorNeutralForeground1)', // 主前景色
        fontSize: '1.25rem',
        fontWeight: '600',
    },
    textSecondary: {
        color: 'var(--colorNeutralForeground2)', // 次要前景色
    },
    textError: {
        color: 'var(--colorPaletteRedForeground1)', // 错误前景色
        fontWeight: '600',
    },
});

export const ProtectedRoute = ({ children, requiredRole }) => {
    const { user, loading, isAuthenticated } = useAuth();
    const styles = useStyles();

    if (loading) {
        return (
            <div className={styles.centerContainer}>
                <Card className={styles.card}>
                    <Spinner label="加载中..." size="large" />
                    <Text className={styles.textSecondary}>请稍候，正在加载您的数据...</Text>
                </Card>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className={styles.centerContainer}>
                <Text className={styles.textError}>未登录</Text>
                <Text className={styles.textSecondary}>您需要登录才能访问此页面。</Text>
                <Navigate to="/login" replace />
            </div>
        );
    }

    if (requiredRole && user.role !== requiredRole) {
        return (
            <div className={styles.centerContainer}>
                <Text className={styles.textError}>权限不足</Text>
                <Text className={styles.textSecondary}>您没有访问此页面的权限。</Text>
                <Navigate to="/unauthorized" replace />
            </div>
        );
    }

    return children;
};