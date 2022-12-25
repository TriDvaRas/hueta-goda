import { Session } from "next-auth";

export interface NextApiRequestWithSession extends NextApiRequest {
    session: Session
}
export interface HGApiError {
    error: string,
    status: number,
}
export interface PaginationQuery<T = {}> {
    pageSize?: number;
    page?: number;
    orderBy?: keyof T
    order?: 'asc' | 'desc'
    [key: string]: string
}
export type HGApiPaginationResponse<T> = {
    items: T,
    page: number,
    totalPages: number,
    totalItems: number,
} | HGApiError
export type HGApiItemResponse<T> = T | HGApiError | null
export type HGApiItemPostBody<T> = Partial<T>
export type HGApiItemPutBody<T> = Partial<T>