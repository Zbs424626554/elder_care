import React, { useState } from 'react';
import {
  Typography,
  Form,
  Input,
  Upload,
  Button,
  Select,
  message,
  Steps,
  Space,
  Divider,
  Alert
} from 'antd';
import {
  UploadOutlined,
  UserOutlined,
  FileTextOutlined,
  TagsOutlined,
  GlobalOutlined,
  EditOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface CertificationForm {
  realName: string;
  idNumber: string;
  nursingCert: UploadFile[];
  healthCert: UploadFile[];
  skills: string[];
  serviceAreas: string[];
  selfIntroduction: string;
}

const Certification: React.FC = () => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // 技能选项
  const skillOptions = [
    '基础护理', '老年护理', '康复护理', '心理护理',
    '急救技能', '营养配餐', '用药指导', '伤口护理',
    '导尿护理', '鼻饲护理', '压疮护理', '糖尿病护理',
    '高血压护理', '心脏病护理', '中风护理', '痴呆症护理'
  ];

  // 服务范围选项
  const serviceAreaOptions = [
    '居家护理', '医院陪护', '康复中心', '养老院',
    '日间照料', '夜间陪护', '临时护理', '长期护理',
    '术后护理', '慢性病护理', '临终关怀', '健康咨询'
  ];

  const steps = [
    {
      title: '基本信息',
      icon: <UserOutlined />,
      content: (
        <div>
          <Form.Item
            name="realName"
            label="真实姓名"
            rules={[{ required: true, message: '请输入真实姓名' }]}
          >
            <Input placeholder="请输入您的真实姓名" />
          </Form.Item>

          <Form.Item
            name="idNumber"
            label="身份证号"
            rules={[
              { required: true, message: '请输入身份证号' },
              { pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, message: '请输入正确的身份证号' }
            ]}
          >
            <Input placeholder="请输入18位身份证号" />
          </Form.Item>
        </div>
      )
    },
    {
      title: '资质证明',
      icon: <FileTextOutlined />,
      content: (
        <div>
          <Alert
            message="资质证明要求"
            description="请上传清晰的证件照片，支持jpg、png格式，文件大小不超过5MB"
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <Form.Item
            name="nursingCert"
            label="护理证"
            rules={[{ required: true, message: '请上传护理证' }]}
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={() => false}
              accept=".jpg,.jpeg,.png"
            >
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>上传护理证</div>
              </div>
            </Upload>
          </Form.Item>

          <Form.Item
            name="healthCert"
            label="健康证"
            rules={[{ required: true, message: '请上传健康证' }]}
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={() => false}
              accept=".jpg,.jpeg,.png"
            >
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>上传健康证</div>
              </div>
            </Upload>
          </Form.Item>
        </div>
      )
    },
    {
      title: '技能标签',
      icon: <TagsOutlined />,
      content: (
        <div>
          <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
            请选择您具备的护理技能，这将帮助客户更好地了解您的专业能力
          </Text>

          <Form.Item
            name="skills"
            label="护理技能"
            rules={[{ required: true, message: '请至少选择一项技能' }]}
          >
            <Select
              mode="multiple"
              placeholder="请选择您的护理技能"
              style={{ width: '100%' }}
              options={skillOptions.map(skill => ({ label: skill, value: skill }))}
            />
          </Form.Item>
        </div>
      )
    },
    {
      title: '服务范围',
      icon: <GlobalOutlined />,
      content: (
        <div>
          <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
            请选择您愿意提供的服务类型和范围
          </Text>

          <Form.Item
            name="serviceAreas"
            label="服务范围"
            rules={[{ required: true, message: '请至少选择一项服务范围' }]}
          >
            <Select
              mode="multiple"
              placeholder="请选择您的服务范围"
              style={{ width: '100%' }}
              options={serviceAreaOptions.map(area => ({ label: area, value: area }))}
            />
          </Form.Item>
        </div>
      )
    },
    {
      title: '自我介绍',
      icon: <EditOutlined />,
      content: (
        <div>
          <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
            请简要介绍您的护理经验、专业特长和服务理念
          </Text>

          <Form.Item
            name="selfIntroduction"
            label="自我介绍"
            rules={[
              { required: true, message: '请输入自我介绍' },
              { min: 10, message: '自我介绍至少10字' },
              { max: 500, message: '自我介绍不能超过500字' }
            ]}
          >
            <TextArea
              rows={6}
              placeholder="请介绍您的护理经验、专业特长、服务理念等..."
              showCount
              maxLength={500}
            />
          </Form.Item>
        </div>
      )
    }
  ];

  const handleSubmit = async (values: CertificationForm) => {
    setLoading(true);
    try {
      // 这里应该调用后端API提交认证信息
      console.log('提交认证信息:', values);

      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 2000));

      message.success('认证信息提交成功，请等待审核');
      setSubmitted(true);
    } catch (error) {
      message.error('提交失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    form.validateFields().then(() => {
      setCurrentStep(currentStep + 1);
    });
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  if (submitted) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <CheckCircleOutlined style={{ fontSize: '64px', color: '#52c41a', marginBottom: '16px' }} />
        <Title level={3}>认证信息已提交</Title>
        <Text type="secondary" style={{ display: 'block', marginBottom: '24px' }}>
          您的认证信息已成功提交，我们将在3-5个工作日内完成审核
        </Text>
        <Alert
          message="审核状态"
          description={
            <div>
              <div>当前状态：<ClockCircleOutlined /> 审核中</div>
              <div>预计完成时间：3-5个工作日</div>
            </div>
          }
          type="info"
          showIcon
          style={{ maxWidth: '400px', margin: '0 auto' }}
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '16px' }}>
      <Title level={2}>资质认证</Title>

      <div style={{ background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Steps current={currentStep} style={{ marginBottom: '24px' }}>
          {steps.map((step, index) => (
            <Steps.Step key={index} title={step.title} icon={step.icon} />
          ))}
        </Steps>

        <Divider />

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            skills: [],
            serviceAreas: []
          }}
        >
          {steps[currentStep].content}

          <Divider />

          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Button
              disabled={currentStep === 0}
              onClick={prevStep}
            >
              上一步
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button type="primary" onClick={nextStep}>
                下一步
              </Button>
            ) : (
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
              >
                提交认证
              </Button>
            )}
          </Space>
        </Form>
      </div>
    </div>
  );
};

export default Certification; 