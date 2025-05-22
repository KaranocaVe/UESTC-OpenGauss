import {useCallback, useEffect, useState} from 'react';
import {Avatar, Card, Input, makeStyles, Spinner, Text, Toast, ToastTitle,} from '@fluentui/react-components';
import {Clipboard24Regular, NumberSymbol24Regular, Search24Regular} from '@fluentui/react-icons';
import {PageHeader} from '../../components/PageHeader';
import {MainLayout} from '../../layouts/MainLayout';
import {getEmployeeById, searchEmployeesByName} from '../../api/hrService';

const useStyles = makeStyles({
    container: {
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        width: "100%",
        padding: "20px",
        boxSizing: "border-box",
    },
    card: {
        padding: "20px",
        width: "100%",
        boxSizing: "border-box",
        backgroundColor: "var(--colorNeutralBackground1)",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
        overflow: "hidden",
        transition: "transform 200ms ease-in-out, box-shadow 200ms ease-in-out",
        ":hover": {
            transform: "scale(1.02)",
            boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
        },
    },
    spinner: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100px",
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
        backgroundColor: "var(--colorNeutralBackground1)",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
        overflow: "hidden",
        transition: "transform 200ms ease-in-out, box-shadow 200ms ease-in-out",
        ":hover": {
            transform: "scale(1.02)",
            boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
        },
    },
    input: {
        marginBottom: '10px',
    },
});

export const HREmployeeSearch = () => {
    const styles = useStyles();
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [staffIdQuery, setStaffIdQuery] = useState('');
    const [hasSearched, setHasSearched] = useState(false);

    // 使用 useCallback 包裹 handleNameSearch
    const handleNameSearch = useCallback(async () => {
        setLoading(true);
        setError(null);
        setHasSearched(true);

        try {
            const results = await searchEmployeesByName(searchQuery);
            setSearchResults(results);
        } catch (err) {
            setError('搜索失败，请重试。');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [searchQuery]); // 将 searchQuery 作为依赖

    // 自动搜索姓名
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchQuery) {
                handleNameSearch();
            }
        }, 500); // 延迟 500ms 后触发搜索

        return () => clearTimeout(delayDebounceFn); // 清除上一次的定时器
    }, [handleNameSearch, searchQuery]);


    const handleIdSearch = useCallback(async () => {
        setLoading(true);
        setError(null);
        setHasSearched(true);

        try {
            const staffId = parseInt(staffIdQuery, 10);
            if (isNaN(staffId)) {
                throw new Error('无效的员工 ID');
            }

            const employee = await getEmployeeById(staffId);
            setSearchResults(employee ? [employee] : []);
        } catch (err) {
            setError('搜索失败，请确认员工 ID 是否正确。');
            console.error(err);
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    }, [staffIdQuery]);

    // 自动搜索 ID
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (staffIdQuery) {
                handleIdSearch();
            }
        }, 500); // 延迟 500ms 后触发搜索

        return () => clearTimeout(delayDebounceFn); // 清除上一次的定时器
    }, [handleIdSearch, staffIdQuery]);


    const renderSearchResults = () => {
        if (loading) {
            return (
                <div className={styles.spinner}>
                    <Spinner label="搜索中..." />
                </div>
            );
        }

        if (error) {
            return (
                <Toast intent="error">
                    <ToastTitle>{error}</ToastTitle>
                </Toast>
            );
        }

        if (!hasSearched) {
            return <Text>请输入搜索条件以查找员工</Text>;
        }

        if (searchResults.length === 0) {
            return (
                <Toast intent="warning">
                    <ToastTitle>未找到符合搜索条件的员工</ToastTitle>
                </Toast>
            );
        }

        return (
            <div className={styles.statsContainer}>
                {searchResults.map((item) => (
                    <Card key={item.staffId} className={styles.statCard} style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(0, 0, 0, 0.1)',
                        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
                        transition: 'transform 200ms ease-in-out, box-shadow 200ms ease-in-out',
                    }}>
                        <div style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
                            <Avatar
                                name={`${item.firstName} ${item.lastName}`}
                                size={48}
                                style={{marginRight: '10px'}}
                            />
                            <Text weight="bold" size={600} style={{color: 'var(--colorNeutralForeground1)'}}>
                                {`${item.firstName} ${item.lastName}`}
                            </Text>
                        </div>
                        <Text style={{color: 'var(--colorNeutralForeground2)'}}>员工 ID: {item.staffId}</Text>
                        <Text style={{color: 'var(--colorNeutralForeground2)'}}>邮箱: {item.email}</Text>
                        <Text style={{color: 'var(--colorNeutralForeground2)'}}>电话: {item.phoneNumber}</Text>
                        <Text style={{color: 'var(--colorNeutralForeground2)'}}>部门: {item.sectionName}</Text>
                        <Text style={{color: 'var(--colorNeutralForeground2)'}}>职位 ID: {item.employmentId}</Text>
                        <Text style={{color: 'var(--colorNeutralForeground2)'}}>薪资:
                            ¥{item.salary.toLocaleString()}</Text>
                    </Card>
                ))}
            </div>
        );
    };

    return (
        <MainLayout>
            <PageHeader title="员工搜索" />
            <div className={styles.container}>
                <div className={styles.statsContainer}>
                    <Card className={styles.statCard}>
                        <div className={styles.header}>
                            <Search24Regular/>
                            <Text size={600} weight="semibold">
                                按姓名搜索
                            </Text>
                        </div>
                        <Input
                            className={styles.input}
                            placeholder="输入员工姓名"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </Card>

                    <Card className={styles.statCard}>
                        <div className={styles.header}>
                            <NumberSymbol24Regular/>
                            <Text size={600} weight="semibold">
                                按 ID 搜索
                            </Text>
                        </div>
                        <Input
                            className={styles.input}
                            placeholder="输入员工 ID"
                            value={staffIdQuery}
                            onChange={(e) => setStaffIdQuery(e.target.value)}
                        />
                    </Card>
                </div>

                <Card className={styles.card} style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                }}>
                    <div className={styles.header}>
                        <Clipboard24Regular />
                        <Text size={600} weight="semibold">
                            搜索结果
                        </Text>
                    </div>
                    {renderSearchResults()}
                </Card>
            </div>
        </MainLayout>
    );
};