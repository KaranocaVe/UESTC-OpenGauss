import {useEffect, useState} from 'react';
import {
    Button,
    Card,
    CardHeader,
    Divider,
    Input,
    makeStyles,
    Spinner,
    Text,
    Toast,
    ToastTitle,
} from '@fluentui/react-components';
import {Briefcase24Regular, Mail24Regular, Phone24Regular, Save24Regular} from '@fluentui/react-icons';
import {PageHeader} from '../../components/PageHeader';
import {MainLayout} from '../../layouts/MainLayout';
import {useAuth} from '../../contexts/AuthContext';
import {getEmployeeInfo, updatePhoneNumber} from '../../api/employeeService';

const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        width: '100%',
        padding: '20px',
        // backgroundColor: 'var(--colorNeutralBackground2)', // 父容器背景色
        boxSizing: 'border-box', // 确保内边距不会影响宽度
    },
    card: {
        padding: '20px',
        backgroundColor: 'var(--colorNeutralBackground1)', // 卡片背景色
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // 添加柔和的阴影
        borderRadius: '8px',
        overflow: 'hidden', // 确保内容不会溢出
        transition: 'transform 200ms ease-in-out, box-shadow 200ms ease-in-out',
        ':hover': {
            transform: 'scale(1.02)', // 鼠标悬停时轻微放大
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)', // 鼠标悬停时增强阴影
        },
    },
    icon: {
        fontSize: '24px',
        color: 'var(--colorBrandForeground1)', // 使用品牌前景色
        flexShrink: 0,
    },
    spinner: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100px',
    },
    field: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        padding: '10px 0',
        borderBottom: '1px solid var(--colorNeutralStroke1)', // 使用 Fluent UI 的中性色
    },
    label: {
        fontWeight: '600',
        color: 'var(--colorNeutralForeground1)',
    },
    value: {
        color: 'var(--colorNeutralForeground2)',
        fontWeight: 'semibold',
    },
    buttonContainer: {
        marginTop: '20px',
        display: 'flex',
        justifyContent: 'center',
    },
    sectionHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '10px',
    },
});

export const EmployeeProfile = () => {
    const styles = useStyles();
    const { user } = useAuth();
    const [employeeInfo, setEmployeeInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchEmployeeInfo = async () => {
            try {
                const data = await getEmployeeInfo(user.staffId);
                setEmployeeInfo(data);
                setPhoneNumber(data.phoneNumber || '');
            } catch (err) {
                setError('加载员工信息失败');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployeeInfo();
    }, [user.staffId]);

    const handleUpdatePhone = async () => {
        setUpdating(true);
        setError(null);
        setSuccessMessage(null);

        try {
            await updatePhoneNumber(user.staffId, phoneNumber);
            setSuccessMessage('电话号码更新成功');
            setEmployeeInfo({ ...employeeInfo, phoneNumber });
        } catch (err) {
            setError('更新电话号码失败');
            console.error(err);
        } finally {
            setUpdating(false);
        }
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className={styles.spinner}>
                    <Spinner label="正在加载个人信息..." size="large" />
                </div>
            );
        }

        if (error && !employeeInfo) {
            return <Text style={{ color: 'var(--colorPaletteRedForeground1)' }}>{error}</Text>;
        }

        return (
            <div className={styles.container}>
                {/* 个人信息和联系方式 */}
                <Card className={styles.card}>
                    <CardHeader
                        header={<Text size={600} weight="semibold">{`${employeeInfo.firstName} ${employeeInfo.lastName}`}</Text>}
                        description={`员工编号: ${employeeInfo.staffId}`}
                    />
                    {successMessage && (
                        <Toast intent="success">
                            <ToastTitle>{successMessage}</ToastTitle>
                        </Toast>
                    )}
                    {error && (
                        <Toast intent="error">
                            <ToastTitle>{error}</ToastTitle>
                        </Toast>
                    )}
                    <Divider />
                    <div className={styles.field}>
                        <Text className={styles.label}>电话号码</Text>
                        <Input
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            contentBefore={<Phone24Regular />}
                            placeholder="电话号码"
                        />
                    </div>
                    <div className={styles.buttonContainer}>
                        <Button
                            appearance="primary"
                            onClick={handleUpdatePhone}
                            disabled={updating || phoneNumber === employeeInfo.phoneNumber}
                            icon={<Save24Regular />}
                        >
                            {updating ? '正在更新...' : '更新电话号码'}
                        </Button>
                    </div>
                </Card>

                {/* 工作信息 */}
                <Card className={styles.card}>
                    <CardHeader
                        header={
                            <div className={styles.sectionHeader}>
                                <Briefcase24Regular className={styles.icon} />
                                <Text size={500} weight="semibold">工作信息</Text>
                            </div>
                        }
                    />
                    <Divider />
                    <div className={styles.field}>
                        <Text className={styles.label}>部门</Text>
                        <Text className={styles.value}>{employeeInfo.sectionName}</Text>
                    </div>
                    <div className={styles.field}>
                        <Text className={styles.label}>职位</Text>
                        <Text className={styles.value}>{employeeInfo.employmentTitle || '无'}</Text>
                    </div>
                    <div className={styles.field}>
                        <Text className={styles.label}>入职日期</Text>
                        <Text className={styles.value}>
                            {new Date(employeeInfo.hireDate).toLocaleDateString('zh-CN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </Text>
                    </div>
                    <div className={styles.field}>
                        <Text className={styles.label}>薪资</Text>
                        <Text className={styles.value}>
                            ${employeeInfo.salary?.toLocaleString() || '无'}
                        </Text>
                    </div>
                    <div className={styles.field}>
                        <Text className={styles.label}>邮箱</Text>
                        <Text className={styles.value}>
                            <Mail24Regular className={styles.icon} /> {employeeInfo.email}
                        </Text>
                    </div>
                </Card>
            </div>
        );
    };

    return (
        <MainLayout>
            <PageHeader title="我的个人信息" />
            {renderContent()}
        </MainLayout>
    );
};