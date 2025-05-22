import './App.css';

import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import {AuthProvider} from './contexts/AuthContext';
import {ProtectedRoute} from './components/ProtectedRoute';

// 登录和错误页面
import {Login} from './pages/Login';
import {Unauthorized} from './pages/Unauthorized';

// 员工页面
import {EmployeeDashboard} from './pages/employee/Dashboard';
import {EmployeeProfile} from './pages/employee/Profile';

// 部门经理页面
import {ManagerDashboard} from './pages/manager/Dashboard';
import {ManagerEmployees} from './pages/manager/Employees';
import {ManagerEmployeeSearch} from './pages/manager/EmployeeSearch';
import {ManagerSalaryStatistics} from './pages/manager/SalaryStatistics';

// 人事经理页面
import {HRDashboard} from './pages/hr/Dashboard';
import {HREmployees} from './pages/hr/Employees';
import {HREmployeeSearch} from './pages/hr/EmployeeSearch';
import {HRDepartments} from './pages/hr/Departments';
import {HRPlaces} from './pages/hr/Places';
import {HRSalaryStatistics} from './pages/hr/SalaryStatistics';
import {HREmployeeHistory} from './pages/hr/EmployeeHistory';

import {FluentProvider, webLightTheme} from '@fluentui/react-components';

function App() {
    return (
        <FluentProvider theme={webLightTheme}>
            {/* 添加 Mica 背景容器 */}
            <div className="mica-background">
                <Router>
                    <AuthProvider>
                        <Routes>
                            {/* 公共路由 */}
                            <Route path="/login" element={<Login/>}/>
                            <Route path="/unauthorized" element={<Unauthorized/>}/>

                            {/* 员工路由 */}
                            <Route
                                path="/employee/dashboard"
                                element={
                                    <ProtectedRoute requiredRole="EMPLOYEE">
                                        <EmployeeDashboard/>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/employee/profile"
                                element={
                                    <ProtectedRoute requiredRole="EMPLOYEE">
                                        <EmployeeProfile/>
                                    </ProtectedRoute>
                                }
                            />

                            {/* 部门经理路由 */}
                            <Route
                                path="/manager/dashboard"
                                element={
                                    <ProtectedRoute requiredRole="DEPARTMENT_MANAGER">
                                        <ManagerDashboard/>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/manager/employees"
                                element={
                                    <ProtectedRoute requiredRole="DEPARTMENT_MANAGER">
                                        <ManagerEmployees/>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/manager/search"
                                element={
                                    <ProtectedRoute requiredRole="DEPARTMENT_MANAGER">
                                        <ManagerEmployeeSearch/>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/manager/statistics"
                                element={
                                    <ProtectedRoute requiredRole="DEPARTMENT_MANAGER">
                                        <ManagerSalaryStatistics/>
                                    </ProtectedRoute>
                                }
                            />

                            {/* 人事经理路由 */}
                            <Route
                                path="/hr/dashboard"
                                element={
                                    <ProtectedRoute requiredRole="HR_MANAGER">
                                        <HRDashboard/>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/hr/employees"
                                element={
                                    <ProtectedRoute requiredRole="HR_MANAGER">
                                        <HREmployees/>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/hr/search"
                                element={
                                    <ProtectedRoute requiredRole="HR_MANAGER">
                                        <HREmployeeSearch/>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/hr/departments"
                                element={
                                    <ProtectedRoute requiredRole="HR_MANAGER">
                                        <HRDepartments/>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/hr/places"
                                element={
                                    <ProtectedRoute requiredRole="HR_MANAGER">
                                        <HRPlaces/>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/hr/statistics"
                                element={
                                    <ProtectedRoute requiredRole="HR_MANAGER">
                                        <HRSalaryStatistics/>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/hr/employee-history"
                                element={
                                    <ProtectedRoute requiredRole="HR_MANAGER">
                                        <HREmployeeHistory/>
                                    </ProtectedRoute>
                                }
                            />

                            {/* 默认路由 */}
                            <Route path="/" element={<Navigate to="/login"/>}/>
                        </Routes>
                    </AuthProvider>
                </Router>
            </div>
        </FluentProvider>
    );
}

export default App;