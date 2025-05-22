import {useEffect, useState} from 'react';
import {Button, Card, Input, makeStyles, Spinner, Switch, Text,} from '@fluentui/react-components';
import {ArrowClockwise24Regular, Search24Regular} from '@fluentui/react-icons';
import {PageHeader} from '../../components/PageHeader';
import {MainLayout} from '../../layouts/MainLayout';
import {useAuth} from '../../contexts/AuthContext';
import {getSectionEmployees, searchEmployeesByName} from '../../api/managerService';

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
    searchContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '20px',
    },
    searchInput: {
        maxWidth: '300px',
        width: '100%',
    },
});

export const ManagerEmployees = () => {
    const styles = useStyles();
    const { user } = useAuth();
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [orderBySalary, setOrderBySalary] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const data = await getSectionEmployees(user.sectionId, orderBySalary);
                setEmployees(data);
                setFilteredEmployees(data);
            } catch (err) {
                setError('加载员工失败');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, [user.sectionId, orderBySalary]);

    const handleSearch = async (newValue) => {
        setSearchQuery(newValue);

        if (!newValue) {
            setFilteredEmployees(employees);
            return;
        }

        if (newValue.length < 3) {
            const filtered = employees.filter(
                (emp) => `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(newValue.toLowerCase())
            );
            setFilteredEmployees(filtered);
            return;
        }

        try {
            const searchResults = await searchEmployeesByName(user.sectionId, newValue);
            setFilteredEmployees(searchResults);
        } catch (err) {
            console.error('搜索失败:', err);
            const filtered = employees.filter(
                (emp) => `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(newValue.toLowerCase())
            );
            setFilteredEmployees(filtered);
        }
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                    <Spinner label="正在加载员工..." />
                </div>
            );
        }

        if (error) {
            return <Text style={{ color: 'red' }}>{error}</Text>;
        }

        return (
            <div className={styles.container}>
                <Card className={styles.card}>
                    <div className={styles.searchContainer}>
                        <Input
                            className={styles.searchInput}
                            placeholder="按姓名搜索"
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            contentBefore={<Search24Regular/>}
                        />
                        <Switch
                            label="按薪资排序（降序）"
                            checked={orderBySalary}
                            onChange={(e) => setOrderBySalary(e.target.checked)}
                        />
                    </div>
                    <div style={{display: 'flex', gap: '10px', marginBottom: '20px'}}>
                        <Button
                            appearance="primary"
                            icon={<ArrowClockwise24Regular/>}
                            onClick={() => {
                                setLoading(true);
                                getSectionEmployees(user.sectionId, orderBySalary)
                                    .then((data) => {
                                        setEmployees(data);
                                        setFilteredEmployees(data);
                                        setSearchQuery('');
                                    })
                                    .catch((err) => {
                                        setError('刷新员工失败');
                                        console.error(err);
                                    })
                                    .finally(() => setLoading(false));
                            }}
                        >
                            刷新
                        </Button>
                    </div>
                    <div className={styles.table}>
                        <div className={styles.tableRow}
                             style={{fontWeight: 'bold', borderBottom: '2px solid var(--colorNeutralStroke1)'}}>
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
                                <Text>入职日期</Text>
                            </div>
                            <div className={styles.tableCell}>
                                <Text>职位编号</Text>
                            </div>
                            <div className={styles.tableCell}>
                                <Text>薪资</Text>
                            </div>
                        </div>
                        {filteredEmployees.map((item) => (
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
                                    <Text>{new Date(item.hireDate).toLocaleDateString('zh-CN', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}</Text>
                                </div>
                                <div className={styles.tableCell}>
                                    <Text>{item.employmentId}</Text>
                                </div>
                                <div className={styles.tableCell}>
                                    <Text>¥{item.salary.toLocaleString()}</Text>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Text>
                        显示 {filteredEmployees.length} 条，共 {employees.length} 条员工记录
                    </Text>
                </Card>
            </div>
        );
    };

    return (
        <MainLayout>
            <PageHeader title="部门员工" />
            {renderContent()}
        </MainLayout>
    );
};