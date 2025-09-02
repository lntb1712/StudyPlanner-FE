export class PagedResponse<T> {
  data: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;

  constructor() {
    this.data = [];
    this.currentPage = 0;
    this.totalPages = 0;
    this.totalItems = 0;
    this.pageSize = 0;
  }

  // Map JSON từ API sang PagedResponse
  static fromJson<U>(json: any, itemMapper: (item: any) => U): PagedResponse<U> {
    const response = new PagedResponse<U>();

    // Hỗ trợ cả camelCase và PascalCase
    const dataArray = json.Data ?? json.data ?? [];
    response.data = Array.isArray(dataArray) ? dataArray.map(itemMapper) : [];

    response.currentPage = json.CurrentPage ?? json.currentPage ?? 1;
    response.totalPages = json.TotalPages ?? json.totalPages ?? 1;
    response.totalItems = json.TotalItems ?? json.totalItems ?? 0;
    response.pageSize = json.PageSize ?? json.pageSize ?? dataArray.length;

    return response;
  }
}
