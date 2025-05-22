import {useEffect, useState} from 'react';
import {Card, Input, makeStyles, Spinner, Text, Toast, ToastTitle,} from '@fluentui/react-components';
import {History24Regular, NumberSymbol24Regular, Person24Regular} from '@fluentui/react-icons';
import {PageHeader} from '../../components/PageHeader';
import {MainLayout} from '../../layouts/MainLayout';
import {getEmployeeById, getEmployeeWorkHistory} from '../../api/hrService';

const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        width: '100%',
        padding: '20px',
        boxSizing: 'border-box',
    },
    card: {
        padding: '20px',
        width: '100%',
        boxSizing: 'border-box',
        backgroundColor: 'var(--colorNeutralBackground1)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        overflow: 'hidden',
        transition: 'transform 200ms ease-in-out, box-shadow 200ms ease-in-out',
        ':hover': {
            transform: 'scale(1.02)',
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
        },
    },
    spinner: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100px',
    },
    sectionHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '10px',
    },
    input: {
        marginBottom: '10px',
    },
    toast: {
        maxWidth: '600px',
    },
});

export const HREmployeeHistory = () => {
    const styles = useStyles();
    const [employeeInfo, setEmployeeInfo] = useState(null);
    const [workHistory, setWorkHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [staffIdQuery, setStaffIdQuery] = useState('');

    // 自动搜索逻辑
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (staffIdQuery) {
                handleSearch();
            }
        }, 500); // 延迟 500ms 后触发搜索

        return () => clearTimeout(delayDebounceFn); // 清除上一次的定时器
    }, [staffIdQuery]);

    const handleSearch = async () => {
        if (!staffIdQuery) return;

        setLoading(true);
        setError(null);

        try {
            const staffId = parseInt(staffIdQuery, 10);
            if (isNaN(staffId)) {
                throw new Error('无效的员工编号');
            }

            const [employee, history] = await Promise.all([
                getEmployeeById(staffId),
                getEmployeeWorkHistory(staffId),
            ]);

            setEmployeeInfo(employee);
            setWorkHistory(history);
        } catch (err) {
            setError('获取员工工作历史失败');
            console.error(err);
            setEmployeeInfo(null);
            setWorkHistory([]);
        } finally {
            setLoading(false);
        }
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className={styles.spinner}>
                    <Spinner label="搜索中..." />
                </div>
            );
        }

        if (error) {
            return (
                <Toast intent="error" className={styles.toast}>
                    <ToastTitle>{error}</ToastTitle>
                </Toast>
            );
        }

        if (!employeeInfo) {
            return staffIdQuery ? (
                <Toast intent="warning" className={styles.toast}>
                    <ToastTitle>未找到员工编号为: {staffIdQuery} 的员工</ToastTitle>
                </Toast>
            ) : (
                <Text>请输入员工编号以查看其工作历史</Text>
            );
        }

        return (
            <div className={styles.container}>
                {/* 员工信息卡片 */}
                <Card className={styles.card}>
                    <div className={styles.sectionHeader}>
                        <Person24Regular className={styles.icon}/>
                        <Text size={600} weight="semibold">
                            员工信息
                        </Text>
                    </div>
                    <div style={{lineHeight: '1.8', padding: '10px 0'}}>
                        <Text block>
                            <strong>员工编号:</strong> {employeeInfo.staffId}
                        </Text>
                        <Text block>
                            <strong>姓名:</strong> {employeeInfo.firstName} {employeeInfo.lastName}
                        </Text>
                        <Text block>
                            <strong>当前部门:</strong> {employeeInfo.sectionName}
                        </Text>
                        <Text block>
                            <strong>当前职位:</strong> {employeeInfo.employmentTitle || employeeInfo.employmentId}
                        </Text>
                    </div>
                </Card>

                {/* 工作历史卡片 */}
                <Card className={styles.card}>
                    <div className={styles.sectionHeader}>
                        <History24Regular className={styles.icon}/>
                        <Text size={600} weight="semibold">
                            工作历史
                        </Text>
                    </div>
                    {workHistory.length === 0 ? (
                        <Toast intent="info" className={styles.toast}>
                            <ToastTitle>未找到该员工的工作历史记录</ToastTitle>
                        </Toast>
                    ) : (
                        <div style={{overflowX: 'auto', marginTop: '10px'}}>
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 2fr 2fr 2fr 2fr',
                                    gap: '10px',
                                    fontWeight: 'bold',
                                    borderBottom: '2px solid var(--colorNeutralStroke1)',
                                    padding: '10px 0',
                                }}
                            >
                                <div>编号</div>
                                <div>职位</div>
                                <div>部门</div>
                                <div>开始日期</div>
                                <div>结束日期</div>
                            </div>
                            {workHistory.map((item) => (
                                <div
                                    key={item.employmentId}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 2fr 2fr 2fr 2fr',
                                        gap: '10px',
                                        padding: '10px 0',
                                        borderBottom: '1px solid var(--colorNeutralStroke2)',
                                    }}
                                >
                                    <div>
                                        <Text>{item.employmentId}</Text>
                                    </div>
                                    <div>
                                        <Text>{item.employmentTitle}</Text>
                                    </div>
                                    <div>
                                        <Text>{item.sectionName}</Text>
                                    </div>
                                    <div>
                                        <Text>
                                            {new Date(item.startDate).toLocaleDateString('zh-CN', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </Text>
                                    </div>
                                    <div>
                                        <Text>
                                            {item.endDate
                                                ? new Date(item.endDate).toLocaleDateString('zh-CN', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })
                                                : '当前'}
                                        </Text>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        );
    };

    return (
        <MainLayout>
            <PageHeader title="员工工作历史" />
            <div className={styles.container}>
                <Card className={styles.card}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <NumberSymbol24Regular />
                        <Text size={600} weight="semibold">
                            通过员工编号搜索
                        </Text>
                    </div>
                    <Input
                        className={styles.input}
                        value={staffIdQuery}
                        onChange={(e) => setStaffIdQuery(e.target.value)}
                        placeholder="请输入员工编号"
                    />
                </Card>
                {renderContent()}
            </div>
        </MainLayout>
    );
};