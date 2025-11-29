import api from "../../config/axios";
import type {
  CertificatePublicDto,
  StudentCredentialDto,
} from "../../types/Credential";

// Base URLs (relative to backend API base configured in axios instance)
const STUDENT_CREDENTIALS_URL = "/students/me/credentials";
const PUBLIC_CERTIFICATE_URL = "/credentials/public";
const VERIFY_CREDENTIAL_URL = "/credentials/verify";

// Request body type for public verify endpoint
// Backend expects either credentialNumber or verificationHash (or both optional)
export interface VerifyCredentialRequest {
  credentialNumber?: string;
  verificationHash?: string;
}

class CredentialServices {
  static async getMyCredentials(): Promise<StudentCredentialDto[]> {
    const response = await api.get<StudentCredentialDto[]>(
      STUDENT_CREDENTIALS_URL
    );
    return response.data;
  }

  /**
   * GET /api/credentials/public/{id}
   * Public certificate view (no auth) – used by CertificateVerifyDetail
   */
  static async getPublicCertificateById(
    id: string
  ): Promise<CertificatePublicDto> {
		const response = await api.get<CertificatePublicDto>(
			`${PUBLIC_CERTIFICATE_URL}/${id}`
		);
    return response.data;
  }

  /**
   * POST /api/credentials/verify
   * Generic verification endpoint – can verify by id or hash
   */
  static async verifyCredential(payload: VerifyCredentialRequest) {
    const response = await api.post(VERIFY_CREDENTIAL_URL, payload);
    return response.data;
  }
}

export default CredentialServices;

