export class ApiResponse {
  success: boolean;
  message: string;
  data: any;

  constructor({ success, message, data }: { success: boolean; message: string; data: any }) {
    this.success = success
    this.message = message
    this.data = data
  }

  static fromJson(json: any) {
  if (!json) {
    throw new Error("ApiResponse.fromJson: json is undefined/null");
  }

  return new ApiResponse({
    success: json.Success ?? json.success ?? false,
    message: json.Message ?? json.message ?? "",
    data: json.Data ?? json.data ?? null,
  });
}


  isSuccess() {
    return this.success === true
  }
}
