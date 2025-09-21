import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import DashboardPage from './pages/DashboardPage';
import CasesPage from './pages/CasesPage';
import CaseDetailPage from './pages/CaseDetailPage';
import UsersPage from './pages/UsersPage';
import AnalysisPage from './pages/AnalysisPage';
import FileSystemAnalysisPage from './pages/FileSystemAnalysisPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UserRole } from './types';
import HostsPage from './pages/HostsPage';
import RegistryAnalysisPage from './pages/RegistryAnalysisPage';

const AppContent: React.FC = () => {
    const { user } = useAuth();
    const isAuthenticated = !!user;

    return (
        <Routes>
            <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" replace />} />
            <Route path="/*" element={isAuthenticated ? 
                <MainLayout>
                    <Routes>
                        <Route path="/" element={<DashboardPage />} />
                        <Route path="/cases" element={<CasesPage />} />
                        <Route path="/cases/:caseId" element={<CaseDetailPage />} />
                        
                        {user?.role === UserRole.ADMIN && (
                            <Route path="/users" element={<UsersPage />} />
                        )}
                        
                        {(user?.role === UserRole.ADMIN || user?.role === UserRole.INVESTIGATOR || user?.role === UserRole.ANALYST) && (
                           <>
                             <Route path="/analysis" element={<AnalysisPage />} />
                             <Route path="/analysis/file-system" element={<FileSystemAnalysisPage />} />
                             <Route path="/analysis/registry" element={<RegistryAnalysisPage />} />
                           </>
                        )}

                        {(user?.role === UserRole.ADMIN || user?.role === UserRole.INVESTIGATOR) && (
                            <Route path="/hosts" element={<HostsPage />} />
                        )}

                        {user?.role === UserRole.ADMIN && (
                           <Route path="/settings" element={<SettingsPage />} />
                        )}

                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </MainLayout>
             : <Navigate to="/login" replace />} />
        </Routes>
    );
};


const App: React.FC = () => {
  return (
    <AuthProvider>
        <AppContent />
    </AuthProvider>
  );
};

export default App;