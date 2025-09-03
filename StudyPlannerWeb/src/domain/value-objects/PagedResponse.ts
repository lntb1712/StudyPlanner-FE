export class PagedResponse<T> {
  data: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;

  constructor(data: T[] = [], currentPage: number = 1, totalPages: number = 1, totalItems: number = 0, pageSize: number = 0) {
    this.data = data;
    this.currentPage = currentPage;
    this.totalPages = totalPages;
    this.totalItems = totalItems;
    this.pageSize = pageSize;
  }

  static fromJson<U>(json: Record<string, any>, itemMapper: (item: any) => U): PagedResponse<U> {
    const response = new PagedResponse<U>();

    // Handle both camelCase and PascalCase for JSON keys
    const dataArray = json.Data ?? json.data ?? [];
    response.data = Array.isArray(dataArray) ? dataArray.map(itemMapper) : [];
    
    response.currentPage = Number(json.CurrentPage ?? json.currentPage ?? 1);
    response.totalPages = Number(json.TotalPages ?? json.totalPages ?? 1);
    response.totalItems = Number(json.TotalItems ?? json.totalItems ?? 0);
    response.pageSize = Number(json.PageSize ?? json.pageSize ?? dataArray.length);

    return response;
  }
}