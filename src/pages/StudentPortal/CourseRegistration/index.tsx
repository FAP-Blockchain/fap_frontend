import React, { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Progress,
  Row,
  Segmented,
  Space,
  Tag,
  Typography,
  message,
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  ExperimentOutlined,
  FieldTimeOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import "./CourseRegistration.scss";

const { Title, Text, Paragraph } = Typography;

const seatLimit = 35;

const upcomingSemester = {
  name: "Fall 2025",
  startDate: "Sep 01, 2025",
  endDate: "Dec 31, 2025",
  registrationDeadline: "Aug 15, 2025",
  recommendedCredits: 20,
  maxCredits: 24,
  focus: "AI & Emerging Technologies",
};

const curatedCourses = [
  {
    id: "ai401",
    code: "AI401",
    name: "Artificial Intelligence",
    credits: 4,
    description:
      "Hands-on exploration of neural networks, deep learning workflows and responsible AI deployment.",
    tags: ["Major Core", "AI Lab"],
    difficulty: "Advanced",
    classes: [
      {
        id: "ai401-01",
        classCode: "AI401-01",
        teacher: "Dr. Lê Minh Quang",
        schedule: [
          { day: "Mon & Wed", time: "08:00 - 10:00", slot: "Slot 1" },
          { day: "Fri", time: "09:00 - 11:00", slot: "Lab Slot" },
        ],
        location: "Innovation Hub A4.05",
        seatsUsed: 28,
      },
      {
        id: "ai401-02",
        classCode: "AI401-02",
        teacher: "Dr. Lý Thu Thảo",
        schedule: [
          { day: "Tue & Thu", time: "13:00 - 15:00", slot: "Slot 4" },
        ],
        location: "AI Studio B2.12",
        seatsUsed: 34,
      },
    ],
  },
  {
    id: "ml501",
    code: "ML501",
    name: "Machine Learning Systems",
    credits: 4,
    description:
      "Design end-to-end ML pipelines with MLOps, model monitoring and production-ready deployments.",
    tags: ["Project", "Cloud Native"],
    difficulty: "Advanced",
    classes: [
      {
        id: "ml501-01",
        classCode: "ML501-01",
        teacher: "Ms. Đoàn Khánh An",
        schedule: [
          { day: "Mon & Thu", time: "15:00 - 17:00", slot: "Slot 6" },
        ],
        location: "Tech Lab C1.08",
        seatsUsed: 19,
      },
    ],
  },
  {
    id: "bc303",
    code: "BC303",
    name: "Blockchain Security",
    credits: 3,
    description:
      "Audit smart contracts, design secure consensus layers and simulate enterprise blockchain scenarios.",
    tags: ["Cybersecurity", "Industry"],
    difficulty: "Intermediate",
    classes: [
      {
        id: "bc303-01",
        classCode: "BC303-01",
        teacher: "Mr. Huỳnh Quốc Hải",
        schedule: [
          { day: "Tue", time: "08:00 - 11:00", slot: "Slot 2" },
        ],
        location: "Blockchain Studio D3.02",
        seatsUsed: 22,
      },
      {
        id: "bc303-02",
        classCode: "BC303-02",
        teacher: "Ms. Phạm Tú Uyên",
        schedule: [
          { day: "Fri", time: "13:30 - 16:30", slot: "Slot 5" },
        ],
        location: "Blockchain Studio D3.02",
        seatsUsed: 31,
      },
    ],
  },
  {
    id: "ux402",
    code: "UX402",
    name: "Intelligent Product Design",
    credits: 3,
    description:
      "Blend behavioral research, AI-enhanced prototyping and data storytelling for delightful digital products.",
    tags: ["Studio", "Design"],
    difficulty: "Intermediate",
    classes: [
      {
        id: "ux402-01",
        classCode: "UX402-01",
        teacher: "Ms. Nguyễn Thụy Vy",
        schedule: [
          { day: "Wed", time: "09:00 - 12:00", slot: "Slot 2" },
        ],
        location: "Creative Lab E1.01",
        seatsUsed: 15,
      },
    ],
  },
  {
    id: "ds501",
    code: "DS501",
    name: "Data Structures & Algorithms for Systems",
    credits: 4,
    description:
      "Master optimized data structures, graph processing and interview-grade algorithmic thinking.",
    tags: ["Essential", "Problem Solving"],
    difficulty: "Advanced",
    classes: [
      {
        id: "ds501-01",
        classCode: "DS501-01",
        teacher: "Mr. Trần Đức Khang",
        schedule: [
          { day: "Mon", time: "13:00 - 16:00", slot: "Slot 4" },
        ],
        location: "Auditorium F2.10",
        seatsUsed: 27,
      },
      {
        id: "ds501-02",
        classCode: "DS501-02",
        teacher: "Ms. Võ Khánh Linh",
        schedule: [
          { day: "Thu", time: "08:00 - 11:00", slot: "Slot 1" },
        ],
        location: "Auditorium F2.10",
        seatsUsed: 13,
      },
    ],
  },
];

const CourseRegistration: React.FC = () => {
  const [selectedCourseId, setSelectedCourseId] = useState(curatedCourses[0].id);
  const [isRegistering, setIsRegistering] = useState<string | null>(null);
  const [planMode, setPlanMode] = useState<"guided" | "custom">("guided");

  const selectedCourse = useMemo(
    () => curatedCourses.find((course) => course.id === selectedCourseId),
    [selectedCourseId]
  );

  const handleRegister = (classId: string) => {
    setIsRegistering(classId);
    setTimeout(() => {
      setIsRegistering(null);
      message.success("Registration request submitted! We'll notify you soon.");
    }, 1000);
  };

  return (
    <div className="course-registration-page">
      <div className="page-header">
        <Title level={2}>Plan Your Upcoming Semester</Title>
        <Paragraph>
          Curated subjects for {upcomingSemester.name}. Pick the classes that
          boost your portfolio, balance your weekly load and keep your GPA on
          track.
        </Paragraph>
      </div>

      <Card className="hero-card">
        <Row gutter={[32, 32]} align="middle">
          <Col xs={24} lg={15}>
            <Space direction="vertical" size={16}>
              <Text className="hero-eyebrow">Curated Plan</Text>
              <Title level={3} style={{ margin: 0 }}>
                {upcomingSemester.focus}
              </Title>
              <Paragraph className="hero-paragraph">
                5 recommended modules crafted with Career Services & Industry
                Mentors. Each class includes real project briefs, mentor hours
                and studio-grade facilities.
              </Paragraph>
              <Segmented
                value={planMode}
                onChange={(value) =>
                  setPlanMode(value as "guided" | "custom")
                }
                options={[
                  { label: "Guided Journey", value: "guided" },
                  { label: "Custom Mix", value: "custom" },
                ]}
                size="large"
              />
              <Space size="large" wrap>
                <div className="hero-stat">
                  <Text type="secondary">Credits Planned</Text>
                  <Title level={4} style={{ margin: 0 }}>
                    {upcomingSemester.recommendedCredits}/
                    {upcomingSemester.maxCredits}
                  </Title>
                </div>
                <div className="hero-stat">
                  <Text type="secondary">Registration Deadline</Text>
                  <Title level={4} style={{ margin: 0 }}>
                    {upcomingSemester.registrationDeadline}
                  </Title>
                </div>
                <div className="hero-stat">
                  <Text type="secondary">Semester Window</Text>
                  <Title level={4} style={{ margin: 0 }}>
                    {upcomingSemester.startDate} ↔ {upcomingSemester.endDate}
                  </Title>
                </div>
              </Space>
              <Space>
                <Button type="primary">Download Study Plan</Button>
                <Button>Ask Academic Advisor</Button>
              </Space>
            </Space>
          </Col>
          <Col xs={24} lg={9}>
            <div className="hero-panel">
              <div className="panel-row">
                <CalendarOutlined />
                <div>
                  <Text strong>Weekly Flow</Text>
                  <Paragraph type="secondary" style={{ margin: 0 }}>
                    Spread between morning labs and afternoon studios for better
                    recovery time.
                  </Paragraph>
                </div>
              </div>
              <Divider />
              <div className="panel-row">
                <ExperimentOutlined />
                <div>
                  <Text strong>Experience Blocks</Text>
                  <Paragraph type="secondary" style={{ margin: 0 }}>
                    Project, research and certification-ready topics aligned
                    with blockchain & AI roadmap.
                  </Paragraph>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={10}>
          <Card
            title="Recommended Subjects"
            className="course-list-card"
            extra={<Tag color="blue">5 modules</Tag>}
          >
            <Space direction="vertical" size={16} style={{ width: "100%" }}>
              {curatedCourses.map((course) => (
                <div
                  key={course.id}
                  className={`course-card ${
                    selectedCourseId === course.id ? "active" : ""
                  }`}
                  onClick={() => setSelectedCourseId(course.id)}
                >
                  <div className="course-card__header">
                    <Space size={8}>
                      <Text className="course-code">{course.code}</Text>
                      <Tag color="blue">{course.credits} credits</Tag>
                      <Tag color="geekblue">{course.difficulty}</Tag>
                    </Space>
                    <Tag color="purple">{course.tags[0]}</Tag>
                  </div>
                  <Title level={4}>{course.name}</Title>
                  <Paragraph type="secondary">{course.description}</Paragraph>
                  <Space size={[0, 8]} wrap>
                    {course.tags.map((tag) => (
                      <Tag key={tag} bordered={false} color="gold">
                        {tag}
                      </Tag>
                    ))}
                  </Space>
                </div>
              ))}
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={14}>
          <Card
            title={
              <Space>
                <Text strong>{selectedCourse?.name}</Text>
                <Tag color="green">{selectedCourse?.code}</Tag>
              </Space>
            }
            className="class-list-card"
            extra={
              <Text type="secondary">
                Select a class to register. Each class is capped at {seatLimit}{" "}
                students.
              </Text>
            }
          >
            {!selectedCourse ? (
              <Paragraph type="secondary">
                Select a course from the left panel to view available classes.
              </Paragraph>
            ) : (
              <Space direction="vertical" size={18} style={{ width: "100%" }}>
                {selectedCourse.classes.map((cls) => {
                  const seatsPercent = Math.round(
                    (cls.seatsUsed / seatLimit) * 100
                  );
                  const isFull = cls.seatsUsed >= seatLimit;
                  return (
                    <Badge.Ribbon
                      text={isFull ? "Waitlist" : "Open"}
                      color={isFull ? "volcano" : "cyan"}
                      key={cls.id}
                    >
                      <Card className="class-card">
                        <div className="class-card__header">
                          <div>
                            <Space size={8}>
                              <Text strong>{cls.classCode}</Text>
                              <Tag>{cls.teacher}</Tag>
                            </Space>
                            <Paragraph
                              type="secondary"
                              style={{ marginBottom: 0 }}
                            >
                              {cls.location}
                            </Paragraph>
                          </div>
                          <Button
                            type="primary"
                            disabled={isFull}
                            loading={isRegistering === cls.id}
                            onClick={() => handleRegister(cls.id)}
                          >
                            {isFull ? "Join Waitlist" : "Register"}
                          </Button>
                        </div>

                        <Divider />

                        <Row gutter={[16, 16]}>
                          <Col xs={24} md={12}>
                            <Space direction="vertical" size={8}>
                              {cls.schedule.map((slot) => (
                                <div className="schedule-row" key={slot.slot}>
                                  <FieldTimeOutlined />
                                  <div>
                                    <Text strong>{slot.day}</Text>
                                    <Paragraph
                                      type="secondary"
                                      style={{ margin: 0 }}
                                    >
                                      {slot.time} ({slot.slot})
                                    </Paragraph>
                                  </div>
                                </div>
                              ))}
                            </Space>
                          </Col>
                          <Col xs={24} md={12}>
                            <Space direction="vertical" size={8}>
                              <div className="schedule-row">
                                <TeamOutlined />
                                <div>
                                  <Text strong>Capacity</Text>
                                  <Paragraph
                                    type="secondary"
                                    style={{ margin: 0 }}
                                  >
                                    {cls.seatsUsed}/{seatLimit} students
                                  </Paragraph>
                                </div>
                              </div>
                              <Progress
                                percent={seatsPercent}
                                status={isFull ? "exception" : "active"}
                                format={() => `${seatLimit - cls.seatsUsed} left`}
                              />
                            </Space>
                          </Col>
                        </Row>
                      </Card>
                    </Badge.Ribbon>
                  );
                })}
              </Space>
            )}
          </Card>
        </Col>
      </Row>

      <Card className="tips-card">
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <div className="tip-item">
              <ClockCircleOutlined />
              <div>
                <Text strong>Balance your week</Text>
                <Paragraph type="secondary">
                  Mix morning labs with afternoon studios to keep energy consistent.
                </Paragraph>
              </div>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div className="tip-item">
              <CalendarOutlined />
              <div>
                <Text strong>Plan for deadlines</Text>
                <Paragraph type="secondary">
                  Check overlap between major project milestones before locking
                  classes.
                </Paragraph>
              </div>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div className="tip-item">
              <ExperimentOutlined />
              <div>
                <Text strong>Leverage studios</Text>
                <Paragraph type="secondary">
                  Many classes include dedicated mentor sessions—book them early!
                </Paragraph>
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default CourseRegistration;


