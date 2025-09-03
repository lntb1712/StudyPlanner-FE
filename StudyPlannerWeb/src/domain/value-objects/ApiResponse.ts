/**
 * A generic class to represent an API response with success status, message, and data.
 */
export class ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;

  /**
   * Constructs an ApiResponse instance.
   */
  constructor({ success, message, data }: { success: boolean; message: string; data: T | null }) {
    this.success = success;
    this.message = message;
    this.data = data;
  }

  /**
   * Creates an ApiResponse from a JSON object.
   */
  static fromJson<T>(json: Record<string, any>): ApiResponse<T> {
    return new ApiResponse<T>({
      success: json.success ?? json.Success ?? false,
      message: json.message ?? json.Message ?? "",
      data: (json.data ?? json.Data ?? null) as T | null,
    });
  }

  /**
   * Checks if the API response indicates success.
   */
  isSuccess(): boolean {
    return this.success === true;
  }

  /**
   * Factory method to create a successful ApiResponse.
   */
  static success<T>(data: T, message = "Thành công"): ApiResponse<T> {
    return new ApiResponse<T>({ success: true, message, data });
  }

  /**
   * Factory method to create a failed ApiResponse.
   */
  static error<T>(message = "Thất bại", data: T | null = null): ApiResponse<T> {
    return new ApiResponse<T>({ success: false, message, data });
  }
}