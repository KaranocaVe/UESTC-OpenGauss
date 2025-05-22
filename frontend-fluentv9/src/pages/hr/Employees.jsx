import {useEffect, useState} from 'react';
import {Button, Card, Input, makeStyles, Spinner, Switch, Text,} from '@fluentui/react-components';
import {ArrowClockwise24Regular} from '@fluentui/react-icons';
import {PageHeader} from '../../components/PageHeader';
import {MainLayout} from '../../layouts/MainLayout';
import {getAllEmployees, searchEmployeesByName} from '../../api/hrService';

const useStyles = makeStyles({
    container: {
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        width: "100%",
        padding: "20px",
        // backgroundColor: "var(--colorNeutralBackground2)", // 父容器背景色
        boxSizing: "border-box", // 确保内边距不会影响宽度
    },
    card: {
        padding: "20px",
        width: "100%",
        boxSizing: "border-box",
        backgroundColor: "var(--colorNeutralBackground1)", // 卡片背景色
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", // 添加柔和的阴影
        borderRadius: "8px",
        overflow: "hidden", // 确保内容不会溢出
        transition: "transform 200ms ease-in-out, box-shadow 200ms ease-in-out",
        ":hover": {
            transform: "scale(1.02)", // 鼠标悬停时轻微放大
            boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)", // 鼠标悬停时增强阴影
        },
    },
    icon: {
        fontSize: "24px",
        color: "var(--colorBrandForeground1)", // 使用品牌前景色
        flexShrink: 0,
    },
    spinner: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100px",
    },
    tableRow: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px 0",
        borderBottom: "1px solid var(--colorNeutralStroke1)", // 使用 Fluent UI 的中性色
    },
    tableCell: {
        flex: 1,
        color: "var(--colorNeutralForeground1)", // 使用 Fluent UI 的前景色
    },
    errorText: {
        color: "var(--colorPaletteRedForeground1)", // 使用 Fluent UI 的错误前景色
        textAlign: "center",
        fontSize: "1.25rem",
        fontWeight: "600",
    },
    actionButton: {
        marginTop: "20px",
        alignSelf: "center",
    },
    sectionHeader: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "10px",
    },
    searchContainer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "20px",
    },
    searchInput: {
        maxWidth: "300px",
        width: "100%",
    },
    message: {
        padding: "10px",
        borderRadius: "4px",
        backgroundColor: "#f3f2f1",
    },
    statsContainer: {
        display: "flex",
        gap: "20px",
        flexWrap: "wrap",
    },
    statCard: {
        padding: "20px",
        minWidth: "200px",
        flex: 1,
        maxWidth: "100%",
        width: "100%",
        boxSizing: "border-box",
        backgroundColor: "var(--colorNeutralBackground1)", // 卡片背景色
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", // 添加柔和的阴影
        borderRadius: "8px",
        overflow: "hidden", // 确保内容不会溢出
        transition: "transform 200ms ease-in-out, box-shadow 200ms ease-in-out",
        ":hover": {
            transform: "scale(1.02)", // 鼠标悬停时轻微放大
            boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)", // 鼠标悬停时增强阴影
        },
    },
    toast: {
        maxWidth: '600px',

    },
    input: {
        marginBottom: '10px',
    },
});

export const HREmployees = () => {
    const styles = useStyles();
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [orderBySalary, setOrderBySalary] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const data = await getAllEmployees(orderBySalary);
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
    }, [orderBySalary]);

    const handleSearch = async (newValue) => {
        setSearchQuery(newValue);

        if (!newValue) {
            setFilteredEmployees(employees);
            return;
        }

        if (newValue.length < 3) {
            const filtered = employees.filter(
                emp => `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(newValue.toLowerCase())
            );
            setFilteredEmployees(filtered);
            return;
        }

        try {
            const searchResults = await searchEmployeesByName(newValue);
            setFilteredEmployees(searchResults);
        } catch (err) {
            console.error('搜索失败:', err);
            const filtered = employees.filter(
                emp => `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(newValue.toLowerCase())
            );
            setFilteredEmployees(filtered);
        }
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className={styles.spinner}>
                    <Spinner label="正在加载员工..."/>
                </div>
            );
        }

        if (error) {
            return <Text style={{color: 'red'}}>{error}</Text>;
        }

        return (
            <div className={styles.container}>
                <Card className={styles.card}>
                    <div className={styles.header}>
                        <Input
                            className={styles.input}
                            placeholder="按姓名搜索"
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        <Switch
                            label="按薪资排序（降序）"
                            checked={orderBySalary}
                            onChange={async (_, data) => {
                                setLoading(true); // 进入加载状态
                                setOrderBySalary(data.checked);

                                try {
                                    const updatedEmployees = await getAllEmployees(data.checked); // 按新排序加载数据
                                    setEmployees(updatedEmployees); // 更新员工数据
                                    setFilteredEmployees(updatedEmployees); // 更新筛选后的数据
                                } catch (err) {
                                    setError('切换排序时加载员工失败');
                                    console.error(err);
                                } finally {
                                    setLoading(false); // 加载完成
                                }
                            }}
                        />
                    </div>
                    <Button
                        icon={<ArrowClockwise24Regular/>}
                        onClick={() => {
                            setLoading(true);
                            getAllEmployees(orderBySalary)
                                .then(data => {
                                    setEmployees(data);
                                    setFilteredEmployees(data);
                                    setSearchQuery('');
                                })
                                .catch(err => {
                                    setError('刷新员工失败');
                                    console.error(err);
                                })
                                .finally(() => setLoading(false));
                        }}
                    >
                        刷新
                    </Button>
                    <div className={styles.table}>
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
                                <Text>部门</Text>
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
                                    <Text>{item.sectionName}</Text>
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
                    <Text>显示 {filteredEmployees.length} 条，共 {employees.length} 条员工数据</Text>
                </Card>
            </div>
        );
    };

    return (
        <MainLayout>
            <PageHeader title="所有员工"/>
            {renderContent()}
        </MainLayout>
    );
};