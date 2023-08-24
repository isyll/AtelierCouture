export type Response = { [key: string]: any };

export interface Pagination {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
}

export interface PaginationResponse<T> {
    data: Array<T>;
    pagination: Pagination;
}

export interface DataResponse<T> {
    data: Array<T>;
    message?: string;
    success?: boolean;
}
