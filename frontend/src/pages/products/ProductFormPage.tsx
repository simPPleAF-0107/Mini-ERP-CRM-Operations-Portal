import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Button, Switch, Card, Space, message } from 'antd';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { productService } from '../../services/productService';

export const ProductFormPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  useEffect(() => {
    if (isEdit) {
      setInitialLoading(true);
      productService.getById(Number(id))
        .then(response => {
          form.setFieldsValue(response.data);
        })
        .catch(() => message.error('Failed to load product'))
        .finally(() => setInitialLoading(false));
    }
  }, [id, isEdit, form]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      if (isEdit) {
        await productService.update(Number(id), values);
        message.success('Product updated successfully');
      } else {
        await productService.create(values);
        message.success('Product created successfully');
      }
      navigate('/products');
    } catch (error) {
      message.error(`Failed to ${isEdit ? 'update' : 'create'} product`);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <Card loading={true} />;
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, gap: 16 }}>
        <Link to="/products"><Button icon={<ArrowLeftOutlined />}>Back</Button></Link>
        <h2 style={{ margin: 0 }}>{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
      </div>

      <Card style={{ maxWidth: 800 }}>
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={onFinish}
          initialValues={{ isActive: true, currentStock: 0, minStockAlert: 10 }}
        >
          <Space style={{ display: 'flex', marginBottom: 8 }} align="baseline">
            <Form.Item name="name" label="Product Name" rules={[{ required: true }]} style={{ width: 400 }}>
              <Input />
            </Form.Item>
            <Form.Item name="sku" label="SKU" rules={[{ required: true }]} style={{ width: 300 }}>
              <Input disabled={isEdit} />
            </Form.Item>
          </Space>

          <Space style={{ display: 'flex', marginBottom: 8 }} align="baseline">
            <Form.Item name="category" label="Category" rules={[{ required: true }]} style={{ width: 250 }}>
              <Input />
            </Form.Item>
            <Form.Item name="unitPrice" label="Unit Price (₹)" rules={[{ required: true }]}>
              <InputNumber style={{ width: 150 }} min={0} step={0.01} />
            </Form.Item>
          </Space>

          <Space style={{ display: 'flex', marginBottom: 8 }} align="baseline">
            <Form.Item name="currentStock" label="Initial Stock" rules={[{ required: true }]}>
              <InputNumber style={{ width: 150 }} min={0} disabled={isEdit} />
            </Form.Item>
            <Form.Item name="minStockAlert" label="Min Stock Alert" rules={[{ required: true }]}>
              <InputNumber style={{ width: 150 }} min={0} />
            </Form.Item>
            <Form.Item name="location" label="Warehouse Location" style={{ width: 250 }}>
              <Input />
            </Form.Item>
          </Space>

          <Form.Item name="isActive" label="Is Active?" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {isEdit ? 'Update Product' : 'Create Product'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
