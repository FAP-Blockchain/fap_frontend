import api from "../../../config/axios";

// ========== TYPES ==========

export interface CertificateTemplateDto {
  id: string;
  name: string;
  description?: string;
  templateType?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // add more fields here if backend exposes them
}

export interface CreateCertificateTemplateRequest {
  name: string;
  description?: string;
  templateType?: string;
  // any other fields required by backend (e.g. fileUrl, content, etc.)
}

export interface UpdateCertificateTemplateRequest {
  name?: string;
  description?: string;
  templateType?: string;
  isActive?: boolean;
  // any other updatable fields
}

// ========== API FUNCTIONS ==========

// GET /api/certificate-templates - Get all templates (Admin)
export const getCertificateTemplatesApi = async (
  templateType?: string,
  includeInactive: boolean = false
): Promise<CertificateTemplateDto[]> => {
  const response = await api.get<CertificateTemplateDto[]>(
    "/certificate-templates",
    {
      params: {
        templateType,
        includeInactive,
      },
    }
  );
  return response.data;
};

// GET /api/certificate-templates/samples - Get sample templates (Public)
export const getSampleCertificateTemplatesApi = async (
  templateType?: string
): Promise<CertificateTemplateDto[]> => {
  const response = await api.get<CertificateTemplateDto[]>(
    "/certificate-templates/samples",
    {
      params: {
        templateType,
      },
    }
  );
  return response.data;
};

// GET /api/certificate-templates/{id} - Get template by ID (Admin)
export const getCertificateTemplateByIdApi = async (
  id: string
): Promise<CertificateTemplateDto> => {
  const response = await api.get<CertificateTemplateDto>(
    `/certificate-templates/${id}`
  );
  return response.data;
};

// POST /api/certificate-templates - Create new template (Admin)
export const createCertificateTemplateApi = async (
  payload: CreateCertificateTemplateRequest
): Promise<CertificateTemplateDto> => {
  const response = await api.post<CertificateTemplateDto>(
    "/certificate-templates",
    payload
  );
  return response.data;
};

// PUT /api/certificate-templates/{id} - Update template (Admin)
export const updateCertificateTemplateApi = async (
  id: string,
  payload: UpdateCertificateTemplateRequest
): Promise<CertificateTemplateDto> => {
  const response = await api.put<CertificateTemplateDto>(
    `/certificate-templates/${id}`,
    payload
  );
  return response.data;
};

// DELETE /api/certificate-templates/{id} - Delete template (Admin)
export const deleteCertificateTemplateApi = async (id: string): Promise<void> => {
  await api.delete(`/certificate-templates/${id}`);
};

// GET /api/certificate-templates/{id}/preview - Preview template with sample data (Admin)
export const previewCertificateTemplateApi = async (
  id: string
): Promise<Blob> => {
  const response = await api.get(`/certificate-templates/${id}/preview`, {
    responseType: "blob",
  });
  return response.data;
};
