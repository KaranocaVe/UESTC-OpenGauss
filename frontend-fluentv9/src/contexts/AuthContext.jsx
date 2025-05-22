import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin } from '../api/authService.js';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // 检查本地存储，恢复用户会话
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (staffId, password) => {
        try {
            const userData = await apiLogin(staffId, password);
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));

            // 根据角色导航到不同的首页
            if (userData.role === 'EMPLOYEE') {
                navigate('/employee/dashboard');
            } else if (userData.role === 'DEPARTMENT_MANAGER') {
                navigate('/manager/dashboard');
            } else if (userData.role === 'HR_MANAGER') {
                navigate('/hr/dashboard');
            }

            return userData;
        } catch (error) {
            console.error('登陆失败:', error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        navigate('/login');
    };

    const value = {
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};