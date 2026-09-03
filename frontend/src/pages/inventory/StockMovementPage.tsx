import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, message, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { inventoryService } from '../../services/inventoryService';
import { productService } from '../../services/productService';
import { StockMovement, MovementType, Product } from '../../types';
import dayjs from 'dayjs';

const { Option } = Select;

export const StockMovementPage: React.FC = () => {
  const [data, setData] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [type, setType] = useState<MovementType | undefined>(undefined);
  const [productId, setProductId] = useState<number | undefined>(undefined);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    productService.getAll({ limit: 1000 }).then(res => setProducts(res.data)).catch(() => {});
  }, []);

  const fetchMovements = async () => {
    setLoading(true);
    try {
      const response = await inventoryService.getMovements({ page, limit, movementType: type, productId });
      setData(response.data);
      setTotal(response.pagination.total);
    } catch (error) {
      message.error('Failed to load stock movements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovements();
  }, [page, limit, type, productId]);

  const columns = [
    { title: 'Date', dataIndex: 'createdAt', key: 'createdAt', render: (val: string) => dayjs(val).format('DD MMM YYYY HH:mm') },
    { title: 'Product', key: 'product', render: (_: any, record: StockMovement) => record.product?.name || `Product ID ${record.productId}` },
    { title: 'SKU', key: 'sku', render: (_: any, record: StockMovement) => record.product?.sku || '-' },
    { 
      title: 'Type', 
      dataIndex: 'movementType', 
      key: 'type',
      render: (val: string) => <Tag color={val === MovementType.IN ? 'green' : 'red'}>{val}</Tag>
    },
    { title: 'Quantity', dataIndex: 'quantity', key: 'quantity', render: (val: number, record: StockMovement) => {
        return <strong style={{ color: record.movementType === MovementType.IN ? 'green' : 'red' }}>
          {record.movementType === MovementType.IN ? '+' : '-'}{val}
        </strong>;
    }},
    { title: 'Reason', dataIndex: 'reason', key: 'reason' },
    { title: 'Recorded By', key: 'createdBy', render: (_: any, record: StockMovement) => record.createdBy?.name || '-' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>Stock Movements</h2>
        <Link to="/inventory/new">
          <Button type="primary" icon={<PlusOutlined />}>Record Movement</Button>
        </Link>
      </div>

      <Space style={{ marginBottom: 16 }} wrap>
        <Select 
          showSearch
          placeholder="Filter by Product" 
          style={{ width: 250 }} 
          allowClear 
          onChange={(val) => setProductId(val)}
          optionFilterProp="children"
        >
          {products.map(p => <Option key={p.id} value={p.id}>{p.name} ({p.sku})</Option>)}
        </Select>
        <Select 
          placeholder="Movement Type" 
          style={{ width: 150 }} 
          allowClear 
          onChange={(val) => setType(val)}
        >
          {Object.values(MovementType).map(t => <Option key={t} value={t}>{t}</Option>)}
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
