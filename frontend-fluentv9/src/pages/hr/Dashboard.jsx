import {useEffect, useState} from 'react';
import {Card, CardHeader, makeStyles, Spinner, Text,} from '@fluentui/react-components';
import {Building24Regular, People24Regular} from '@fluentui/react-icons';
import {PageHeader} from '../../components/PageHeader';
import {MainLayout} from '../../layouts/MainLayout';
import {getAllEmployees, getAllSalaryStats, getAllSections} from '../../api/hrService';

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
});

export const HRDashboard = () => {
    const styles = useStyles();
    const [employees, setEmployees] = useState([]);
    const [stats, setStats] = useState([]);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [employeesData, statsData, sectionsData] = await Promise.all([
                    getAllEmployees(false),
                    getAllSalaryStats(),
                    getAllSections(),
                ]);

                setEmployees(employeesData);
                setStats(statsData);
                setSections(sectionsData);
            } catch (err) {
                setError('加载仪表板信息失败');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const renderContent = () => {
        if (loading) {
            return (
                <div className={styles.spinner}>
                    <Spinner label="正在加载仪表板信息..." />
                </div>
            );
        }

        if (error) {
            return <Text className={styles.errorText}>{error}</Text>;
        }

        return (
            <div className={styles.container}>
                <Card className={styles.card}>
                    <CardHeader
                        header={
                            <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                <People24Regular/>
                                <Text size={600} weight="semibold">
                                    欢迎来到人力资源管理
                                </Text>
                            </div>
                        }
                        description="您可以访问所有人力资源管理功能"
                    />
                </Card>

                <div className={styles.statsContainer} style={{display: 'flex', gap: '20px'}}>
                    <Card className={styles.statCard}>
                        <Text>员工总数</Text>
                        <Text size={600}>{employees.length}</Text>
                    </Card>

                    <Card className={styles.statCard}>
                        <Text>部门总数</Text>
                        <Text size={600}>{sections.length}</Text>
                    </Card>

                    <Card className={styles.statCard}>
                        <Text>公司平均薪资</Text>
                        <Text size={600}>
                            ${stats.length > 0
                            ? (stats.reduce((acc, curr) => acc + curr.avgSalary, 0) / stats.length).toFixed(2)
                            : 0}
                        </Text>
                    </Card>
                </div>

                <Card className={styles.card}>
                    <CardHeader
                        header={
                            <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                <Building24Regular/>
                                <Text size={500}>部门概览</Text>
                            </div>
                        }
                    />
                    <div className={styles.table}>
                        <div className={styles.tableRow} style={{fontWeight: 'bold'}}>
                            <div className={styles.tableCell}>
                                <Text>部门编号</Text>
                            </div>
                            <div className={styles.tableCell}>
                                <Text>部门名称</Text>
                            </div>
                            <div className={styles.tableCell}>
                                <Text>经理姓名</Text>
                            </div>
                            <div className={styles.tableCell}>
                                <Text>所在城市</Text>
                            </div>
                            <div className={styles.tableCell}>
                                <Text>平均薪资</Text>
                            </div>
                        </div>
                        {sections.slice(0, 5).map((section) => {
                            const departmentStats = stats.find((s) => s.sectionId === section.sectionId);
                            return (
                                <div key={section.sectionId} className={styles.tableRow}>
                                    <div className={styles.tableCell}>
                                        <Text>{section.sectionId}</Text>
                                    </div>
                                    <div className={styles.tableCell}>
                                        <Text>{section.sectionName}</Text>
                                    </div>
                                    <div className={styles.tableCell}>
                                        <Text>{section.managerName}</Text>
                                    </div>
                                    <div className={styles.tableCell}>
                                        <Text>{section.placeCity}</Text>
                                    </div>
                                    <div className={styles.tableCell}>
                                        <Text>
                                            {departmentStats ? `$${departmentStats.avgSalary.toFixed(2)}` : 'N/A'}
                                        </Text>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </div>
        );
    };

    return (
        <MainLayout>
            <PageHeader title="人力资源管理仪表板" />
            {renderContent()}
        </MainLayout>
    );
};