import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import StudentServices from "../../../services/student/api.service";
import type {
  WeeklyScheduleDto,
  ScheduleItemDto,
} from "../../../types/Schedule";
import "./WeeklyTimetable.scss";

dayjs.extend(weekOfYear);

const { Title, Text } = Typography;
const { Option } = Select;

type DayKey =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

interface TimetableSlot {
  slotIndex: number;
  time: string;
  label: string;
  monday?: ClassInfo;
  tuesday?: ClassInfo;
  wednesday?: ClassInfo;
  thursday?: ClassInfo;
  friday?: ClassInfo;
  saturday?: ClassInfo;
  sunday?: ClassInfo;
}

interface ClassInfo {
  courseCode: string;
  courseName: string;
  instructor?: string;
  location?: string;
  attendance?: "attended" | "absent" | "not_yet";
  date: string;
  classId?: string;
  slotId?: string;
  status?: string;
  startTime?: string;
  endTime?: string;
  rawSlot?: ScheduleItemDto;
}

const dayMappings: Record<
  string,
  { key: DayKey; label: string; shortLabel: string }
> = {
  Monday: { key: "monday", label: "Thứ 2", shortLabel: "T2" },
  Tuesday: { key: "tuesday", label: "Thứ 3", shortLabel: "T3" },
  Wednesday: { key: "wednesday", label: "Thứ 4", shortLabel: "T4" },
  Thursday: { key: "thursday", label: "Thứ 5", shortLabel: "T5" },
  Friday: { key: "friday", label: "Thứ 6", shortLabel: "T6" },
  Saturday: { key: "saturday", label: "Thứ 7", shortLabel: "T7" },
  Sunday: { key: "sunday", label: "Chủ nhật", shortLabel: "CN" },
};

const DEFAULT_TIME_SLOTS: TimetableSlot[] = [
  { slotIndex: 1, time: "07:30 - 09:20", label: "Ca 1" },
  { slotIndex: 2, time: "09:30 - 11:20", label: "Ca 2" },
  { slotIndex: 3, time: "12:30 - 14:20", label: "Ca 3" },
  { slotIndex: 4, time: "14:30 - 16:20", label: "Ca 4" },
];

