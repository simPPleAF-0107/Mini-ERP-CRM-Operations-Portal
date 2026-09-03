import React, { useEffect, useState } from 'react';
import { Table, Button, Input, Space, Tag, message, Tooltip } from 'antd';
import { PlusOutlined, SearchOutlined, WarningOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import { Product, Role } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

export const ProductListPage: React.FC = () => {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  
  const { hasRole } = useAuth();
  const canEdit = hasRole([Role.ADMIN, Role.WAREHOUSE]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productService.getAll({ page, limit, search });
      setData(response.data);
      setTotal(response.pagination.total);
    } catch (error) {
      message.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, limit, search]);

  const columns = [
    { title: 'SKU', dataIndex: 'sku', key: 'sku', render: (val: string) => <b>{val}</b> },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Unit Price', dataIndex: 'unitPrice', key: 'unitPrice', render: (val: number) => `₹${val.toFixed(2)}` },
    { 
      title: 'Current Stock', 
      key: 'currentStock', 
      render: (_: any, record: Product) => {
        const isLow = record.currentStock <= record.minStockAlert;
        return (
          <Space>
            <span style={{ color: isLow ? 'red' : 'inherit', fontWeight: isLow ? 'bold' : 'normal' }}>
              {record.currentStock}
            </span>
            {isLow && (
              <Tooltip title={`Low stock! Min alert is ${record.minStockAlert}`}>
                <WarningOutlined style={{ color: 'red' }} />
              </Tooltip>
            )}
          </Space>
        );
      }
    },
    { title: 'Location', dataIndex: 'location', key: 'location' },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (val: boolean) => <Tag color={val ? 'green' : 'red'}>{val ? 'Active' : 'Inactive'}</Tag>
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Product) => (
        <Space>
          <Link to={`/products/${record.id}`}><Button type="link" size="small">View</Button></Link>
          {canEdit && <Link to={`/products/${record.id}/edit`}><Button type="link" size="small">Edit</Button></Link>}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>Products</h2>
        {canEdit && (
          <Link to="/products/new">
            <Button type="primary" icon={<PlusOutlined />}>Add Product</Button>
          </Link>
        )}
      </div>

      <Space style={{ marginBottom: 16 }}>
        <Input 
          placeholder="Search by name, SKU..." 
          prefix={<SearchOutlined />} 
          onPressEnter={(e) => setSearch((e.target as HTMLInputElement).value)}
          onBlur={(e) => setSearch(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
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
