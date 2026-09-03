import React, { useState, useEffect } from 'react';
import { Form, Select, InputNumber, Radio, Input, Button, Card, message, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { inventoryService } from '../../services/inventoryService';
import { productService } from '../../services/productService';
import type { Product } from '../../types';
import { MovementType } from '../../types';

const { TextArea } = Input;

export const RecordMovementPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await productService.getAll({ limit: 100 });
        setProducts(res.data);
      } catch {
        message.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleProductChange = (productId: number) => {
    const product = products.find(p => p.id === productId) || null;
    setSelectedProduct(product);
  };

  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      await inventoryService.createMovement(values);
      message.success('Stock movement recorded successfully');
      navigate('/inventory');
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to record movement';
      message.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;

  return (
    <div>
      <h2>Record Stock Movement</h2>
      <Card style={{ maxWidth: 600 }}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="productId" label="Product" rules={[{ required: true, message: 'Select a product' }]}>
            <Select
              showSearch
              placeholder="Search and select product"
              onChange={handleProductChange}
              filterOption={(input, option) =>
                (option?.label as string || '').toLowerCase().includes(input.toLowerCase())
              }
              options={products.map(p => ({ value: p.id, label: p.name + ' (' + p.sku + ')' }))}
            />
          </Form.Item>

          {selectedProduct && (
            <div style={{ marginBottom: 16, padding: 12, background: '#f5f5f5', borderRadius: 6 }}>
              <strong>Current Stock:</strong> {selectedProduct.currentStock} &nbsp;|&nbsp;
              <strong>Min Alert:</strong> {selectedProduct.minStockAlert} &nbsp;|&nbsp;
              <strong>Location:</strong> {selectedProduct.location}
            </div>
          )}

          <Form.Item name="movementType" label="Movement Type" rules={[{ required: true }]}>
            <Radio.Group>
              <Radio.Button value={MovementType.IN} style={{ color: 'green' }}>IN (Stock In)</Radio.Button>
              <Radio.Button value={MovementType.OUT} style={{ color: 'red' }}>OUT (Stock Out)</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item name="quantity" label="Quantity" rules={[{ required: true, message: 'Enter quantity' }, { type: 'number', min: 1 }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="reason" label="Reason" rules={[{ required: true, message: 'Enter reason' }]}>
            <TextArea rows={3} placeholder="Reason for stock movement..." />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitting} style={{ marginRight: 8 }}>
              Record Movement
            </Button>
            <Button onClick={() => navigate('/inventory')}>Cancel</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
