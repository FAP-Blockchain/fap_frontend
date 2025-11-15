import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Form,
  Input,
  Button,
  Avatar,
  DatePicker,
  Divider,
  message,
  Modal,
  Tag,
  Descriptions,
  Space,
  Spin,
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  SaveOutlined,
  MailOutlined,
  EnvironmentOutlined,
  IdcardOutlined,
  LockOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import StudentServices from "../../../services/student/api.service";
import type { StudentDetailDto } from "../../../types/Student";
import "./Profile.scss";

dayjs.extend(relativeTime);

const { Title, Text } = Typography;

const Profile: React.FC = () => {
  const [personalForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState<StudentDetailDto | null>(null);

  // Avatar từ public folder
  const tempAvatar = "/image/avatarEx.jpg";

  useEffect(() => {
    fetchStudentProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchStudentProfile = async () => {
    try {
      setLoading(true);
      const data = await StudentServices.getCurrentStudentProfile();
      setStudentData(data);

      // Set form values với dữ liệu từ API
      personalForm.setFieldsValue({
        fullName: data.fullName,
        email: data.email,
      });
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to load student profile";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePersonalInfoSave = async (values: Record<string, string>) => {
    try {
      console.log("Saving personal info:", values);
      message.success("Personal information updated successfully!");
      setEditingPersonal(false);
    } catch {
      message.error("Failed to update personal information");
    }
  };

  const handlePasswordChange = async (values: Record<string, string>) => {
    try {
      console.log("Changing password:", values);
      message.success("Password changed successfully!");
      setShowPasswordModal(false);
      passwordForm.resetFields();
    } catch {
      message.error("Failed to change password");
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
          }}
        >
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="profile-page">
        <Card>
          <Text>No student data available</Text>
        </Card>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* Page Header */}
      <div className="page-header">
        <Title level={2} style={{ margin: 0, color: "white" }}>
          Profile Management
        </Title>
        <Text
          type="secondary"
          style={{ fontSize: 16, color: "rgba(255,255,255,0.8)" }}
        >
          Manage your personal information and security settings
        </Text>
      </div>

      <Row gutter={[24, 24]}>
        {/* Profile Overview */}
        <Col xs={24} lg={8}>
          <Card className="profile-overview-card">
            <div className="profile-header">
              <div className="avatar-section">
                <Avatar
                  size={100}
                  src={tempAvatar}
                  icon={<UserOutlined />}
                  className="profile-avatar"
                />
              </div>
              <div className="profile-info">
                <Title
                  level={3}
                  style={{ margin: "16px 0 4px", textAlign: "center" }}
                >
                  {studentData.fullName}
                </Title>
                <Text
                  type="secondary"
                  style={{
                    display: "block",
                    textAlign: "center",
                    marginBottom: 8,
                  }}
                >
                  {studentData.studentCode}
                </Text>
                <div style={{ textAlign: "center" }}>
                  <Tag color={studentData.isActive ? "green" : "red"}>
                    {studentData.isActive ? "Active" : "Inactive"}
                  </Tag>
                  {studentData.isGraduated && <Tag color="blue">Graduated</Tag>}
                </div>
              </div>
            </div>

            <Divider />

            <Descriptions column={1} size="small">
              <Descriptions.Item label="Email">
                <Text copyable>{studentData.email}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="GPA">
                <Tag color="gold">{studentData.gpa.toFixed(2)}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Enrollment Date">
                {dayjs(studentData.enrollmentDate).format("MMMM YYYY")}
              </Descriptions.Item>
              <Descriptions.Item label="Total Classes">
                <Tag color="blue">{studentData.totalClasses}</Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Main Content */}
        <Col xs={24} lg={16}>
          <Row gutter={[0, 24]}>
            {/* Personal Information */}
            <Col xs={24}>
              <Card
                title={
                  <Space>
                    <IdcardOutlined style={{ color: "#1a94fc" }} />
                    <span>Personal Information</span>
                  </Space>
                }
                extra={
                  <Button
                    type={editingPersonal ? "default" : "primary"}
                    icon={editingPersonal ? <SaveOutlined /> : <EditOutlined />}
                    onClick={() => {
                      if (editingPersonal) {
                        personalForm.submit();
                      } else {
                        setEditingPersonal(true);
                      }
                    }}
                  >
                    {editingPersonal ? "Save Changes" : "Edit Info"}
                  </Button>
                }
              >
                <Form
                  form={personalForm}
                  layout="vertical"
                  onFinish={handlePersonalInfoSave}
                  initialValues={{
                    fullName: studentData.fullName,
                    email: studentData.email,
                  }}
                >
                  <Row gutter={[16, 0]}>
                    <Col xs={24} md={12}>
                      <Form.Item label="Full Name" name="fullName">
                        <Input
                          prefix={<UserOutlined />}
                          disabled={!editingPersonal}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item label="Email" name="email">
                        <Input
                          prefix={<MailOutlined />}
                          disabled={!editingPersonal}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item label="Phone Number" name="phone">
                        <Input
                          prefix={<PhoneOutlined />}
                          disabled={!editingPersonal}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item label="Date of Birth" name="dateOfBirth">
                        <DatePicker
                          style={{ width: "100%" }}
                          disabled={!editingPersonal}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24}>
                      <Form.Item label="Address" name="address">
                        <Input
                          prefix={<EnvironmentOutlined />}
                          disabled={!editingPersonal}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Card>
            </Col>

            {/* Change Password */}
            <Col xs={24}>
              <Card
                title={
                  <Space>
                    <LockOutlined style={{ color: "#1a94fc" }} />
                    <span>Change Password</span>
                  </Space>
                }
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 0",
                  }}
                >
                  <div>
                    <Text strong>Password</Text>
                    <br />
                    <Text type="secondary">
                      Update your password to keep your account secure
                    </Text>
                  </div>
                  <Button
                    type="primary"
                    icon={<LockOutlined />}
                    onClick={() => setShowPasswordModal(true)}
                  >
                    Change Password
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Change Password Modal */}
      <Modal
        title="Change Password"
        open={showPasswordModal}
        onCancel={() => {
          setShowPasswordModal(false);
          passwordForm.resetFields();
        }}
        footer={[
          <Button key="cancel" onClick={() => setShowPasswordModal(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => passwordForm.submit()}
          >
            Change Password
          </Button>,
        ]}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handlePasswordChange}
        >
          <Form.Item
            label="Current Password"
            name="currentPassword"
            rules={[
              { required: true, message: "Please enter your current password" },
            ]}
          >
            <Input.Password placeholder="Enter current password" />
          </Form.Item>

          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[
              { required: true, message: "Please enter a new password" },
              { min: 8, message: "Password must be at least 8 characters" },
            ]}
          >
            <Input.Password placeholder="Enter new password" />
          </Form.Item>

          <Form.Item
            label="Confirm New Password"
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Please confirm your new password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm new password" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Profile;
