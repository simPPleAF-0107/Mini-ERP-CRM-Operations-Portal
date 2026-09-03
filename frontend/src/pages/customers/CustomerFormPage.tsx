import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Button, DatePicker, message, Card, Space } from 'antd';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { customerService } from '../../services/customerService';
import { CustomerType, CustomerStatus } from '../../types';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

export const CustomerFormPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  useEffect(() => {
    if (isEdit) {
      setInitialLoading(true);
      customerService.getById(Number(id))
        .then(response => {
          const data = response.data;
          form.setFieldsValue({
            ...data,
            followUpDate: data.followUpDate ? dayjs(data.followUpDate) : undefined,
          });
        })
        .catch(() => message.error('Failed to load customer'))
        .finally(() => setInitialLoading(false));
    }
  }, [id, isEdit, form]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        followUpDate: values.followUpDate ? values.followUpDate.toISOString() : undefined,
      };

      if (isEdit) {
        await customerService.update(Number(id), payload);
        message.success('Customer updated successfully');
      } else {
        await customerService.create(payload);
        message.success('Customer created successfully');
      }
      navigate('/customers');
    } catch (error) {
      message.error(`Failed to ${isEdit ? 'update' : 'create'} customer`);
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
        <Link to="/customers"><Button icon={<ArrowLeftOutlined />}>Back</Button></Link>
        <h2 style={{ margin: 0 }}>{isEdit ? 'Edit Customer' : 'Add New Customer'}</h2>
      </div>

      <Card>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Contact Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          
          <Form.Item name="businessName" label="Business Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Space style={{ display: 'flex', marginBottom: 8 }} align="baseline">
            <Form.Item name="mobile" label="Mobile Number" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="email" label="Email Address" rules={[{ type: 'email' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="gstNumber" label="GST Number">
              <Input />
            </Form.Item>
          </Space>

          <Space style={{ display: 'flex', marginBottom: 8 }} align="baseline">
            <Form.Item name="customerType" label="Customer Type" rules={[{ required: true }]} initialValue={CustomerType.RETAIL}>
              <Select style={{ width: 200 }}>
                {Object.values(CustomerType).map(t => <Option key={t} value={t}>{t}</Option>)}
              </Select>
            </Form.Item>
            
            <Form.Item name="status" label="Status" rules={[{ required: true }]} initialValue={CustomerStatus.LEAD}>
              <Select style={{ width: 200 }}>
                {Object.values(CustomerStatus).map(s => <Option key={s} value={s}>{s}</Option>)}
              </Select>
            </Form.Item>

            <Form.Item name="followUpDate" label="Follow-up Date">
              <DatePicker style={{ width: 200 }} />
            </Form.Item>
          </Space>

          <Form.Item name="address" label="Address" rules={[{ required: true }]}>
            <TextArea rows={3} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {isEdit ? 'Update Customer' : 'Create Customer'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
