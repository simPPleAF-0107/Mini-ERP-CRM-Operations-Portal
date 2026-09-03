import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Descriptions, Card, Table, Button, Spin, Tag, message, Space } from 'antd';
import { ArrowLeftOutlined, EditOutlined, WarningOutlined } from '@ant-design/icons';
import { productService } from '../../services/productService';
import { Product, Role } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import dayjs from 'dayjs';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { hasRole } = useAuth();
  
  const canEdit = hasRole([Role.ADMIN, Role.WAREHOUSE]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productService.getById(Number(id));
        setProduct(response.data);
      } catch (error) {
        message.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading || !product) {
    return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
  }

  const isLowStock = product.currentStock <= product.minStockAlert;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <Space>
          <Link to="/products"><Button icon={<ArrowLeftOutlined />}>Back</Button></Link>
          <h2>Product Details: {product.name}</h2>
        </Space>
        {canEdit && (
          <Link to={`/products/${id}/edit`}>
            <Button type="primary" icon={<EditOutlined />}>Edit Product</Button>
          </Link>
        )}
      </div>

      <Card style={{ marginBottom: 24 }}>
        <Descriptions bordered column={{ xxl: 3, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }}>
          <Descriptions.Item label="SKU"><b>{product.sku}</b></Descriptions.Item>
          <Descriptions.Item label="Category">{product.category}</Descriptions.Item>
          <Descriptions.Item label="Unit Price">₹{product.unitPrice.toFixed(2)}</Descriptions.Item>
          <Descriptions.Item label="Current Stock">
            <span style={{ color: isLowStock ? 'red' : 'inherit', fontWeight: isLowStock ? 'bold' : 'normal', fontSize: 18 }}>
              {product.currentStock}
            </span>
            {isLowStock && <Tag color="red" style={{ marginLeft: 8 }} icon={<WarningOutlined />}>LOW STOCK</Tag>}
          </Descriptions.Item>
          <Descriptions.Item label="Min Stock Alert">{product.minStockAlert}</Descriptions.Item>
          <Descriptions.Item label="Location">{product.location || '-'}</Descriptions.Item>
          <Descriptions.Item label="Status"><Tag color={product.isActive ? 'green' : 'red'}>{product.isActive ? 'Active' : 'Inactive'}</Tag></Descriptions.Item>
          <Descriptions.Item label="Added On">{dayjs(product.createdAt).format('DD MMM YYYY')}</Descriptions.Item>
        </Descriptions>
      </Card>
      
      {/* If API had recent stock movements for this product, we'd list them here */}
      <Card title="Recent Movements">
        <p>To view full movement history, please go to the Inventory section and filter by this product.</p>
        <Link to="/inventory">
           <Button type="default">Go to Inventory</Button>
        </Link>
      </Card>
    </div>
  );
};
