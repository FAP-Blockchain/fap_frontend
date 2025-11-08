import React, { useState } from "react";
import { Button, Form, Input, Typography, Card, Alert } from "antd";
import { LockOutlined, SafetyOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthServices from "../../services/auth/api.service";
import { logout } from "../../redux/features/authSlice";
import { useDispatch } from "react-redux";
import { clearAllCookies } from "../../utils/cookie";
import "./index.scss";

const { Title, Text } = Typography;

interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePassword: React.FC = () => {
  const [form] = Form.useForm<ChangePasswordForm>();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<
    "weak" | "medium" | "strong" | null
  >(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    if (password.length === 0) {
      setPasswordStrength(null);
      return;
    }
    if (password.length < 6) {
      setPasswordStrength("weak");
    } else if (password.length < 10) {
      setPasswordStrength("medium");
    } else {
      setPasswordStrength("strong");
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case "weak":
        return "#ff4d4f";
      case "medium":
        return "#faad14";
      case "strong":
        return "#52c41a";
      default:
        return "#d9d9d9";
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case "weak":
        return "Weak";
      case "medium":
        return "Medium";
      case "strong":
        return "Strong";
      default:
        return "";
    }
  };

  const onFinish = async (values: ChangePasswordForm) => {
    setIsLoading(true);
    try {
      const response = await AuthServices.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });

      if (response.success) {
        toast.success("Password changed successfully! Please login again.");

        // Logout user after password change
        dispatch(logout());
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        clearAllCookies();

        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.error(response.message || "Failed to change password!");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to change password! Please check your information.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="change-password-container">
      <Card className="change-password-card">
        <div className="change-password-header">
          <Title level={2}>Change Password</Title>
          <Text type="secondary">
            Please enter your current password and new password
          </Text>
        </div>

        <Alert
          message="Note"
          description="After successfully changing your password, you will be logged out and need to login again with your new password."
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          size="large"
          className="change-password-form"
        >
          <Form.Item
            label="Current Password"
            name="currentPassword"
            rules={[
              { required: true, message: "Please enter current password!" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter current password"
              disabled={isLoading}
            />
          </Form.Item>

          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[
              { required: true, message: "Please enter new password!" },
              { min: 6, message: "Password must be at least 6 characters!" },
            ]}
          >
            <Input.Password
              prefix={<SafetyOutlined />}
              placeholder="Enter new password"
              disabled={isLoading}
              onChange={handlePasswordChange}
            />
          </Form.Item>

          {passwordStrength && (
            <div className="password-strength-indicator">
              <div
                className="password-strength-bar"
                style={{
                  width:
                    passwordStrength === "weak"
                      ? "33%"
                      : passwordStrength === "medium"
                      ? "66%"
                      : "100%",
                  backgroundColor: getPasswordStrengthColor(),
                }}
              />
              <Text
                type="secondary"
                style={{ color: getPasswordStrengthColor(), fontSize: 12 }}
              >
                Strength: {getPasswordStrengthText()}
              </Text>
            </div>
          )}

          <Form.Item
            label="Confirm New Password"
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Please confirm new password!" },
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
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Re-enter new password"
              disabled={isLoading}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={isLoading}
              className="change-password-button"
            >
              Change Password
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ChangePassword;
