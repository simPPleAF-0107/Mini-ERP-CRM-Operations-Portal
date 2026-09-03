import React, { useState, useEffect } from 'react';
import { Form, Select, InputNumber, Button, Card, Table, Space, message, Spin } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { challanService } from '../../services/challanService';
import { customerService } from '../../services/customerService';
import { productService } from '../../services/productService';
import type { Customer, Product } from '../../types';

interface ChallanItemRow {
  key: number;
  productId: number | null;
  quantity: number;
  productName?: string;
  unitPrice?: number;
  currentStock?: number;
}

export const CreateChallanPage: React.FC = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [items, setItems] = useState<ChallanItemRow[]>([{ key: 1, productId: null, quantity: 1 }]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  let nextKey = 2;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [custRes, prodRes] = await Promise.all([
          customerService.getAll({ limit: 100 }),
          productService.getAll({ limit: 100 }),
        ]);
        setCustomers(custRes.data);
        setProducts(prodRes.data);
      } catch {
        message.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const addItem = () => {
    setItems([...items, { key: Date.now(), productId: null, quantity: 1 }]);
  };

  const removeItem = (key: number) => {
    if (items.length <= 1) {
      message.warning('At least one item is required');
      return;
    }
    setItems(items.filter(item => item.key !== key));
  };

  const updateItem = (key: number, field: string, value: any) => {
    setItems(items.map(item => {
      if (item.key !== key) return item;
      const updated = { ...item, [field]: value };
      if (field === 'productId') {
        const product = products.find(p => p.id === value);
        if (product) {
          updated.productName = product.name;
          updated.unitPrice = Number(product.unitPrice);
          updated.currentStock = product.currentStock;
        }
      }
      return updated;
    }));
  };

  const totalQuantity = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalAmount = items.reduce((sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0), 0);

  const handleSubmit = async () => {
    if (!customerId) {
      message.error('Please select a customer');
      return;
    }
    const validItems = items.filter(item => item.productId && item.quantity > 0);
    if (validItems.length === 0) {
      message.error('Add at least one product with quantity');
      return;
    }

    setSubmitting(true);
    try {
      await challanService.create({
        customerId,
        items: validItems.map(item => ({
          productId: item.productId!,
          quantity: item.quantity,
        })),
      });
      message.success('Challan created as Draft');
      navigate('/challans');
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to create challan';
      message.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;

  const columns = [
    {
      title: 'Product',
      key: 'product',
      width: '35%',
      render: (_: any, record: ChallanItemRow) => (
        <Select
          showSearch
          style={{ width: '100%' }}
          placeholder="Select product"
          value={record.productId}
          onChange={(val) => updateItem(record.key, 'productId', val)}
          filterOption={(input, option) =>
            (option?.label as string || '').toLowerCase().includes(input.toLowerCase())
          }
          options={products.map(p => ({ value: p.id, label: p.name + ' (' + p.sku + ')' }))}
        />
      ),
    },
    {
      title: 'Available Stock',
      key: 'stock',
      width: '12%',
      render: (_: any, record: ChallanItemRow) => (
        <span style={{ color: record.currentStock !== undefined && record.currentStock < (record.quantity || 0) ? 'red' : 'green' }}>
          {record.currentStock !== undefined ? record.currentStock : '-'}
        </span>
      ),
    },
    {
      title: 'Quantity',
      key: 'quantity',
      width: '12%',
      render: (_: any, record: ChallanItemRow) => (
        <InputNumber
          min={1}
          value={record.quantity}
          onChange={(val) => updateItem(record.key, 'quantity', val || 1)}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: 'Unit Price',
      key: 'unitPrice',
      width: '15%',
      render: (_: any, record: ChallanItemRow) => (
        record.unitPrice ? '\u20B9' + record.unitPrice.toFixed(2) : '-'
      ),
    },
    {
      title: 'Subtotal',
      key: 'subtotal',
      width: '15%',
      render: (_: any, record: ChallanItemRow) => (
        record.unitPrice ? '\u20B9' + (record.unitPrice * record.quantity).toFixed(2) : '-'
      ),
    },
    {
      title: '',
      key: 'action',
      width: '8%',
      render: (_: any, record: ChallanItemRow) => (
        <Button danger icon={<DeleteOutlined />} onClick={() => removeItem(record.key)} size="small" />
      ),
    },
  ];

  return (
    <div>
      <h2>Create Sales Challan</h2>

      <Card style={{ marginBottom: 16 }}>
        <Form layout="vertical">
          <Form.Item label="Customer" required>
            <Select
              showSearch
              placeholder="Search and select customer"
              value={customerId}
              onChange={setCustomerId}
              filterOption={(input, option) =>
                (option?.label as string || '').toLowerCase().includes(input.toLowerCase())
              }
              options={customers.map(c => ({ value: c.id, label: c.name + ' - ' + c.businessName }))}
              style={{ maxWidth: 500 }}
            />
          </Form.Item>
        </Form>
      </Card>

      <Card title="Items" style={{ marginBottom: 16 }}>
        <Table
          columns={columns}
          dataSource={items}
          rowKey="key"
          pagination={false}
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}><strong>Total</strong></Table.Summary.Cell>
              <Table.Summary.Cell index={1}></Table.Summary.Cell>
              <Table.Summary.Cell index={2}><strong>{totalQuantity}</strong></Table.Summary.Cell>
              <Table.Summary.Cell index={3}></Table.Summary.Cell>
              <Table.Summary.Cell index={4}><strong>{'\u20B9' + totalAmount.toFixed(2)}</strong></Table.Summary.Cell>
              <Table.Summary.Cell index={5}></Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />
        <Button type="dashed" onClick={addItem} icon={<PlusOutlined />} style={{ marginTop: 16, width: '100%' }}>
          Add Item
        </Button>
      </Card>

      <Space>
        <Button type="primary" size="large" onClick={handleSubmit} loading={submitting}>
          Save as Draft
        </Button>
        <Button size="large" onClick={() => navigate('/challans')}>
          Cancel
        </Button>
      </Space>
    </div>
  );
};