const WeeklyTimetable: React.FC = () => {
  const navigate = useNavigate();
  const [selectedWeek, setSelectedWeek] = useState(dayjs());
  const [weeklySchedule, setWeeklySchedule] =
    useState<WeeklyScheduleDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getMondayOfWeek = useCallback((date: dayjs.Dayjs) => {
    const day = date.day();
    const diff = day === 0 ? -6 : 1 - day;
    return date.add(diff, "day").startOf("day");
  }, []);

  const formatTimeRange = useCallback((start?: string, end?: string) => {
    if (!start || !end) return "—";
    const startLabel = dayjs(start).format("HH:mm");
    const endLabel = dayjs(end).format("HH:mm");
    return `${startLabel} - ${endLabel}`;
  }, []);

  const mapAttendance = useCallback(
    (slot: ScheduleItemDto): ClassInfo["attendance"] => {
      if (slot.isPresent === true) return "attended";
      if (slot.isPresent === false) return "absent";
      if (slot.hasAttendance) return "not_yet";
      return undefined;
    },
    []
  );

  const convertSlotToClassInfo = useCallback(
    (slot: ScheduleItemDto): ClassInfo => ({
      courseCode: slot.subjectCode || slot.classCode,
      courseName: slot.subjectName || slot.classCode,
      instructor: slot.teacherName,
      location: slot.notes || slot.classCode,
      attendance: mapAttendance(slot),
      date: slot.date,
      classId: slot.classId,
      slotId: slot.slotId,
      status: slot.status,
      startTime: slot.startTime,
      endTime: slot.endTime,
      rawSlot: slot,
    }),
    [mapAttendance]
  );

  const fetchWeeklySchedule = useCallback(
    async (week: dayjs.Dayjs) => {
      const monday = getMondayOfWeek(week);
      setIsLoading(true);
      setError(null);
      try {
        const data = await StudentServices.getMyWeeklySchedule(
          monday.toISOString()
        );
        setWeeklySchedule(data);
      } catch (err) {
        const message =
          (err as { message?: string })?.message ||
          "Không thể tải dữ liệu thời khóa biểu.";
        setError(message);
        setWeeklySchedule(null);
      } finally {
        setIsLoading(false);
      }
    },
    [getMondayOfWeek]
  );

  useEffect(() => {
    fetchWeeklySchedule(selectedWeek);
  }, [fetchWeeklySchedule, selectedWeek]);

  const getAttendanceTag = (attendance?: string) => {
    switch (attendance) {
      case "attended":
        return (
          <Tag color="success" icon={<CheckCircleOutlined />}>
            Đã tham gia
          </Tag>
        );
      case "absent":
        return (
          <Tag color="error" icon={<CloseCircleOutlined />}>
            Vắng mặt
          </Tag>
        );
      case "not_yet":
        return (
          <Tag color="warning" icon={<ExclamationCircleOutlined />}>
            Chưa có
          </Tag>
        );
      default:
        return null;
    }
  };

  const getActivityId = (classInfo: ClassInfo, dayKey: string) => {
    if (classInfo.slotId) return classInfo.slotId;
    if (classInfo.classId) return classInfo.classId;
    return `${classInfo.courseCode}_${dayKey}`;
  };

  const renderClassCell = useCallback(
    (classInfo?: ClassInfo, dayKey?: string) => {
      if (!classInfo) {
        return <div className="empty-slot">-</div>;
      }

      const handleViewDetails = () => {
        const activityId = getActivityId(classInfo, dayKey || "tue");
        navigate(`/student-portal/activity/${activityId}`, {
          state: { slot: classInfo.rawSlot },
        });
      };

      return (
        <div
          className="class-slot"
          onClick={handleViewDetails}
          style={{ cursor: "pointer" }}
        >
          <div className="course-code">
            <Text strong>{classInfo.courseCode}</Text>
            <Tooltip title="Xem chi tiết">
              <Button
                type="link"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewDetails();
                }}
              >
                Xem tài liệu
              </Button>
            </Tooltip>
          </div>
          <div className="course-info">
            <Text style={{ fontSize: 12 }}>
              {classInfo.courseName}
              {classInfo.instructor && ` • ${classInfo.instructor}`}
            </Text>
          </div>
          <div className="attendance-status">
            {getAttendanceTag(classInfo.attendance)}
          </div>
          <div className="time-info">
            <Text type="secondary" style={{ fontSize: 11 }}>
              {dayjs(classInfo.date).format("DD/MM/YYYY")}
            </Text>
          </div>
        </div>
      );
    },
    [navigate]
  );

  const timetableData = useMemo(() => {
    if (!weeklySchedule) return DEFAULT_TIME_SLOTS;

    const slotMap = new Map<string, TimetableSlot>();

    weeklySchedule.days.forEach((day) => {
      const dayMeta = dayMappings[day.dayOfWeek];
      if (!dayMeta) return;

      day.slots.forEach((slot) => {
        const startTimeKey = slot.startTime || slot.timeSlotName || slot.slotId;
        const key = `${slot.timeSlotId}-${startTimeKey}`;

        if (!slotMap.has(key)) {
          slotMap.set(key, {
            slotIndex: slotMap.size + 1,
            time: formatTimeRange(slot.startTime, slot.endTime),
            label: slot.timeSlotName || `Ca ${slotMap.size + 1}`,
          });
        }

        const row = slotMap.get(key);
        if (row) {
          row[dayMeta.key] = convertSlotToClassInfo(slot);
        }
      });
    });

    const rows = Array.from(slotMap.values()).sort((a, b) =>
      a.time.localeCompare(b.time)
    );

    return rows.length > 0 ? rows : DEFAULT_TIME_SLOTS;
  }, [weeklySchedule, convertSlotToClassInfo, formatTimeRange]);

  const columns: ColumnsType<TimetableSlot> = useMemo(() => {
    const base: ColumnsType<TimetableSlot> = [
      {
        title: "Ca học",
        dataIndex: "slotIndex",
        key: "slotIndex",
        width: 120,
        render: (_: number, record: TimetableSlot) => (
          <div className="time-slot-header">
            <div className="slot-number">{record.label}</div>
            <div className="slot-time">{record.time}</div>
          </div>
        ),
      },
    ];

    Object.keys(dayMappings).forEach((dayName) => {
      const meta = dayMappings[dayName];
      const dayData = weeklySchedule?.days.find((d) => d.dayOfWeek === dayName);

      base.push({
        title: (
          <div className="day-header">
            <CalendarOutlined />
            <span>{meta.shortLabel}</span>
            <div className="date-number">
              {dayData ? dayjs(dayData.date).format("DD/MM") : "--/--"}
            </div>
          </div>
        ),
        dataIndex: meta.key,
        key: meta.key,
        width: 130,
        render: (classInfo: ClassInfo) =>
          renderClassCell(classInfo, meta.shortLabel.toLowerCase()),
      });
    });

    return base;
  }, [weeklySchedule, renderClassCell]);

  const handleWeekChange = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setSelectedWeek((prev) => prev.subtract(1, "week"));
    } else {
      setSelectedWeek((prev) => prev.add(1, "week"));
    }
  };

  return (
    <div className="weekly-timetable">
      {/* Page Header */}
      <div className="timetable-header">
        {/* Week Navigation */}
        <Card className="week-nav-card">
          <Row align="middle" justify="space-between">
            <Col>
              <Space>
                <Button type="primary" onClick={() => handleWeekChange("prev")}>
                  ← Tuần trước
                </Button>
                <Button onClick={() => handleWeekChange("next")}>
                  Tuần sau →
                </Button>
              </Space>
            </Col>
            <Col>
              <div className="week-info">
                <Title level={4} style={{ margin: 0 }}>
                  {weeklySchedule?.weekLabel ||
                    `Tuần: ${selectedWeek.format("DD/MM")} - ${selectedWeek
                      .add(6, "day")
                      .format("DD/MM/YYYY")}`}
                </Title>
                <Text type="secondary">
                  Tổng số ca: {weeklySchedule?.totalSlots ?? 0}
                </Text>
              </div>
            </Col>
            <Col>
              <div className="date-controls">
                <Space size="middle">
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={() => setSelectedWeek(dayjs())}
                    className="current-week-btn"
                  >
                    Tuần hiện tại
                  </Button>
                  <div className="date-select-group">
                    <Select
                      value={selectedWeek.format("YYYY")}
                      className="year-select"
                      suffixIcon={null}
                      onChange={(year: string) =>
                        setSelectedWeek((prev) => prev.year(Number(year)))
                      }
                    >
                      <Option value="2024">2024</Option>
                      <Option value="2025">2025</Option>
                    </Select>
                    <DatePicker.WeekPicker
                      value={selectedWeek}
                      onChange={(date: dayjs.Dayjs | null) =>
                        date && setSelectedWeek(date)
                      }
                      className="week-picker"
                      format="YYYY-wo"
                      placeholder="Chọn tuần"
                      allowClear={false}
                    />
                  </div>
                </Space>
              </div>
            </Col>
          </Row>
        </Card>
      </div>

      {/* Timetable */}
      <Card className="timetable-card">
        {error && (
          <Alert
            type="error"
            message="Không thể tải thời khóa biểu"
            description={error}
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}
        <Spin spinning={isLoading}>
          <Table
            columns={columns}
            dataSource={timetableData}
            rowKey={(record) => `${record.label}-${record.time}`}
            pagination={false}
            bordered
            size="middle"
            className="timetable-table"
            scroll={{ x: true }}
            locale={{ emptyText: null }}
          />
        </Spin>
      </Card>

      {/* Legend */}
      <Card style={{ marginTop: 24 }}>
        <Row gutter={[16, 8]} align="middle">
          <Col>
            <Text strong>Chú thích:</Text>
          </Col>
          <Col>
            <Space>
              <Badge
                color="#52c41a"
                text="Đã tham gia - Sinh viên đã tham gia lớp học này"
              />
              <Badge color="#ff4d4f" text="Vắng mặt - Sinh viên đã vắng mặt" />
              <Badge color="#faad14" text="Chưa có - Lớp học chưa bắt đầu" />
            </Space>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default WeeklyTimetable;
