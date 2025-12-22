import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Space,
  Button,
  Collapse,
  Tabs,
  Alert,
  Divider,
  List,
  Avatar,
  Tag,
} from "antd";
import {
  QuestionCircleOutlined,
  PhoneOutlined,
  MailOutlined,
  ApiOutlined,
  BookOutlined,
  SafetyCertificateOutlined,
  RocketOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import "./AboutHelp.scss";

const { Title, Text, Paragraph } = Typography;

const AboutHelp: React.FC = () => {
  const [activeTab, setActiveTab] = useState("faq");

  const faqData = [
    {
      key: "what-is-blockchain-verification",
      label: "Xác thực chứng chỉ blockchain là gì?",
      children: (
        <div>
          <Paragraph>
            Đây là cách kiểm tra tính hợp lệ của chứng chỉ học thuật bằng việc
            đối chiếu thông tin chứng chỉ với dữ liệu đã được ghi nhận trên blockchain.
            Trong dự án này, người dùng có thể xác thực chứng chỉ công khai bằng mã chứng chỉ
            hoặc mã hash/đường dẫn QR.
          </Paragraph>
          <Paragraph>
            <strong>Lợi ích:</strong>
            <ul>
              <li>Giảm rủi ro giả mạo nhờ đối chiếu với blockchain</li>
              <li>Tra cứu nhanh bằng QR hoặc nhập mã/hash</li>
              <li>Kết quả dựa trên dữ liệu đã được ghi nhận</li>
            </ul>
          </Paragraph>
        </div>
      ),
    },
    {
      key: "how-to-verify",
      label: "Làm thế nào để xác thực chứng chỉ?",
      children: (
        <div>
          <Paragraph>Hiện tại có 2 phương thức xác thực:</Paragraph>
          <div style={{ marginLeft: 16 }}>
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <div>
                <Tag color="green">Quét mã QR</Tag>
                <Text>
                  Tải ảnh QR lên hoặc dán nội dung QR/URL để hệ thống đọc và xác thực
                </Text>
              </div>
              <div>
                <Tag color="blue">Nhập thủ công</Tag>
                <Text>Nhập ID chứng chỉ hoặc mã hash blockchain thủ công</Text>
              </div>
            </Space>
          </div>
          <Paragraph style={{ marginTop: 16 }}>
            Chỉ cần vào trang <strong>Xác thực chứng chỉ</strong> của chúng tôi và chọn
            phương thức phù hợp. Thời gian phản hồi phụ thuộc vào kết nối mạng và trạng thái hệ thống.
          </Paragraph>
        </div>
      ),
    },
    {
      key: "verification-failed",
      label: "Nếu xác thực thất bại thì sao?",
      children: (
        <div>
          <Paragraph>
            Nếu xác thực chứng chỉ thất bại, có thể do một số lý do sau:
          </Paragraph>
          <List
            itemLayout="horizontal"
            dataSource={[
              {
                title: "Không tìm thấy chứng chỉ",
                description:
                  "Mã chứng chỉ/hash không tồn tại hoặc không khớp với dữ liệu đã ghi nhận",
              },
              {
                title: "Định dạng không hợp lệ",
                description:
                  "Định dạng ID chứng chỉ không đúng hoặc có lỗi chính tả",
              },
              {
                title: "Chứng chỉ đã bị thu hồi",
                description:
                  "Chứng chỉ có thể đã bị cập nhật trạng thái/thu hồi (nếu hệ thống áp dụng)",
              },
              {
                title: "Lỗi kết nối",
                description:
                  "Không thể kết nối tới dịch vụ xác thực. Vui lòng thử lại sau",
              },
            ]}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      icon={<CloseCircleOutlined />}
                      style={{ backgroundColor: "#ff4d4f" }}
                    />
                  }
                  title={item.title}
                  description={item.description}
                />
              </List.Item>
            )}
          />
          <Alert
            message="Bước tiếp theo"
            description="Nếu xác thực thất bại, vui lòng kiểm tra lại ID chứng chỉ và liên hệ với tổ chức cấp để được hỗ trợ."
            type="warning"
            showIcon
            style={{ marginTop: 16 }}
          />
        </div>
      ),
    },
    {
      key: "data-privacy",
      label: "Dữ liệu của tôi được bảo vệ như thế nào?",
      children: (
        <div>
          <Paragraph>
            Dự án ưu tiên nguyên tắc tối thiểu dữ liệu và chỉ xử lý thông tin cần thiết cho việc xác thực:
          </Paragraph>
          <Space direction="vertical" style={{ width: "100%" }}>
            <div>
              <CheckCircleOutlined
                style={{ color: "#52c41a", marginRight: 8 }}
              />
              <Text strong>Xác thực công khai:</Text> Có thể kiểm tra chứng chỉ mà không cần đăng nhập
            </div>
            <div>
              <CheckCircleOutlined
                style={{ color: "#52c41a", marginRight: 8 }}
              />
              <Text strong>Xử lý QR trên trình duyệt:</Text> Ảnh QR được đọc ở phía client; hệ thống chỉ gửi mã/hash để xác thực
            </div>
            <div>
              <CheckCircleOutlined
                style={{ color: "#52c41a", marginRight: 8 }}
              />
              <Text strong>Kết nối an toàn:</Text> Giao tiếp với API qua HTTPS
            </div>
            <div>
              <CheckCircleOutlined
                style={{ color: "#52c41a", marginRight: 8 }}
              />
              <Text strong>Phân quyền rõ ràng:</Text> Dữ liệu cá nhân/chi tiết học vụ chỉ hiển thị cho người dùng đã đăng nhập đúng vai trò
            </div>
          </Space>
        </div>
      ),
    },
  ];

  const contactInfo = [
    {
      icon: <PhoneOutlined style={{ color: "#1890ff" }} />,
      title: "Hỗ trợ qua điện thoại",
      description: "0944056171",
      subtitle: "Liên hệ khi cần hỗ trợ",
    },
    {
      icon: <MailOutlined style={{ color: "#52c41a" }} />,
      title: "Hỗ trợ qua email",
      description: "hungnpse170107@fpt.edu.vn",
      subtitle: "Gửi email để được phản hồi",
    },
  ];

  const tabItems = [
    {
      key: "faq",
      label: (
        <span>
          <QuestionCircleOutlined />
          FAQ
        </span>
      ),
      children: (
        <div className="faq-section">
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <Title level={3}>Câu hỏi thường gặp</Title>
            <Text type="secondary">
              Tìm câu trả lời cho các câu hỏi phổ biến về dịch vụ xác thực chứng chỉ của chúng tôi
            </Text>
          </div>

          <Collapse
            items={faqData}
            defaultActiveKey={["what-is-blockchain-verification"]}
            ghost
            size="large"
          />
        </div>
      ),
    },
    {
      key: "contact",
      label: (
        <span>
          <PhoneOutlined />
          Liên hệ
        </span>
      ),
      children: (
        <div className="contact-section">
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <Title level={3}>Liên hệ với chúng tôi</Title>
            <Text type="secondary">
              Cần hỗ trợ? Đội ngũ hỗ trợ của chúng tôi sẵn sàng giúp đỡ bạn
            </Text>
          </div>

          <Row gutter={[24, 24]}>
            {contactInfo.map((contact, index) => (
              <Col xs={24} md={12} key={index}>
                <Card hoverable className="contact-card">
                  <Space>
                    <Avatar size={48} icon={contact.icon} />
                    <div>
                      <Title level={5} style={{ margin: 0 }}>
                        {contact.title}
                      </Title>
                      <Text strong>{contact.description}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {contact.subtitle}
                      </Text>
                    </div>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ),
    },
    {
      key: "about",
      label: (
        <span>
          <BookOutlined />
          Về chúng tôi
        </span>
      ),
      children: (
        <div className="about-section">
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <Title level={3}>Về nền tảng của chúng tôi</Title>
            <Text type="secondary">
              Nền tảng xác thực chứng chỉ học thuật dựa trên blockchain (UAP)
            </Text>
          </div>

          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Card className="feature-card">
                <SafetyCertificateOutlined
                  style={{ fontSize: 48, color: "#52c41a", marginBottom: 16 }}
                />
                <Title level={4}>Minh bạch & Chống giả mạo</Title>
                <Paragraph>
                  Dữ liệu chứng chỉ được đối chiếu với blockchain để tăng độ tin cậy khi xác minh.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="feature-card">
                <RocketOutlined
                  style={{ fontSize: 48, color: "#1890ff", marginBottom: 16 }}
                />
                <Title level={4}>Tra cứu nhanh</Title>
                <Paragraph>
                  Hỗ trợ xác thực bằng QR/ID/hash giúp kiểm tra nhanh tính hợp lệ của chứng chỉ.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="feature-card">
                <ApiOutlined
                  style={{ fontSize: 48, color: "#722ed1", marginBottom: 16 }}
                />
                <Title level={4}>Tích hợp hệ thống</Title>
                <Paragraph>
                  Cung cấp API để frontend và các hệ thống liên quan có thể tích hợp chức năng xác thực.
                </Paragraph>
              </Card>
            </Col>
          </Row>

          <Divider />
        </div>
      ),
    },
  ];

  return (
    <div className="about-help">
      {/* Page Header */}
      <div className="page-header">
        <Title level={2} style={{ margin: 0, color: "#ffffff" }}>
          Trung tâm trợ giúp & Hỗ trợ
        </Title>
        <Text type="secondary" style={{ fontSize: 16 }}>
          Tất cả những gì bạn cần biết về xác thực chứng chỉ
        </Text>
      </div>

      {/* Main Content */}
      <Card className="help-content">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          centered
          size="large"
          items={tabItems}
          className="help-tabs"
        />
      </Card>
    </div>
  );
};

export default AboutHelp;
