import {useEffect, useState} from 'react';
import {Button, makeStyles, Text, Tree, TreeItem} from '@fluentui/react-components';
import {
    DataBarHorizontal24Regular,
    History24Regular,
    Home24Regular,
    Location24Regular,
    Navigation24Regular,
    Organization24Regular,
    People24Regular,
    Person24Regular,
    Search24Regular,
    SignOut24Regular,
} from '@fluentui/react-icons';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../contexts/AuthContext';

const useStyles = makeStyles({
    nav: {
        height: '100vh',
        borderRight: `1px solid var(--colorNeutralStroke1)`,
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        boxSizing: 'border-box',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        transition: 'width 0.3s ease',
        overflowY: 'auto',
        overflowX: 'hidden', // 确保隐藏水平滚动
        maxWidth: '100%', // 限制最大宽度
    },
    navExpanded: {
        width: '280px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
    navCollapsed: {
        width: '60px',
        padding: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
    toggleButton: {
        position: 'absolute',
        top: '20px',
        right: '-15px',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: 'var(--colorNeutralBackground1)',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transition: 'transform 0.3s ease, background-color 0.3s ease',
        zIndex: 10,
        ':hover': {
            backgroundColor: 'var(--colorNeutralBackground1Hover)',
            transform: 'scale(1.1)',
        },
    },
    treeItem: {
        padding: '12px 16px',
        borderRadius: '4px',
        color: 'var(--colorNeutralForeground1)',
        fontSize: '14px',
        fontWeight: '400',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        transition: 'background 0.2s ease, color 0.2s ease',
        ':hover': {
            backgroundColor: 'var(--colorNeutralBackground1Hover)',
            color: 'var(--colorBrandForeground1)',
        },
        ':focus': {
            outline: `2px solid var(--colorBrandStroke1)`,
        },
    },
    treeItemIcon: {
        fontSize: '20px',
        color: 'var(--colorNeutralForeground2)',
    },
    treeItemText: {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        display: 'inline-block',
        maxWidth: '100%', // 确保文本不会超出容器
    },
    header: {
        fontSize: '18px',
        fontWeight: '600',
        color: 'var(--colorBrandForeground1)',
        marginBottom: '10px',
    },
    footer: {
        marginTop: 'auto',
        paddingTop: '20px',
        borderTop: `1px solid var(--colorNeutralStroke1)`,
        textAlign: 'center',
        fontSize: '12px',
        color: 'var(--colorNeutralForeground2)',
    },
});

export const Navigation = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const styles = useStyles();

    // 从 localStorage 获取初始状态
    const [isCollapsed, setIsCollapsed] = useState(() => {
        const savedState = localStorage.getItem('navCollapsed');
        return savedState === 'true'; // 如果保存的状态是 'true'，则折叠
    });

    // 保存状态到 localStorage
    useEffect(() => {
        localStorage.setItem('navCollapsed', isCollapsed);
    }, [isCollapsed]);

    const navItems = [
        ...(user.role === 'EMPLOYEE'
            ? [
                  { name: '仪表盘', url: '/employee/dashboard', icon: <Home24Regular /> },
                  { name: '我的资料', url: '/employee/profile', icon: <Person24Regular /> },
              ]
            : []),
        ...(user.role === 'DEPARTMENT_MANAGER'
            ? [
                  { name: '仪表盘', url: '/manager/dashboard', icon: <Home24Regular /> },
                  { name: '部门员工', url: '/manager/employees', icon: <People24Regular /> },
                  { name: '搜索员工', url: '/manager/search', icon: <Search24Regular /> },
                  { name: '薪资统计', url: '/manager/statistics', icon: <DataBarHorizontal24Regular /> },
              ]
            : []),
        ...(user.role === 'HR_MANAGER'
            ? [
                  { name: '仪表盘', url: '/hr/dashboard', icon: <Home24Regular /> },
                  { name: '所有员工', url: '/hr/employees', icon: <People24Regular /> },
                  { name: '搜索员工', url: '/hr/search', icon: <Search24Regular /> },
                  { name: '部门管理', url: '/hr/departments', icon: <Organization24Regular /> },
                  { name: '工作地点', url: '/hr/places', icon: <Location24Regular /> },
                  { name: '员工历史', url: '/hr/employee-history', icon: <History24Regular /> },
                  { name: '薪资统计', url: '/hr/statistics', icon: <DataBarHorizontal24Regular /> },
              ]
            : []),
        { name: '退出登录', onClick: logout, icon: <SignOut24Regular /> },
    ];

    const handleNavClick = (item) => {
        if (item.url) {
            navigate(item.url);
        } else if (item.onClick) {
            item.onClick();
        }
    };

    return (
        <div
            className={`${styles.nav} ${
                isCollapsed ? styles.navCollapsed : styles.navExpanded
            }`}
        >
            <Button
                className={styles.toggleButton}
                icon={<Navigation24Regular/>}
                onClick={() => setIsCollapsed(!isCollapsed)}
                aria-label={isCollapsed ? '展开导航栏' : '收起导航栏'}
            />
            {!isCollapsed && <Text className={styles.header}>导航菜单</Text>}
            <Tree aria-label="导航">
                {navItems.map((item, index) => (
                    <TreeItem
                        key={index}
                        className={styles.treeItem}
                        onClick={() => handleNavClick(item)}
                    >
                        <span className={styles.treeItemIcon}>{item.icon}</span>
                        {!isCollapsed && (
                            <span className={styles.treeItemText}>{item.name}</span>
                        )}
                    </TreeItem>
                ))}
            </Tree>
            {!isCollapsed && (
                <div className={styles.footer}>
                    <Text>© 2025 鲲鹏聚数</Text>
                </div>
            )}
        </div>
    );
};