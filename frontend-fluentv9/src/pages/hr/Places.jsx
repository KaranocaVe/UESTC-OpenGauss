import {useEffect, useState} from 'react';
import {
    Button,
    Card,
    Dialog,
    DialogActions,
    DialogBody,
    DialogSurface,
    DialogTitle,
    Input,
    makeStyles,
    Spinner,
    Text,
    Toast,
    ToastTitle,
} from '@fluentui/react-components';
import {Add24Regular, ArrowClockwise24Regular, Location24Regular} from '@fluentui/react-icons';
import {PageHeader} from '../../components/PageHeader';
import {MainLayout} from '../../layouts/MainLayout';
import {addPlace, getAllPlaces} from '../../api/hrService';

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

export const HRPlaces = () => {
    const styles = useStyles();
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newPlace, setNewPlace] = useState({
        streetAddress: '',
        postalCode: '',
        city: '',
        stateProvince: '',
        stateId: '',
    });
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        fetchPlaces();
    }, []);

    const fetchPlaces = async () => {
        try {
            setLoading(true);
            const data = await getAllPlaces();
            setPlaces(data);
        } catch (err) {
            setError('加载工作地点失败');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddPlace = () => {
        setNewPlace({
            streetAddress: '',
            postalCode: '',
            city: '',
            stateProvince: '',
            stateId: '',
        });
        setIsDialogOpen(true);
    };

    const handleInputChange = (field, value) => {
        setNewPlace({
            ...newPlace,
            [field]: value,
        });
    };

    const handleSavePlace = async () => {
        if (!newPlace.streetAddress || !newPlace.city || !newPlace.stateId) {
            setError('街道地址、城市和国家/州ID为必填项');
            return;
        }

        setIsAdding(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const addedPlace = await addPlace(newPlace);
            setPlaces([...places, addedPlace]);
            setSuccessMessage(`成功添加位于 ${newPlace.city} 的工作地点`);
            setIsDialogOpen(false);
        } catch (err) {
            setError('添加工作地点失败');
            console.error(err);
        } finally {
            setIsAdding(false);
        }
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                    <Spinner label="正在加载工作地点..." />
                </div>
            );
        }

        return (
            <div className={styles.container}>
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

                <Card className={styles.card}>
                    <div className={styles.header}>
                        <Location24Regular/>
                        <Text size={600} weight="semibold">
                            工作地点管理
                        </Text>
                    </div>
                    <div style={{display: 'flex', gap: '10px', marginBottom: '20px'}}>
                        <Button
                            appearance="primary"
                            icon={<Add24Regular/>}
                            onClick={handleAddPlace}
                        >
                            添加工作地点
                        </Button>
                        <Button
                            appearance="primary"
                            icon={<ArrowClockwise24Regular/>}
                            onClick={fetchPlaces}
                        >
                            刷新
                        </Button>
                    </div>
                    <div className={styles.table}>
                        <div className={styles.tableRow} style={{fontWeight: 'bold'}}>
                            <div className={styles.tableCell}>
                                <Text>地点ID</Text>
                            </div>
                            <div className={styles.tableCell}>
                                <Text>城市</Text>
                            </div>
                            <div className={styles.tableCell}>
                                <Text>街道地址</Text>
                            </div>
                            <div className={styles.tableCell}>
                                <Text>邮政编码</Text>
                            </div>
                            <div className={styles.tableCell}>
                                <Text>州/省</Text>
                            </div>
                            <div className={styles.tableCell}>
                                <Text>国家/州名称</Text>
                            </div>
                        </div>
                        {places.map((place) => (
                            <div key={place.placeId} className={styles.tableRow}>
                                <div className={styles.tableCell}>
                                    <Text>{place.placeId}</Text>
                                </div>
                                <div className={styles.tableCell}>
                                    <Text>{place.city}</Text>
                                </div>
                                <div className={styles.tableCell}>
                                    <Text>{place.streetAddress}</Text>
                                </div>
                                <div className={styles.tableCell}>
                                    <Text>{place.postalCode}</Text>
                                </div>
                                <div className={styles.tableCell}>
                                    <Text>{place.stateProvince}</Text>
                                </div>
                                <div className={styles.tableCell}>
                                    <Text>{place.stateName}</Text>
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
            <PageHeader title="工作地点" />
            {renderContent()}

            {isDialogOpen && (
                <Dialog open={isDialogOpen} onOpenChange={() => setIsDialogOpen(false)}>
                    <DialogSurface>
                        <DialogBody>
                            <DialogTitle>添加新工作地点</DialogTitle>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <Input
                                    className={styles.input}
                                    placeholder="街道地址"
                                    value={newPlace.streetAddress}
                                    onChange={(e) => handleInputChange('streetAddress', e.target.value)}
                                    required
                                />
                                <Input
                                    className={styles.input}
                                    placeholder="城市"
                                    value={newPlace.city}
                                    onChange={(e) => handleInputChange('city', e.target.value)}
                                    required
                                />
                                <Input
                                    className={styles.input}
                                    placeholder="邮政编码"
                                    value={newPlace.postalCode}
                                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                                />
                                <Input
                                    className={styles.input}
                                    placeholder="州/省"
                                    value={newPlace.stateProvince}
                                    onChange={(e) => handleInputChange('stateProvince', e.target.value)}
                                />
                                <Input
                                    className={styles.input}
                                    placeholder="国家/州ID"
                                    value={newPlace.stateId}
                                    onChange={(e) => handleInputChange('stateId', e.target.value)}
                                    required
                                />
                            </div>
                        </DialogBody>
                        <DialogActions>
                            <Button
                                appearance="primary"
                                onClick={handleSavePlace}
                                disabled={isAdding || !newPlace.streetAddress || !newPlace.city || !newPlace.stateId}
                            >
                                添加工作地点
                            </Button>
                            <Button onClick={() => setIsDialogOpen(false)}>取消</Button>
                        </DialogActions>
                    </DialogSurface>
                </Dialog>
            )}
        </MainLayout>
    );
};