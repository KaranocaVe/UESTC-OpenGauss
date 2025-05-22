import { useNavigate } from 'react-router-dom';
    import {
        Button,
        makeStyles,
        Text,
        Toast,
        ToastTitle,
    } from '@fluentui/react-components';
    import { Prohibited24Regular } from '@fluentui/react-icons';

    const useStyles = makeStyles({
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            padding: '20px',
            gap: '20px',
        },
        icon: {
            fontSize: '48px',
            color: '#d13438',
        },
        toast: {
            maxWidth: '600px',
        },
    });

    export const Unauthorized = () => {
        const styles = useStyles();
        const navigate = useNavigate();

        return (
            <div className={styles.container}>
                <Prohibited24Regular className={styles.icon} />
                <Text size={600} weight="semibold">
                    访问被拒绝
                </Text>
                <Toast intent="error" className={styles.toast}>
                    <ToastTitle>
                        您没有权限访问此页面。如果您认为这是一个错误，请联系您的管理员。
                    </ToastTitle>
                </Toast>
                <Button appearance="primary" onClick={() => navigate(-1)}>
                    返回
                </Button>
            </div>
        );
    };