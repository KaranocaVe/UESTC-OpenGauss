import {useEffect, useState} from 'react';
import {Button, Card, CardHeader, Divider, makeStyles, Spinner, Text,} from '@fluentui/react-components';
import {
    Briefcase24Regular,
    CalendarLtr24Regular,
    Call24Regular,
    ContactCardGroup24Regular,
    Mail24Regular,
    Money24Regular,
    Person24Regular,
} from '@fluentui/react-icons';
import {PageHeader} from '../../components/PageHeader';
import {MainLayout} from '../../layouts/MainLayout';
import {useAuth} from '../../contexts/AuthContext';
import {getEmployeeInfo} from '../../api/employeeService';

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
        width: '100%',
        boxSizing: 'border-box',
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
    tableRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 0',
        borderBottom: '1px solid var(--colorNeutralStroke1)', // 使用 Fluent UI 的中性色
    },
    tableCell: {
        flex: 1,
        color: 'var(--colorNeutralForeground1)', // 使用 Fluent UI 的前景色
    },
    errorText: {
        color: 'var(--colorPaletteRedForeground1)', // 使用 Fluent UI 的错误前景色
        textAlign: 'center',
        fontSize: '1.25rem',
        fontWeight: '600',
    },
    actionButton: {
        marginTop: '20px',
        alignSelf: 'center',
    },
    sectionHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '10px',
    },
});

export const EmployeeDashboard = () => {
    const styles = useStyles();
    const { user } = useAuth();
    const [employeeInfo, setEmployeeInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEmployeeInfo = async () => {
            try {
                const data = await getEmployeeInfo(user.staffId);
                setEmployeeInfo(data);
            } catch (err) {
                setError('加载员工信息失败');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployeeInfo();
    }, [user.staffId]);

    const renderContent = () => {
        if (loading) {
            return (
                <div className={styles.spinner}>
                    <Spinner label="正在加载员工信息..." size="large" />
                </div>
            );
        }

        if (error) {
            return (
                <div className={styles.errorText}>
                    <Text>{error}</Text>
                    <Button
                        className={styles.actionButton}
                        appearance="primary"
                        onClick={() => window.location.reload()}
                    >
                        重试
                    </Button>
                </div>
            );
        }

        const items = [
            {
                key: 'personalInfo',
                header: '个人信息',
                icon: <Person24Regular className={styles.icon}/>,
                fields: [
                    {
                        key: 'name',
                        label: '姓名',
                        value: `${employeeInfo.firstName} ${employeeInfo.lastName}`,
                        icon: <ContactCardGroup24Regular/>
                    },
                    {key: 'email', label: '邮箱', value: employeeInfo.email, icon: <Mail24Regular/>},
                    {key: 'phone', label: '电话', value: employeeInfo.phoneNumber, icon: <Call24Regular/>},
                ],
            },
            {
                key: 'employmentInfo',
                header: '雇佣信息',
                icon: <Briefcase24Regular className={styles.icon}/>,
                fields: [
                    {
                        key: 'staffId',
                        label: '员工编号',
                        value: employeeInfo.staffId,
                        icon: <ContactCardGroup24Regular/>
                    },
                    {key: 'department', label: '部门', value: employeeInfo.sectionName, icon: <Briefcase24Regular/>},
                    {
                        key: 'position',
                        label: '职位',
                        value: employeeInfo.employmentTitle || '无',
                        icon: <Briefcase24Regular/>
                    },
                    {
                        key: 'hireDate',
                        label: '入职日期',
                        value: new Date(employeeInfo.hireDate).toLocaleDateString('zh-CN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        }),
                        icon: <CalendarLtr24Regular/>
                    },
                    {
                        key: 'salary',
                        label: '薪资',
                        value: `$${employeeInfo.salary?.toLocaleString() || '无'}`,
                        icon: <Money24Regular/>
                    },
                ],
            },
        ];

        return (
            <div className={styles.container}>
                <Card className={styles.card}>
                    <CardHeader
                        header={
                            <Text size={600} weight="semibold">
                                欢迎, {employeeInfo.firstName}!
                            </Text>
                        }
                        description={<Text>以下是您的信息摘要</Text>}
                    />
                </Card>

                {items.map((item) => (
                    <Card key={item.key} className={styles.card}>
                        <div className={styles.sectionHeader}>
                            {item.icon}
                            <Text size={500} weight="semibold">
                                {item.header}
                            </Text>
                        </div>
                        <Divider />
                        <div>
                            {item.fields.map((field) => (
                                <div key={field.key} className={styles.tableRow}>
                                    {field.icon}
                                    <Text className={styles.tableCell}>{field.label}:</Text>
                                    <Text className={styles.tableCell} weight="semibold">
                                        {field.value}
                                    </Text>
                                </div>
                            ))}
                        </div>
                    </Card>
                ))}
            </div>
        );
    };

    return (
        <MainLayout>
            <PageHeader title="员工仪表盘" />
            <div style={{ width: '100%' }}>{renderContent()}</div>
        </MainLayout>
    );
};