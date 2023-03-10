import { Session } from "next-auth";
import { globalConfig } from '../util/globalConfig';

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
} 
export type HGApiItemResponse<T> = T | HGApiError | null
export type HGApiItemPostBody<T> = Partial<T>
export type HGApiItemPutBody<T> = Partial<T>

export interface NominationExtra {
    type: typeof globalConfig.nominationExtraTypes
    required?: boolean
    question?: string
}