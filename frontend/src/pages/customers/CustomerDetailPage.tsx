import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Descriptions, Card, Timeline, Button, Spin, Tag, message, Input, Form } from 'antd';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import { customerService } from '../../services/customerService';
import { Customer, CustomerStatus } from '../../types';
import dayjs from 'dayjs';

export const CustomerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [submittingNote, setSubmittingNote] = useState(false);
  const [form] = Form.useForm();

  const fetchCustomer = async () => {
    try {
      const response = await customerService.getById(Number(id));
      setCustomer(response.data);
    } catch (error) {
      message.error('Failed to load customer details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  const handleAddNote = async (values: { note: string }) => {
    setSubmittingNote(true);
    try {
      await customerService.addNote(Number(id), values.note);
      message.success('Note added successfully');
      form.resetFields();
      fetchCustomer();
    } catch (error) {
      message.error('Failed to add note');
    } finally {
      setSubmittingNote(false);
    }
  };

  if (loading || !customer) {
    return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <Space>
          <Link to="/customers"><Button icon={<ArrowLeftOutlined />}>Back</Button></Link>
          <h2>Customer Details</h2>
        </Space>
        <Link to={`/customers/${id}/edit`}>
          <Button type="primary" icon={<EditOutlined />}>Edit Customer</Button>
        </Link>
      </div>

      <Card style={{ marginBottom: 24 }}>
        <Descriptions bordered column={{ xxl: 3, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }}>
          <Descriptions.Item label="Name">{customer.name}</Descriptions.Item>
          <Descriptions.Item label="Business Name">{customer.businessName}</Descriptions.Item>
          <Descriptions.Item label="Mobile">{customer.mobile}</Descriptions.Item>
          <Descriptions.Item label="Email">{customer.email || '-'}</Descriptions.Item>
          <Descriptions.Item label="GST Number">{customer.gstNumber || '-'}</Descriptions.Item>
          <Descriptions.Item label="Type"><Tag color="blue">{customer.customerType}</Tag></Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={customer.status === CustomerStatus.ACTIVE ? 'green' : customer.status === CustomerStatus.LEAD ? 'gold' : 'red'}>
              {customer.status}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Follow-up Date">{customer.followUpDate ? dayjs(customer.followUpDate).format('DD MMM YYYY') : '-'}</Descriptions.Item>
          <Descriptions.Item label="Address" span={3}>{customer.address}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Follow-up Notes">
        <Form form={form} onFinish={handleAddNote} layout="inline" style={{ marginBottom: 24 }}>
          <Form.Item name="note" rules={[{ required: true, message: 'Please enter a note' }]} style={{ flex: 1 }}>
            <Input.TextArea rows={2} placeholder="Add a new follow-up note..." />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submittingNote}>Add Note</Button>
          </Form.Item>
        </Form>

        {customer.followUpNotes && customer.followUpNotes.length > 0 ? (
          <Timeline
            items={customer.followUpNotes.map(note => ({
              children: (
                <>
                  <div style={{ fontWeight: 'bold' }}>{dayjs(note.createdAt).format('DD MMM YYYY HH:mm')} - {note.createdBy?.name || 'User'}</div>
                  <div>{note.note}</div>
                </>
              ),
            }))}
          />
        ) : (
          <p>No follow-up notes yet.</p>
        )}
      </Card>
    </div>
  );
};

// Add Space to imports dynamically here
import { Space } from 'antd';
