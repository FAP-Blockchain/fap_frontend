import React, { useState } from "react";
import {
  Table,
  Card,
  Button,
  Space,
  Input,
  Select,
  Modal,
  Form,
  DatePicker,
  message,
  Tag,
  Popconfirm,
  Row,
  Col,
  Tooltip,
  Switch,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  CalendarOutlined,
  FilterOutlined,
  BookOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { Dayjs } from "dayjs";
import type { Semester } from "../../../types/Semester";
import dayjs from "dayjs";
import "./index.scss";

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface SemesterFormValues {
  name: string;
  dateRange: [Dayjs, Dayjs];
  isActive?: boolean;
  isClosed?: boolean;
}

const SemestersManagement: React.FC = () => {
  // Mock data - sẽ được thay thế bằng API call
  const [semesters, setSemesters] = useState<Semester[]>([
    {
      id: "d5555555-5555-5555-5555-555555555555",
      name: "Fall 2025",
      startDate: "2025-09-01T00:00:00",
      endDate: "2025-12-31T00:00:00",
      totalSubjects: 1,
      isActive: true,
      isClosed: false,
    },
  ]);

  const [filteredSemesters, setFilteredSemesters] =
    useState<Semester[]>(semesters);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSemester, setEditingSemester] = useState<Semester | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Statistics
  const stats = {
    total: semesters.length,
    active: semesters.filter((s) => s.isActive && !s.isClosed).length,
    closed: semesters.filter((s) => s.isClosed).length,
    totalSubjects: semesters.reduce((sum, s) => sum + s.totalSubjects, 0),
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    filterSemesters(value, statusFilter);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    filterSemesters(searchText, value);
  };

  const filterSemesters = (search: string, status: string) => {
    let filtered = semesters;

    if (search) {
      filtered = filtered.filter((sem) =>
        sem.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status === "active") {
      filtered = filtered.filter((sem) => sem.isActive && !sem.isClosed);
    } else if (status === "closed") {
      filtered = filtered.filter((sem) => sem.isClosed);
    } else if (status === "inactive") {
      filtered = filtered.filter((sem) => !sem.isActive && !sem.isClosed);
    }

    setFilteredSemesters(filtered);
  };

  const showModal = (semester?: Semester) => {
    if (semester) {
      setEditingSemester(semester);
      form.setFieldsValue({
        ...semester,
        dateRange: [dayjs(semester.startDate), dayjs(semester.endDate)],
      });
    } else {
      setEditingSemester(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then((values: SemesterFormValues) => {
      if (!values.dateRange || values.dateRange.length < 2) {
        message.error("Vui lòng chọn thời gian học kì!");
        return;
      }
      const [startValue, endValue] = values.dateRange;
      const semesterData: Semester = {
        id: editingSemester?.id || Date.now().toString(),
        name: values.name,
        startDate: startValue.format("YYYY-MM-DDTHH:mm:ss"),
        endDate: endValue.format("YYYY-MM-DDTHH:mm:ss"),
        totalSubjects: editingSemester?.totalSubjects || 0,
        isActive: values.isActive ?? true,
        isClosed: values.isClosed ?? false,
      };

      if (editingSemester) {
        setSemesters((prev) =>
          prev.map((s) => (s.id === editingSemester.id ? semesterData : s))
        );
        message.success("Cập nhật học kì thành công!");
      } else {
        setSemesters((prev) => [...prev, semesterData]);
        message.success("Thêm học kì thành công!");
      }

      setIsModalVisible(false);
      filterSemesters(searchText, statusFilter);
    });
  };

  const handleDelete = (id: string) => {
    setSemesters((prev) => prev.filter((s) => s.id !== id));
    filterSemesters(searchText, statusFilter);
    message.success("Xóa học kì thành công!");
  };

  const handleToggleStatus = (id: string, field: "isActive" | "isClosed") => {
    setSemesters((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: !s[field] } : s))
    );
    filterSemesters(searchText, statusFilter);
    message.success(
      `${field === "isActive" ? "Kích hoạt" : "Đóng"} học kì thành công!`
    );
  };

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("DD/MM/YYYY");
  };

  const getDuration = (startDate: string, endDate: string) => {
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    const days = end.diff(start, "day");
    return `${days} ngày`;
  };

  const columns: ColumnsType<Semester> = [
    {
      title: "Tên học kì",
      key: "name",
      width: 200,
      render: (_, record) => (
        <div className="semester-name">
          <div className="semester-icon-wrapper">
            <CalendarOutlined className="semester-icon" />
          </div>
          <div className="semester-details">
            <div className="name">{record.name}</div>
            <div className="duration">
              <ClockCircleOutlined className="duration-icon" />
              {getDuration(record.startDate, record.endDate)}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      width: 150,
      render: (date) => (
        <div className="date-info">
          <ClockCircleOutlined className="date-icon" />
          <span>{formatDate(date)}</span>
        </div>
      ),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      width: 150,
      render: (date) => (
        <div className="date-info">
          <ClockCircleOutlined className="date-icon" />
          <span>{formatDate(date)}</span>
        </div>
      ),
    },
    {
      title: "Số môn học",
      dataIndex: "totalSubjects",
      key: "totalSubjects",
      width: 120,
      align: "center",
      render: (count) => (
        <div className="subjects-count">
          <Tag color="blue" icon={<BookOutlined />} className="subject-tag">
            {count} môn
          </Tag>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 180,
      render: (_, record) => (
        <div className="status-badges">
          {record.isActive && !record.isClosed ? (
            <div className="status-badge status-active">
              <div className="status-dot"></div>
              <CheckCircleOutlined className="status-icon" />
              <span className="status-text">Đang hoạt động</span>
            </div>
          ) : record.isClosed ? (
            <div className="status-badge status-closed">
              <div className="status-dot"></div>
              <CloseCircleOutlined className="status-icon" />
              <span className="status-text">Đã đóng</span>
            </div>
          ) : (
            <div className="status-badge status-inactive">
              <div className="status-dot"></div>
              <ClockCircleOutlined className="status-icon" />
              <span className="status-text">Chưa kích hoạt</span>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 200,
      render: (_, record) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              onClick={() => showModal(record)}
            />
          </Tooltip>
          {!record.isClosed && (
            <Tooltip title={record.isActive ? "Tắt kích hoạt" : "Kích hoạt"}>
              <Popconfirm
                title={`Bạn có chắc muốn ${
                  record.isActive ? "tắt kích hoạt" : "kích hoạt"
                } học kì này?`}
                onConfirm={() => handleToggleStatus(record.id, "isActive")}
                okText="Có"
                cancelText="Không"
              >
                <Button
                  type={record.isActive ? "default" : "primary"}
                  icon={
                    record.isActive ? (
                      <CloseCircleOutlined />
                    ) : (
                      <CheckCircleOutlined />
                    )
                  }
                  size="small"
                />
              </Popconfirm>
            </Tooltip>
          )}
          <Tooltip title="Đóng học kì">
            <Popconfirm
              title="Bạn có chắc muốn đóng học kì này? Hành động này không thể hoàn tác!"
              onConfirm={() => handleToggleStatus(record.id, "isClosed")}
              okText="Có"
              cancelText="Không"
              disabled={record.isClosed}
            >
              <Button
                danger
                icon={<CloseCircleOutlined />}
                size="small"
                disabled={record.isClosed}
              />
            </Popconfirm>
          </Tooltip>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa học kì này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const statsCards = [
    {
      label: "Tổng học kì",
      value: stats.total,
      icon: <CalendarOutlined />,
      accent: "total",
    },
    {
      label: "Đang hoạt động",
      value: stats.active,
      icon: <CheckCircleOutlined />,
      accent: "active",
    },
    {
      label: "Đã đóng",
      value: stats.closed,
      icon: <CloseCircleOutlined />,
      accent: "closed",
    },
    {
      label: "Tổng môn học",
      value: stats.totalSubjects,
      icon: <BookOutlined />,
      accent: "subjects",
    },
  ];

  return (
    <div className="semesters-management">
      <Card className="overview-card">
        <div className="overview-header">
          <div className="title-block">
            <div className="title-icon">
              <CalendarOutlined />
            </div>
            <div>
              <p className="eyebrow">Bảng quản trị</p>
              <h2>Quản lý Học kì</h2>
              <span className="subtitle">
                Theo dõi và cập nhật trạng thái học kì trong hệ thống
              </span>
            </div>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="primary-action"
            onClick={() => showModal()}
          >
            Thêm học kì
          </Button>
        </div>

        <div className="stats-inline">
          {statsCards.map((item) => (
            <div key={item.label} className={`stat-item ${item.accent}`}>
              <div className="stat-icon-wrapper">{item.icon}</div>
              <div className="stat-content">
                <span className="stat-value">{item.value}</span>
                <span className="stat-label">{item.label}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="filters-row">
          <div className="filter-field">
            <label>Tìm kiếm học kì</label>
            <Search
              placeholder="Nhập tên học kì..."
              allowClear
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)}
              prefix={<SearchOutlined />}
            />
          </div>
          <div className="filter-field">
            <label>Trạng thái</label>
            <Select
              value={statusFilter}
              onChange={handleStatusFilter}
              suffixIcon={<FilterOutlined />}
            >
              <Option value="all">Tất cả</Option>
              <Option value="active">Đang hoạt động</Option>
              <Option value="inactive">Chưa kích hoạt</Option>
              <Option value="closed">Đã đóng</Option>
            </Select>
          </div>
          <div className="filter-summary">
            <span>
              Hoạt động: <strong>{stats.active}</strong>
            </span>
            <span>
              Đã đóng: <strong>{stats.closed}</strong>
            </span>
          </div>
        </div>
      </Card>

      <Card className="semesters-table-card" bordered={false}>
        <Table
          columns={columns}
          dataSource={filteredSemesters}
          rowKey="id"
          className="semesters-table"
          pagination={{
            pageSize: 8,
            showSizeChanger: false,
            showQuickJumper: false,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total}`,
            size: "small",
          }}
          scroll={{ x: 1000 }}
          size="small"
        />
      </Card>

      <Modal
        title={editingSemester ? "Chỉnh sửa học kì" : "Thêm học kì mới"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
        okText={editingSemester ? "Cập nhật" : "Thêm"}
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ isActive: true, isClosed: false }}
        >
          <Form.Item
            name="name"
            label="Tên học kì"
            rules={[{ required: true, message: "Vui lòng nhập tên học kì!" }]}
          >
            <Input placeholder="Ví dụ: Fall 2025, Spring 2025..." />
          </Form.Item>

          <Form.Item
            name="dateRange"
            label="Thời gian học kì"
            rules={[
              { required: true, message: "Vui lòng chọn thời gian học kì!" },
            ]}
          >
            <RangePicker
              style={{ width: "100%" }}
              format="DD/MM/YYYY"
              placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="isActive"
                label="Kích hoạt"
                valuePropName="checked"
              >
                <Switch checkedChildren="Có" unCheckedChildren="Không" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="isClosed"
                label="Đã đóng"
                valuePropName="checked"
              >
                <Switch
                  checkedChildren="Đã đóng"
                  unCheckedChildren="Chưa đóng"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default SemestersManagement;
