import React, { useState, useEffect } from 'react';
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

} from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import request from '../utils/request';

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
  const [nursingCertFiles, setNursingCertFiles] = useState<any[]>([]);
  const [healthCertFiles, setHealthCertFiles] = useState<any[]>([]);
  const [certificationStatus, setCertificationStatus] = useState<'pending' | 'approved' | 'rejected' | null>(null);
  const [statusMessage, setStatusMessage] = useState('');

  // 查询认证状态
  const checkCertificationStatus = async () => {
    try {
      console.log('开始查询认证状态...');
      // 这里需要根据当前用户的身份证号查询认证状态
      // 暂时使用一个示例查询，实际应该根据用户信息查询
      const response = await request.get('/approves', {
        params: {
          // 可以根据需要添加查询参数
        }
      });

      console.log('认证状态查询响应:', response);
      console.log('响应数据:', response.data);

      // 注意：request 封装已在响应拦截器中返回 ApiResponse，本次调用返回值结构为
      // { code: number, message: string, data: any }，其中 response.data 即为列表数组
      const list = response?.data as any[] | undefined;
      if (Array.isArray(list) && list.length > 0) {
        const latestCert = list[0]; // 获取最新的认证记录
        console.log('最新认证记录:', latestCert);
        setCertificationStatus(latestCert.status);

        switch (latestCert.status) {
          case 'approved':
            setStatusMessage('资质认证已通过');
            break;
          case 'rejected':
            setStatusMessage('资质认证已拒绝');
            break;
          case 'pending':
            setStatusMessage('资质认证待审核');
            break;
          default:
            setStatusMessage('未知状态');
        }
      } else {
        // 如果没有认证记录，说明用户还没有提交过认证
        console.log('没有找到认证记录，设置默认状态');
        setCertificationStatus('pending');
        setStatusMessage('资质认证待审核');
      }
    } catch (error) {
      console.error('查询认证状态失败:', error);
      // 查询失败时也设置默认状态
      console.log('查询失败，设置默认状态');
      setCertificationStatus('pending');
      setStatusMessage('资质认证待审核');
    }
  };

  // 组件加载时查询状态
  useEffect(() => {
    checkCertificationStatus();
  }, []);

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
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={() => false}
              accept=".jpg,.jpeg,.png"
              action=""
              fileList={nursingCertFiles}
              onChange={({ fileList }) => {
                console.log('nursingCert onChange fileList:', fileList);
                setNursingCertFiles(fileList);
              }}
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
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={() => false}
              accept=".jpg,.jpeg,.png"
              action=""
              fileList={healthCertFiles}
              onChange={({ fileList }) => {
                console.log('healthCert onChange fileList:', fileList);
                setHealthCertFiles(fileList);
              }}
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
    console.log('Form values received in handleSubmit:', values);
    console.log('Form instance values:', form.getFieldsValue());
    setLoading(true);
    try {
      // 通过上传接口换取可访问 URL（使用 axios 实例，自动带上 baseURL/凭证）
      const uploadOnce = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('image', file);
        try {
          const resp: any = await request.post('/upload/image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          console.log('Upload success response:', resp);
          console.log('Upload response data:', resp.data);
          if (!resp.data || !resp.data.url) {
            console.error('Upload response missing URL:', resp);
            message.error('文件上传失败：响应中缺少URL');
            return '';
          }
          return resp.data.url as string;
        } catch (error) {
          console.error('文件上传失败:', error);
          message.error('文件上传失败，请重试');
          return '';
        }
      };

      const pickFile = async (list: any[] | undefined): Promise<File | null> => {
        console.log('pickFile input:', list);
        if (!list || list.length === 0) return null;
        const item: any = list[0];
        console.log('pickFile item:', item);
        console.log('item.originFileObj:', item.originFileObj);
        console.log('item.thumbUrl:', item.thumbUrl);
        console.log('item.url:', item.url);
        if (item.originFileObj) return item.originFileObj as File;
        // 兼容：从 thumbUrl/dataURL 转为 File
        const dataUrl: string | undefined = item.thumbUrl || item.url;
        if (dataUrl && dataUrl.startsWith('data:')) {
          const res = await fetch(dataUrl);
          const blob = await res.blob();
          return new File([blob], item.name || 'upload.png', { type: blob.type || 'image/png' });
        }
        console.log('pickFile failed - no valid file data found');
        return null;
      };

      const nursingFile = await pickFile(nursingCertFiles);
      const healthFile = await pickFile(healthCertFiles);
      let nursingUrl = '';
      let healthUrl = '';

      // 如果上传了护理证，则上传到服务器
      if (nursingFile) {
        nursingUrl = await uploadOnce(nursingFile);
        console.log('Generated nursingUrl:', nursingUrl);
      }

      // 如果上传了健康证，则上传到服务器
      if (healthFile) {
        healthUrl = await uploadOnce(healthFile);
        console.log('Generated healthUrl:', healthUrl);
      }

      // 约定：certificateImage=护理证，idCardFront=健康证（字段按后端集合保存 URL）
      const payload = {
        nurseName: values.realName,
        idcard: values.idNumber,
        certificateImage: nursingUrl,
        idCardFront: healthUrl,
        certificateType: 'both', // 护理证和健康证都有
      };

      console.log('Final payload for /approves:', payload);

      // 检查payload的每个字段
      console.log('Payload field details:');
      console.log('- nurseName:', typeof payload.nurseName, payload.nurseName);
      console.log('- idcard:', typeof payload.idcard, payload.idcard);
      console.log('- certificateImage:', typeof payload.certificateImage, payload.certificateImage);
      console.log('- idCardFront:', typeof payload.idCardFront, payload.idCardFront);
      console.log('- certificateType:', typeof payload.certificateType, payload.certificateType);

      await request.post('/approves', payload);

      message.success('认证信息已提交，请等待审核');
      setSubmitted(true);
      // 提交成功后立即查询最新状态
      setTimeout(() => {
        checkCertificationStatus();
      }, 1000);
    } catch (error) {
      message.error('提交失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    const stepFields: (keyof CertificationForm)[][] = [
      ['realName', 'idNumber'],
      [], // 文件验证使用自定义逻辑
      ['skills'],
      ['serviceAreas'],
      ['selfIntroduction']
    ];
    const fields = stepFields[currentStep] as any;

    // 第二步：自定义文件验证
    if (currentStep === 1) {
      setCurrentStep(currentStep + 1);
      return;
    }

    form.validateFields(fields)
      .then(() => {
        setCurrentStep(currentStep + 1);
      })
      .catch((error) => {
        console.error('表单验证失败:', error);
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
              <div>当前状态：{statusMessage}</div>
              {certificationStatus === 'pending' && (
                <div>预计完成时间：3-5个工作日</div>
              )}
              {certificationStatus === 'rejected' && (
                <div>拒绝原因：请联系客服了解详情</div>
              )}
            </div>
          }
          type={
            certificationStatus === 'approved' ? 'success' :
              certificationStatus === 'rejected' ? 'error' : 'info'
          }
          showIcon
          style={{ maxWidth: '400px', margin: '0 auto' }}
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '16px' }}>
      <Title level={2}>资质认证</Title>

      {/* 认证状态显示 */}
      {certificationStatus !== null && (
        <div style={{ marginBottom: '16px' }}>
          <Alert
            message="当前认证状态"
            description={
              <div>
                <strong>{statusMessage}</strong>
                {certificationStatus === 'pending' && (
                  <div style={{ marginTop: '8px', fontSize: '14px' }}>
                    预计完成时间：3-5个工作日
                  </div>
                )}
                {certificationStatus === 'rejected' && (
                  <div style={{ marginTop: '8px', fontSize: '14px' }}>
                    如有疑问，请联系客服
                  </div>
                )}
              </div>
            }
            type={
              certificationStatus === 'approved' ? 'success' :
                certificationStatus === 'rejected' ? 'error' : 'info'
            }
            showIcon
            style={{ marginBottom: '16px' }}
          />
        </div>
      )}

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
            realName: '',
            idNumber: '',
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