import React, { useEffect, useState } from 'react';
import { Table, Button, Input, Select, Space, Tag, message } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { customerService } from '../../services/customerService';
import { Customer, CustomerStatus, CustomerType } from '../../types';
import dayjs from 'dayjs';

const { Option } = Select;

export const CustomerListPage: React.FC = () => {
  const [data, setData] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<CustomerStatus | undefined>(undefined);
  const [type, setType] = useState<CustomerType | undefined>(undefined);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await customerService.getAll({ page, limit, search, status, customerType: type });
      setData(response.data);
      setTotal(response.pagination.total);
    } catch (error) {
      message.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, limit, search, status, type]);

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Business Name', dataIndex: 'businessName', key: 'businessName' },
    { title: 'Mobile', dataIndex: 'mobile', key: 'mobile' },
    { 
      title: 'Type', 
      dataIndex: 'customerType', 
      key: 'type',
      render: (val: string) => <Tag color="blue">{val}</Tag>
    },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (val: string) => {
        const color = val === CustomerStatus.ACTIVE ? 'green' : val === CustomerStatus.LEAD ? 'gold' : 'red';
        return <Tag color={color}>{val}</Tag>;
      }
    },
    { 
      title: 'Follow-up Date', 
      dataIndex: 'followUpDate', 
      key: 'followUpDate',
      render: (val: string) => val ? dayjs(val).format('DD MMM YYYY') : '-'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Customer) => (
        <Space>
          <Link to={`/customers/${record.id}`}><Button type="link" size="small">View</Button></Link>
          <Link to={`/customers/${record.id}/edit`}><Button type="link" size="small">Edit</Button></Link>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>Customers</h2>
        <Link to="/customers/new">
          <Button type="primary" icon={<PlusOutlined />}>Add Customer</Button>
        </Link>
      </div>

      <Space style={{ marginBottom: 16 }} wrap>
        <Input 
          placeholder="Search name, mobile, business..." 
          prefix={<SearchOutlined />} 
          onPressEnter={(e) => setSearch((e.target as HTMLInputElement).value)}
          onBlur={(e) => setSearch(e.target.value)}
          style={{ width: 250 }}
          allowClear
        />
        <Select 
          placeholder="Status" 
          style={{ width: 120 }} 
          allowClear 
          onChange={(val) => setStatus(val)}
        >
          {Object.values(CustomerStatus).map(s => <Option key={s} value={s}>{s}</Option>)}
        </Select>
        <Select 
          placeholder="Type" 
          style={{ width: 120 }} 
          allowClear 
          onChange={(val) => setType(val)}
        >
          {Object.values(CustomerType).map(t => <Option key={t} value={t}>{t}</Option>)}
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
