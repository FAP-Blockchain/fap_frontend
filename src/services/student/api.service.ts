import api from "../../config/axios";
import type {
  WeeklyScheduleDto,
  WeeklyScheduleResponse,
} from "../../types/Schedule";
import type { Student, StudentDetailDto } from "../../types/Student";

class StudentServices {
  /**
   * Get current student profile (me)
   * Endpoint: GET /api/Students/me
   * Requires: Student role
   */
  static async getCurrentStudentProfile(): Promise<StudentDetailDto> {
    const response = await api.get<StudentDetailDto>("/Students/me");
    return response.data;
  }

  /**
   * Get student by ID
   * Endpoint: GET /api/Students/{id}
   */
  static async getStudentById(id: string): Promise<Student> {
    const response = await api.get<Student>(`/Students/${id}`);
    return response.data;
  }

  /**
   * Get current student's weekly schedule
   * Endpoint: GET /api/students/me/schedule
   */
  static async getMyWeeklySchedule(
    weekStartDate?: string
  ): Promise<WeeklyScheduleDto> {
    const response = await api.get<WeeklyScheduleResponse>(
      "/students/me/schedule",
      {
        params: weekStartDate ? { weekStartDate } : undefined,
      }
    );

    if (!response.data.success) {
      throw new Error(
        response.data.message || "Không thể lấy thời khóa biểu tuần."
      );
    }

    return response.data.data;
  }
}

export default StudentServices;
