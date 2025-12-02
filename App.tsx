import React, { PropsWithChildren } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ClassDetails from './pages/ClassDetails';
import Leadership from './pages/Leadership';
import Login from './pages/Login';
import Settings from './pages/Settings';
import { isAuthenticated } from './services/authService';

const ProtectedRoute: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes wrapped in Layout */}
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/turmas/:id" element={<ClassDetails />} />
                  <Route path="/lideranca" element={<Leadership />} />
                  <Route path="/configuracoes" element={<Settings />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </HashRouter>
  );
}

export default App;