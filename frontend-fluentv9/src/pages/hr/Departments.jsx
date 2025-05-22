import {useEffect, useState} from 'react';
import {
    Button,
    Card,
    CardHeader,
    Dialog,
    DialogActions,
    DialogContent,
    DialogSurface,
    DialogTitle,
    Input,
    makeStyles,
    Spinner,
    Text,
    Toast,
    ToastTitle,
} from '@fluentui/react-components';
import {ArrowClockwise24Regular, Building24Regular, Edit24Regular} from '@fluentui/react-icons';
import {PageHeader} from '../../components/PageHeader';
import {MainLayout} from '../../layouts/MainLayout';
import {getAllSections, updateSectionName} from '../../api/hrService';

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
export const HRDepartments = () => {
    const styles = useStyles();
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedSection, setSelectedSection] = useState(null);
    const [newSectionName, setNewSectionName] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        fetchSections();
    }, []);

    const fetchSections = async () => {
        try {
            setLoading(true);
            const data = await getAllSections();
            setSections(data);
        } catch (err) {
            setError('加载部门失败');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEditSection = (section) => {
        setSelectedSection(section);
        setNewSectionName(section.sectionName);
        setIsDialogOpen(true);
    };

    const handleSaveSection = async () => {
        if (!selectedSection || !newSectionName.trim()) return;

        setIsUpdating(true);
        setError(null);
        setSuccessMessage(null);

        try {
            await updateSectionName(selectedSection.sectionId, newSectionName);

            setSections(sections.map(section =>
                section.sectionId === selectedSection.sectionId
                    ? { ...section, sectionName: newSectionName }
                    : section
            ));

            setSuccessMessage(`部门 "${selectedSection.sectionName}" 已更新为 "${newSectionName}"`);
            setIsDialogOpen(false);
        } catch (err) {
            setError('更新部门名称失败');
            console.error(err);
        } finally {
            setIsUpdating(false);
        }
    };

    const renderContent = () => {
        if (loading && sections.length === 0) {
            return (
                <div className={styles.spinner}>
                    <Spinner label="正在加载部门..." />
                </div>
            );
        }

        if (error && sections.length === 0) {
            return <Text className={styles.errorText}>{error}</Text>;
        }

        return (
            <div className={styles.container}>
                <Card className={styles.card}>
                    <CardHeader>
                        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <Building24Regular/>
                            <Text size={600} weight="semibold">
                                部门管理
                            </Text>
                        </div>
                    </CardHeader>

                    {successMessage && (
                        <Toast intent="success" className={styles.toast}>
                            <ToastTitle>{successMessage}</ToastTitle>
                        </Toast>
                    )}

                    {error && (
                        <Toast intent="error" className={styles.toast}>
                            <ToastTitle>{error}</ToastTitle>
                        </Toast>
                    )}

                    <Button
                        appearance="primary"
                        icon={<ArrowClockwise24Regular/>}
                        onClick={fetchSections}
                    >
                        刷新
                    </Button>

                    <div className={styles.table}>
                        <div className={styles.tableRow} style={{fontWeight: 'bold'}}>
                            <div className={styles.tableCell}>
                                <Text>部门 ID</Text>
                            </div>
                            <div className={styles.tableCell}>
                                <Text>部门名称</Text>
                            </div>
                            <div className={styles.tableCell}>
                                <Text>负责人</Text>
                            </div>
                            <div className={styles.tableCell}>
                                <Text>城市</Text>
                            </div>
                            <div className={styles.tableCell}>
                                <Text>地址</Text>
                            </div>
                            <div className={styles.tableCell}>
                                <Text>操作</Text>
                            </div>
                        </div>
                        {sections.map((section) => (
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
                                    <Text>{section.placeAddress}</Text>
                                </div>
                                <div className={styles.tableCell}>
                                    <Button
                                        appearance="primary"
                                        icon={<Edit24Regular/>}
                                        onClick={() => handleEditSection(section)}
                                    >
                                        编辑
                                    </Button>
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
            <PageHeader title="部门" />
            {renderContent()}

            {isDialogOpen && (
                <Dialog open={isDialogOpen} onOpenChange={() => setIsDialogOpen(false)}>
                    <DialogSurface>
                        <DialogTitle>编辑部门名称</DialogTitle>
                        <DialogContent>
                            <Input
                                className={styles.input}
                                value={newSectionName}
                                onChange={(e) => setNewSectionName(e.target.value)}
                                placeholder="新部门名称"
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button
                                appearance="primary"
                                onClick={handleSaveSection}
                                disabled={isUpdating || !newSectionName || newSectionName === selectedSection?.sectionName}
                            >
                                保存
                            </Button>
                            <Button onClick={() => setIsDialogOpen(false)}>取消</Button>
                        </DialogActions>
                    </DialogSurface>
                </Dialog>
            )}
        </MainLayout>
    );
};