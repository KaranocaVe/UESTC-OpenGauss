import {useState} from 'react';
import {Button, Card, Input, makeStyles, Spinner, Text,} from '@fluentui/react-components';
import {Clipboard24Regular, NumberSymbol24Regular, Search24Regular} from '@fluentui/react-icons';
import {PageHeader} from '../../components/PageHeader';
import {MainLayout} from '../../layouts/MainLayout';
import {useAuth} from '../../contexts/AuthContext';
import {getEmployeeById, searchEmployeesByName} from '../../api/managerService';

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
    message: {
        padding: '10px',
        borderRadius: '4px',
        backgroundColor: '#f3f2f1',
    },
});

export const ManagerEmployeeSearch = () => {
    const styles = useStyles();
    const { user } = useAuth();
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [staffIdQuery, setStaffIdQuery] = useState('');
    const [hasSearched, setHasSearched] = useState(false);

    const handleNameSearch = async () => {
        if (!searchQuery) return;

        setLoading(true);
        setError(null);
        setHasSearched(true);

        try {
            const results = await searchEmployeesByName(user.sectionId, searchQuery);
            setSearchResults(results);
        } catch (err) {
            setError('搜索失败，请重试。');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleIdSearch = async () => {
        if (!staffIdQuery) return;

        setLoading(true);
        setError(null);
        setHasSearched(true);

        try {
            const staffId = parseInt(staffIdQuery, 10);
            if (isNaN(staffId)) {
                throw new Error('无效的员工编号');
            }

            const employee = await getEmployeeById(user.sectionId, staffId);
            setSearchResults(employee ? [employee] : []);
        } catch (err) {
            setError('搜索失败，请确认员工编号是否正确。');
            console.error(err);
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    const renderSearchResults = () => {
        if (loading) {
            return (
                <div className={styles.spinner}>
                    <Spinner label="正在搜索..." />
                </div>
            );
        }

        if (error) {
            return <div className={styles.message} style={{ color: 'red' }}>{error}</div>;
        }

        if (!hasSearched) {
            return <Text>请输入搜索条件以查找员工</Text>;
        }

        if (searchResults.length === 0) {
            return <div className={styles.message} style={{ color: 'orange' }}>未找到符合搜索条件的员工</div>;
        }

        return (
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '20px'}}>
                {searchResults.map((item) => (
                    <Card key={item.staffId} className={styles.card}>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                            <Text weight="semibold">员工编号: {item.staffId}</Text>
                            <Text>姓名: {`${item.firstName} ${item.lastName}`}</Text>
                            <Text>邮箱: {item.email}</Text>
                            <Text>电话: {item.phoneNumber}</Text>
                            <Text>职位编号: {item.employmentId}</Text>
                            <Text>薪资: ¥{item.salary.toLocaleString()}</Text>
                        </div>
                    </Card>
                ))}
            </div>
        );
    };

    return (
        <MainLayout>
            <PageHeader title="搜索员工" />
            <div className={styles.container}>
                <Card className={styles.card}>
                    <div className={styles.searchContainer}>
                        <Input
                            placeholder="输入员工姓名"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            contentBefore={<Search24Regular />}
                        />
                        <Button
                            appearance="primary"
                            onClick={handleNameSearch}
                            disabled={!searchQuery}
                        >
                            搜索
                        </Button>
                    </div>
                </Card>

                <Card className={styles.card}>
                    <div className={styles.searchContainer}>
                        <Input
                            placeholder="输入员工编号"
                            value={staffIdQuery}
                            onChange={(e) => setStaffIdQuery(e.target.value)}
                            contentBefore={<NumberSymbol24Regular />}
                        />
                        <Button
                            appearance="primary"
                            onClick={handleIdSearch}
                            disabled={!staffIdQuery}
                        >
                            搜索
                        </Button>
                    </div>
                </Card>

                <Card className={styles.card}>
                    <div className={styles.searchContainer}>
                        <Clipboard24Regular />
                        <Text>搜索结果</Text>
                    </div>
                    {renderSearchResults()}
                </Card>
            </div>
        </MainLayout>
    );
};