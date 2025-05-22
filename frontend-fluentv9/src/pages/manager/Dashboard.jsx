import {useEffect, useState} from 'react';
import {Card, makeStyles, Spinner, Text,} from '@fluentui/react-components';
import {Organization24Regular, People24Regular} from '@fluentui/react-icons';
import {PageHeader} from '../../components/PageHeader';
import {MainLayout} from '../../layouts/MainLayout';
import {useAuth} from '../../contexts/AuthContext';
import {getSectionEmployees, getSectionSalaryStats} from '../../api/managerService';

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

export const ManagerDashboard = () => {
    const styles = useStyles();
    const { user } = useAuth();
    const [employees, setEmployees] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [employeesData, statsData] = await Promise.all([
                    getSectionEmployees(user.sectionId, false),
                    getSectionSalaryStats(user.sectionId),
                ]);

                setEmployees(employeesData);
                setStats(statsData);
            } catch (err) {
                setError('加载仪表盘信息失败');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user.sectionId]);

    const renderContent = () => {
        if (loading) {
            return (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                    <Spinner label="正在加载仪表盘信息..." />
                </div>
            );
        }

        if (error) {
            return <Text style={{ color: 'red' }}>{error}</Text>;
        }

        return (
            <div className={styles.container}>
                <Card className={styles.card}>
                    <div className={styles.sectionHeader}>
                        <Organization24Regular className={styles.icon}/>
                        <div>
                            <Text size={600} weight="semibold">
                                欢迎, {user.firstName}!
                            </Text>
                            <Text>您正在管理 {stats?.sectionName} 部门</Text>
                        </div>
                    </div>
                </Card>

                <div style={{display: 'flex', gap: '20px', flexWrap: 'wrap'}}>
                    <Card className={styles.card} style={{flex: 1, minWidth: '200px'}}>
                        <Text>员工总数</Text>
                        <Text size={700}>{employees.length}</Text>
                    </Card>
                    <Card className={styles.card} style={{flex: 1, minWidth: '200px'}}>
                        <Text>平均薪资</Text>
                        <Text size={700}>${stats?.avgSalary.toFixed(2)}</Text>
                    </Card>
                    <Card className={styles.card} style={{flex: 1, minWidth: '200px'}}>
                        <Text>最高薪资</Text>
                        <Text size={700}>${stats?.maxSalary}</Text>
                    </Card>
                    <Card className={styles.card} style={{flex: 1, minWidth: '200px'}}>
                        <Text>最低薪资</Text>
                        <Text size={700}>${stats?.minSalary}</Text>
                    </Card>
                </div>

                <Card className={styles.card}>
                    <div className={styles.sectionHeader}>
                        <People24Regular className={styles.icon}/>
                        <Text size={600} weight="semibold">
                            最近员工
                        </Text>
                    </div>
                    <div>
                        <div className={styles.tableRow} style={{fontWeight: 'bold'}}>
                            <div className={styles.tableCell}>
                                <Text>员工编号</Text>
                            </div>
                            <div className={styles.tableCell}>
                                <Text>姓名</Text>
                            </div>
                            <div className={styles.tableCell}>
                                <Text>邮箱</Text>
                            </div>
                            <div className={styles.tableCell}>
                                <Text>电话号码</Text>
                            </div>
                            <div className={styles.tableCell}>
                                <Text>薪资</Text>
                            </div>
                        </div>
                        {employees.slice(0, 5).map((item) => (
                            <div key={item.staffId} className={styles.tableRow}>
                                <div className={styles.tableCell}>
                                    <Text>{item.staffId}</Text>
                                </div>
                                <div className={styles.tableCell}>
                                    <Text>{`${item.firstName} ${item.lastName}`}</Text>
                                </div>
                                <div className={styles.tableCell}>
                                    <Text>{item.email}</Text>
                                </div>
                                <div className={styles.tableCell}>
                                    <Text>{item.phoneNumber}</Text>
                                </div>
                                <div className={styles.tableCell}>
                                    <Text>${item.salary.toLocaleString()}</Text>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Text>
                        {employees.length > 5
                            ? `显示 5 位员工，共 ${employees.length} 位员工。请在员工标签中查看全部。`
                            : `已显示全部 ${employees.length} 位员工。`}
                    </Text>
                </Card>
            </div>
        );
    };

    return (
        <MainLayout>
            <PageHeader title="部门经理仪表盘" />
            {renderContent()}
        </MainLayout>
    );
};