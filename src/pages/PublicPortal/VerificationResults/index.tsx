import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
	Alert,
	Badge,
	Button,
	Card,
	Col,
	Divider,
	Modal,
	Row,
	Space,
	Spin,
	Tag,
	Tooltip,
	Typography,
} from "antd";
import {
	ArrowLeftOutlined,
	CalendarOutlined,
	DownloadOutlined,
	SafetyCertificateOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import CredentialServices from "../../../services/credential/api.service";
import type { CertificatePublicDto } from "../../../types/Credential";
import { QRCode } from "antd";
import "./VerificationResults.scss";

const { Title, Text, Paragraph } = Typography;

const certificateLabels: Record<string, string> = {
	SubjectCompletion: "Chứng chỉ hoàn thành môn học",
	SemesterCompletion: "Chứng chỉ hoàn thành học kỳ",
	RoadmapCompletion: "Chứng chỉ hoàn thành lộ trình",
};

const VerificationResults: React.FC = () => {
	const { credentialId } = useParams<{ credentialId: string }>();
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const [certificate, setCertificate] =
		useState<CertificatePublicDto | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [showQRModal, setShowQRModal] = useState(false);

	useEffect(() => {
		const fetchDetail = async () => {
			if (!credentialId) {
				setError("Thiếu mã chứng chỉ");
				setIsLoading(false);
				return;
			}

			setIsLoading(true);
			setError(null);
			try {
				const data = await CredentialServices.getPublicCertificateById(
					credentialId
				);
				setCertificate(data as CertificatePublicDto);
				// Nếu cần có thể gọi thêm verifyCredential với query param ở đây
				// const credentialNumber = searchParams.get("credentialNumber") || credentialId;
				// const verificationHash = searchParams.get("verificationHash") || undefined;
				// void CredentialServices.verifyCredential({ credentialNumber, verificationHash });
			} catch (err) {
				const messageText =
					((err as {
						response?: { data?: { message?: string } };
						message?: string;
					})?.response?.data?.message ||
					(err as { message?: string }).message ||
					"Không thể tải dữ liệu chứng chỉ");
				setError(messageText);
			} finally {
				setIsLoading(false);
			}
		};

		void fetchDetail();
	}, [credentialId, searchParams]);

	const certificateTitle = useMemo(() => {
		if (!certificate) return "";
		return (
			certificate.subjectName ||
			certificate.roadmapName ||
			certificateLabels[certificate.certificateType] ||
			certificate.certificateType
		);
	}, [certificate]);

	const formattedIssuedDate = certificate?.issueDate
		? dayjs(certificate.issueDate).format("DD MMMM, YYYY")
		: "—";

	const handleDownloadPdf = () => {
		// TODO: tích hợp API tải PDF public nếu backend hỗ trợ
	};

	if (isLoading) {
		return (
			<div className="verification-results-page">
				<Spin size="large" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="verification-results-page">
				<Alert
					type="error"
					message="Không thể xác thực chứng chỉ"
					description={error}
					showIcon
					action={
						<Button
							type="primary"
							onClick={() => navigate("/public-portal/verify")}
						>
							Quay lại cổng xác thực
						</Button>
					}
				/>
			</div>
		);
	}

	if (!certificate) {
		return (
			<div className="verification-results-page">
				<Alert
					message="Không tìm thấy chứng chỉ hoặc chứng chỉ không hợp lệ"
					type="warning"
					showIcon
				/>
			</div>
		);
	}

	const displayName = certificate.studentName || "—";

	return (
		<div className="verification-results-page">
			<div className="results-header">
				<Button
					icon={<ArrowLeftOutlined />}
					onClick={() => navigate("/public-portal/verify")}
				>
					Quay lại cổng xác thực
				</Button>
				<Button
					icon={<DownloadOutlined />}
					onClick={handleDownloadPdf}
				>
					Tải chứng chỉ PDF
				</Button>
			</div>

			<Row gutter={[24, 24]}>
				<Col xs={24} lg={12}>
					<Card className="result-card" bordered={false}>
						<Space direction="vertical" size={12} style={{ width: "100%" }}>
							<Space>
								<SafetyCertificateOutlined
									style={{ fontSize: 32, color: "#1a94fc" }}
								/>
								<div>
									<Text type="secondary">
										{certificateLabels[certificate.certificateType] ||
												"Chứng chỉ"}
									</Text>
									<Title level={3} style={{ margin: 0 }}>
										{certificateTitle}
									</Title>
								</div>
							</Space>

							<Paragraph type="secondary" style={{ marginBottom: 0 }}>
								Chứng chỉ điện tử đã được xác thực bởi UAP Blockchain. Thông tin dưới
								dây được truy xuất trực tiếp từ hệ thống và không thể bị chỉnh sửa.
							</Paragraph>

							<Divider />

							<Space direction="vertical" size={12} style={{ width: "100%" }}>
								<div className="info-row">
									<span>Họ và tên</span>
									<span className="strong-text">{displayName}</span>
								</div>
								<div className="info-row">
									<span>Mã chứng chỉ</span>
									<Tag color="blue">{certificate.id}</Tag>
								</div>
								<div className="info-row">
									<span>Ngày cấp</span>
									<span>
										<CalendarOutlined style={{ marginRight: 6 }} />
										{formattedIssuedDate}
									</span>
								</div>
								{certificate.letterGrade && (
									<div className="info-row">
										<span>Điểm trung bình</span>
										<Tag color="gold">{certificate.letterGrade}</Tag>
									</div>
								)}
								<div className="info-row">
									<span>Trạng thái</span>
									<Tag color={certificate.status === "Issued" ? "green" : "orange"}>
										{certificate.status}
									</Tag>
								</div>
								{certificate.semesterName && (
									<div className="info-row">
										<span>Học kỳ</span>
										<span>{certificate.semesterName}</span>
									</div>
								)}
								{certificate.credentialHash && (
									<div className="info-row">
										<span>Hash xác thực</span>
										<Tooltip title={certificate.credentialHash}>
											<Text code>{certificate.credentialHash.slice(0, 12)}...</Text>
										</Tooltip>
									</div>
								)}
							</Space>
						</Space>
					</Card>
				</Col>

				<Col xs={24} lg={12}>
					<Card bordered={false} className="certificate-preview-card">
						<div className="certificate-preview">
							<div className="certificate-header">
								<div className="issuer-block">
									<Text className="issuer-name">UAP Blockchain</Text>
									<Text className="certificate-type">
										{certificateLabels[certificate.certificateType] ||
												"Chứng chỉ"}
									</Text>
								</div>
								<Badge
									count="Đã xác thực on-chain"
									style={{ backgroundColor: "#1a94fc" }}
								/>
							</div>

							<div className="certificate-body">
								<Text className="caption">CHỨNG NHẬN RẰNG</Text>
								<Title level={1} className="recipient">
									{displayName}
								</Title>
								<Paragraph className="description">
									đã hoàn thành chương trình học
								</Paragraph>
								<Title level={2} className="program">
									{certificateTitle}
								</Title>
								<Paragraph className="details">
									Cấp ngày {formattedIssuedDate} · Mã sinh viên {certificate.studentCode}
								</Paragraph>
							</div>

							<div className="certificate-footer">
								<div className="signature-block">
									<div className="signature" />
									<Text>Phòng Đào tạo</Text>
								</div>
								<div className="seal">FAP</div>
							</div>
						</div>
					</Card>
				</Col>
			</Row>

			<Modal
				open={showQRModal}
				title="QR xác thực chứng chỉ"
				footer={null}
				onCancel={() => setShowQRModal(false)}
			>
				<div style={{ textAlign: "center", padding: 20 }}>
					<QRCode value={window.location.href} size={200} />
					<Paragraph style={{ marginTop: 16 }}>
						Quét mã QR này để truy cập lại trang xác thực.
					</Paragraph>
				</div>
			</Modal>
		</div>
	);
};

export default VerificationResults;
