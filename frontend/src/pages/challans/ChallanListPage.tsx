import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, message, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { challanService } from '../../services/challanService';
import { Challan, ChallanStatus } from '../../types';
import dayjs from 'dayjs';

const { Option } = Select;

export const ChallanListPage: React.FC = () => {
  const [data, setData] = useState<Challan[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState<ChallanStatus | undefined>(undefined);

  const fetchChallans = async () => {
    setLoading(true);
    try {
      const response = await challanService.getAll({ page, limit, status });
      setData(response.data);
      setTotal(response.pagination.total);
    } catch (error) {
      message.error('Failed to load challans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallans();
  }, [page, limit, status]);

  const columns = [
    { title: 'Challan #', dataIndex: 'challanNumber', key: 'challanNumber', render: (val: string) => <b>{val}</b> },
    { title: 'Date', dataIndex: 'createdAt', key: 'createdAt', render: (val: string) => dayjs(val).format('DD MMM YYYY HH:mm') },
    { title: 'Customer', key: 'customer', render: (_: any, record: Challan) => record.customer?.name || '-' },
    { title: 'Total Qty', dataIndex: 'totalQuantity', key: 'totalQuantity' },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (val: string) => {
        let color = 'blue';
        if (val === ChallanStatus.CONFIRMED) color = 'green';
        if (val === ChallanStatus.CANCELLED) color = 'red';
        return <Tag color={color}>{val}</Tag>;
      }
    },
    { title: 'Created By', key: 'createdBy', render: (_: any, record: Challan) => record.createdBy?.name || '-' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Challan) => (
        <Space>
          <Link to={`/challans/${record.id}`}><Button type="link" size="small">View</Button></Link>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>Sales Challans</h2>
        <Link to="/challans/new">
          <Button type="primary" icon={<PlusOutlined />}>Create Challan</Button>
        </Link>
      </div>

      <Space style={{ marginBottom: 16 }}>
        <Select 
          placeholder="Filter by Status" 
          style={{ width: 200 }} 
          allowClear 
          onChange={(val) => setStatus(val)}
        >
          {Object.values(ChallanStatus).map(s => <Option key={s} value={s}>{s}</Option>)}
        </Select>
      </Space>

      <Table 
        columns={columns} 
        dataSource={data} 
        rowKey="id"
        loading={loading}
        pagination={{
          current: page,
          pageSize: limit,
          total: total,
          onChange: (p, s) => { setPage(p); setLimit(s); }
        }}
      />
    </div>
  );
};
