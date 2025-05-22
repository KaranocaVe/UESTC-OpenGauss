import {useEffect, useState} from "react";
import {Card, makeStyles, Spinner, Text} from "@fluentui/react-components";
import {DataBarHorizontal24Regular, Table24Regular,} from "@fluentui/react-icons";
import {PageHeader} from "../../components/PageHeader";
import {MainLayout} from "../../layouts/MainLayout";
import {useAuth} from "../../contexts/AuthContext";
import {getSectionSalaryStats} from "../../api/managerService";

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

export const ManagerSalaryStatistics = () => {
    const styles = useStyles();
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const data = await getSectionSalaryStats(user.sectionId);
                setStats(data);
            } catch (err) {
                setError("加载薪资统计数据失败");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, [user.sectionId]);

    const renderContent = () => {
        if (loading) {
            return (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100px",
                    }}
                >
                    <Spinner label="正在加载统计数据..." />
                </div>
            );
        }

        if (error) {
            return <Text style={{ color: "red" }}>{error}</Text>;
        }

        if (!stats) {
            return <Text>暂无薪资统计数据</Text>;
        }

        const detailItems = [
            { key: "section", label: "部门", value: stats.sectionName },
            {
                key: "avgSalary",
                label: "平均薪资",
                value: `¥${stats.avgSalary.toFixed(2)}`,
            },
            { key: "maxSalary", label: "最高薪资", value: `¥${stats.maxSalary}` },
            { key: "minSalary", label: "最低薪资", value: `¥${stats.minSalary}` },
        ];

        return (
            <div className={styles.container}>
                <Card className={styles.card}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <DataBarHorizontal24Regular />
                        <div>
                            <Text size={600}>{stats.sectionName} 部门的薪资统计</Text>
                        </div>
                    </div>
                </Card>

                <div className={styles.statsContainer}>
                    <Card className={styles.statCard}>
                        <Text>平均薪资</Text>
                        <Text size={700}>¥{stats.avgSalary.toFixed(2)}</Text>
                        <Text>所有员工薪资的算术平均值</Text>
                    </Card>

                    <Card className={styles.statCard}>
                        <Text>最高薪资</Text>
                        <Text size={700}>¥{stats.maxSalary}</Text>
                        <Text>部门内的最高薪资</Text>
                    </Card>

                    <Card className={styles.statCard}>
                        <Text>最低薪资</Text>
                        <Text size={700}>¥{stats.minSalary}</Text>
                        <Text>部门内的最低薪资</Text>
                    </Card>
                </div>

                <Card className={styles.card}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <Table24Regular />
                        <Text size={500}>详细统计</Text>
                    </div>
                    <div className={styles.table}>
                        {detailItems.map((item) => (
                            <div key={item.key} className={styles.tableRow}>
                                <div className={styles.tableCell}>
                                    <Text>{item.label}</Text>
                                </div>
                                <div className={styles.tableCell}>
                                    <Text>{item.value}</Text>
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
