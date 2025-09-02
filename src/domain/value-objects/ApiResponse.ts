export class ApiResponse<T> {
  success: boolean;
  message: string;
  data: T ;

  constructor({ success, message, data }: { success: boolean; message: string; data: T  }) {
    this.success = success;
    this.message = message;
    this.data = data;
  }

  // Chuyển JSON sang ApiResponse
  static fromJson<T>(json: any): ApiResponse<T> {
    if (!json) {
      throw new Error("ApiResponse.fromJson: json is undefined/null");
    }

    return new ApiResponse<T>({
      success: json.Success ?? json.success ?? false,
      message: json.Message ?? json.message ?? "",
      data: json.Data ?? json.data ?? null,
    });
  }

  // Kiểm tra thành công
  isSuccess(): boolean {
    return this.success === true;
  }

  // Factory method: thành công với dữ liệu
  static success<T>(data: T, message: string = "Thành công"): ApiResponse<T> {
    return new ApiResponse<T>({ success: true, message, data });
  }

}
