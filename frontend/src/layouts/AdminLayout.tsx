import React, { useState } from 'react';
import { Layout, Menu, Button, Badge } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Role } from '../types';
import {
  DashboardOutlined,
  UserOutlined,
  ShoppingOutlined,
  DatabaseOutlined,
  FileTextOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

export const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    (hasRole([Role.ADMIN, Role.SALES]) && {
      key: '/customers',
      icon: <UserOutlined />,
      label: 'Customers',
    }),
    {
      key: '/products',
      icon: <ShoppingOutlined />,
      label: 'Products',
    },
    (hasRole([Role.ADMIN, Role.WAREHOUSE]) && {
      key: '/inventory',
      icon: <DatabaseOutlined />,
      label: 'Inventory',
    }),
    (hasRole([Role.ADMIN, Role.SALES, Role.ACCOUNTS]) && {
      key: '/challans',
      icon: <FileTextOutlined />,
      label: 'Sales Challans',
    }),
  ].filter(Boolean) as any;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} breakpoint="lg">
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: collapsed ? '12px' : '16px', overflow: 'hidden', whiteSpace: 'nowrap' }}>
          {collapsed ? 'ERP' : 'Mini ERP + CRM'}
        </div>
        <Menu
          theme="dark"
          selectedKeys={[location.pathname.split('/')[1] ? `/${location.pathname.split('/')[1]}` : '/']}
          mode="inline"
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: '0 16px', background: '#fff', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span>
              Welcome, <b>{user?.name}</b> <Badge count={user?.role} style={{ backgroundColor: '#1677ff', marginLeft: 8 }} />
            </span>
            <Button type="text" icon={<LogoutOutlined />} onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </Header>
        <Content style={{ margin: '16px' }}>
          <div style={{ padding: 24, minHeight: 360, background: '#fff', borderRadius: 8 }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
