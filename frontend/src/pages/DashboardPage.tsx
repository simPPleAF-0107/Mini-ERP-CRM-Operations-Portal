import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Table, Spin, Tag } from 'antd';
import { dashboardService } from '../services/dashboardService';
import { DashboardStats } from '../types';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await dashboardService.getStats();
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading || !stats) {
    return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
  }

  const alertColumns = [
    { title: 'Product', dataIndex: 'name', key: 'name' },
    { title: 'SKU', dataIndex: 'sku', key: 'sku' },
    { title: 'Stock', dataIndex: 'currentStock', key: 'currentStock', render: (val: number) => <span style={{ color: 'red', fontWeight: 'bold' }}>{val}</span> },
    { title: 'Min Alert', dataIndex: 'minStockAlert', key: 'minStockAlert' },
  ];

  const followUpColumns = [
    { title: 'Customer', dataIndex: 'name', key: 'name' },
    { title: 'Mobile', dataIndex: 'mobile', key: 'mobile' },
    { title: 'Date', dataIndex: 'followUpDate', key: 'followUpDate', render: (val: string) => dayjs(val).format('DD MMM YYYY') },
    { title: 'Action', key: 'action', render: (_: any, record: any) => <Link to={`/customers/${record.id}`}>View</Link> },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>Dashboard</h2>
      
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8}>
          <Card bordered={false}>
            <Statistic title="Total Customers" value={stats.totalCustomers} valueStyle={{ color: '#1677ff' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card bordered={false}>
            <Statistic title="Active Customers" value={stats.activeCustomers} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card bordered={false}>
            <Statistic title="Leads" value={stats.leadCustomers} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card bordered={false}>
            <Statistic title="Total Products" value={stats.totalProducts} valueStyle={{ color: '#1677ff' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card bordered={false}>
            <Statistic title="Low Stock Products" value={stats.lowStockProducts} valueStyle={{ color: '#cf1322' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card bordered={false}>
            <Statistic title="Total Challans" value={stats.totalChallans} valueStyle={{ color: '#1677ff' }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Low Stock Alerts" bordered={false} style={{ height: '100%' }}>
            <Table 
              dataSource={stats.lowStockAlerts} 
              columns={alertColumns} 
              rowKey="id" 
              pagination={false} 
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Upcoming Follow-ups" bordered={false} style={{ height: '100%' }}>
            <Table 
              dataSource={stats.upcomingFollowUps} 
              columns={followUpColumns} 
              rowKey="id" 
              pagination={false} 
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
