import {useEffect, useState} from 'react';
import {Card, makeStyles, Spinner, Text,} from '@fluentui/react-components';
import {DataBarHorizontal24Regular, Table24Regular} from '@fluentui/react-icons';
import {PageHeader} from '../../components/PageHeader';
import {MainLayout} from '../../layouts/MainLayout';
import {getAllSalaryStats} from '../../api/hrService';

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
    spinner: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100px',
        
    },
    toast: {
        maxWidth: '600px',
        
    },
    input: {
        marginBottom: '10px',
    },
});

export const HRSalaryStatistics = () => {
    const styles = useStyles();
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const data = await getAllSalaryStats();
                setStats(data);
            } catch (err) {
                setError('加载薪资统计数据失败');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, []);

    const renderContent = () => {
        if (loading) {
            return (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                    <Spinner label="正在加载统计数据..." />
                </div>
            );
        }

        if (error) {
            return <Text style={{ color: 'red' }}>{error}</Text>;
        }

        if (stats.length === 0) {
            return <Text>暂无薪资统计数据</Text>;
        }

        const avgCompanySalary = stats.reduce((acc, curr) => acc + curr.avgSalary, 0) / stats.length;
        const maxCompanySalary = Math.max(...stats.map((s) => s.maxSalary));
        const minCompanySalary = Math.min(...stats.map((s) => s.minSalary));

        return (
            <div className={styles.container}>
                <Card className={styles.card}>
                    <div className={styles.header}>
                        <DataBarHorizontal24Regular/>
                        <div>
                            <Text size={600} weight="semibold">
                                公司范围薪资统计
                            </Text>
                        </div>
                    </div>
                </Card>

                <div style={{display: 'flex', gap: '20px', flexWrap: 'wrap'}}>
                    <Card className={styles.card} style={{flex: 1, minWidth: '200px'}}>
                        <Text>平均薪资</Text>
                        <Text size={700}>¥{avgCompanySalary.toFixed(2)}</Text>
                        <Text>覆盖所有部门</Text>
                    </Card>
                    <Card className={styles.card} style={{flex: 1, minWidth: '200px'}}>
                        <Text>最高薪资</Text>
                        <Text size={700}>¥{maxCompanySalary}</Text>
                        <Text>所有部门中的最高值</Text>
                    </Card>
                    <Card className={styles.card} style={{flex: 1, minWidth: '200px'}}>
                        <Text>最低薪资</Text>
                        <Text size={700}>¥{minCompanySalary}</Text>
                        <Text>所有部门中的最低值</Text>
                    </Card>
                </div>

                <Card className={styles.card}>
                    <div className={styles.header}>
                        <Table24Regular/>
                        <Text size={600} weight="semibold">
                            部门薪资统计
                        </Text>
                    </div>
                    <div className={styles.table}>
                        <div className={styles.tableRow} style={{fontWeight: 'bold'}}>
                            <div className={styles.tableCell}>
                                <Text>部门ID</Text>
                            </div>
                            <div className={styles.tableCell}>
                                <Text>部门名称</Text>
                            </div>
                            <div className={styles.tableCell}>
                                <Text>平均薪资</Text>
                            </div>
                            <div className={styles.tableCell}>
                                <Text>最高薪资</Text>
                            </div>
                            <div className={styles.tableCell}>
                                <Text>最低薪资</Text>
                            </div>
                        </div>
                        {stats.map((item) => (
                            <div key={item.sectionId} className={styles.tableRow}>
                                <div className={styles.tableCell}>
                                    <Text>{item.sectionId}</Text>
                                </div>
                                <div className={styles.tableCell}>
                                    <Text>{item.sectionName}</Text>
                                </div>
                                <div className={styles.tableCell}>
                                    <Text>¥{item.avgSalary.toFixed(2)}</Text>
                                </div>
                                <div className={styles.tableCell}>
                                    <Text>¥{item.maxSalary}</Text>
                                </div>
                                <div className={styles.tableCell}>
                                    <Text>¥{item.minSalary}</Text>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        );
    };

    return (
        <MainLayout>
            <PageHeader title="薪资统计" />
            {renderContent()}
        </MainLayout>
    );
};