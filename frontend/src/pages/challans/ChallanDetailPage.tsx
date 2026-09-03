import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Table, Tag, Button, Space, Modal, message, Spin } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { challanService } from '../../services/challanService';
import type { Challan, ChallanItem } from '../../types';
import { ChallanStatus } from '../../types';
import dayjs from 'dayjs';

export const ChallanDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [challan, setChallan] = useState<Challan | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchChallan = async () => {
    setLoading(true);
    try {
      const res = await challanService.getById(Number(id));
      setChallan(res.data);
    } catch {
      message.error('Failed to load challan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallan();
  }, [id]);

  const handleConfirm = () => {
    Modal.confirm({
      title: 'Confirm Challan',
      icon: <ExclamationCircleOutlined />,
      content: 'This will deduct stock for all items. Are you sure you want to confirm this challan?',
      okText: 'Confirm',
      okType: 'primary',
      onOk: async () => {
        setActionLoading(true);
        try {
          await challanService.confirm(Number(id));
          message.success('Challan confirmed successfully');
          fetchChallan();
        } catch (error: any) {
          const msg = error.response?.data?.message || 'Failed to confirm challan';
          message.error(msg);
        } finally {
          setActionLoading(false);
        }
      },
    });
  };

  const handleCancel = () => {
    Modal.confirm({
      title: 'Cancel Challan',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to cancel this challan?',
      okText: 'Cancel Challan',
      okType: 'danger',
      onOk: async () => {
        setActionLoading(true);
        try {
          await challanService.cancel(Number(id));
          message.success('Challan cancelled');
          fetchChallan();
        } catch (error: any) {
          const msg = error.response?.data?.message || 'Failed to cancel challan';
          message.error(msg);
        } finally {
          setActionLoading(false);
        }
      },
    });
  };

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
  if (!challan) return <div>Challan not found</div>;

  const statusColor = challan.status === ChallanStatus.CONFIRMED ? 'green' : challan.status === ChallanStatus.DRAFT ? 'blue' : 'red';

  const columns = [
    { title: 'Product Name', dataIndex: 'productName', key: 'productName' },
    { title: 'SKU', dataIndex: 'productSku', key: 'productSku' },
    { title: 'Category', dataIndex: 'productCategory', key: 'productCategory' },
    {
      title: 'Unit Price',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (val: number) => '\u20B9' + Number(val).toFixed(2),
    },
    { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
    {
      title: 'Subtotal',
      key: 'subtotal',
      render: (_: any, record: ChallanItem) => '\u20B9' + (Number(record.unitPrice) * record.quantity).toFixed(2),
    },
  ];

  const totalAmount = (challan.items || []).reduce((sum, item) => sum + Number(item.unitPrice) * item.quantity, 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>Challan: {challan.challanNumber}</h2>
        <Space>
          {challan.status === ChallanStatus.DRAFT && (
            <>
              <Button type="primary" onClick={handleConfirm} loading={actionLoading}>
                Confirm Challan
              </Button>
              <Button danger onClick={handleCancel} loading={actionLoading}>
                Cancel Challan
              </Button>
            </>
          )}
          <Button onClick={() => navigate('/challans')}>Back</Button>
        </Space>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="Challan Number">{challan.challanNumber}</Descriptions.Item>
          <Descriptions.Item label="Status"><Tag color={statusColor}>{challan.status}</Tag></Descriptions.Item>
          <Descriptions.Item label="Customer">{challan.customer?.name} ({challan.customer?.businessName})</Descriptions.Item>
          <Descriptions.Item label="Total Quantity">{challan.totalQuantity}</Descriptions.Item>
          <Descriptions.Item label="Created By">{challan.createdBy?.name}</Descriptions.Item>
          <Descriptions.Item label="Created Date">{dayjs(challan.createdAt).format('DD MMM YYYY, hh:mm A')}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Items">
        <Table
          columns={columns}
          dataSource={challan.items || []}
          rowKey="id"
          pagination={false}
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={4}><strong>Total</strong></Table.Summary.Cell>
              <Table.Summary.Cell index={4}><strong>{challan.totalQuantity}</strong></Table.Summary.Cell>
              <Table.Summary.Cell index={5}><strong>{'\u20B9' + totalAmount.toFixed(2)}</strong></Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />
      </Card>
    </div>
  );
};
