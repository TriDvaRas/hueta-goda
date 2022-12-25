import { PaginationQuery } from "../types/hg-api";

export function getPrismaPaginationArgs<T>(query: PaginationQuery<T>, defaultOrderBy: keyof T) {
    const pageSize = query.pageSize || 10;
    const page = query.page || 1;
    const skip = (page - 1) * pageSize;
    const orderBy: { [key in keyof T]?: 'desc' | 'asc' } = {}
    orderBy[query.orderBy || defaultOrderBy] = query.order || 'desc'
    if (typeof page != 'number' || typeof skip != 'number')
        throw new Error('Invalid pagination parameters')
    else
        return {
            orderBy, skip, pageSize, page,
            prismaParams: {
                orderBy,
                skip,
                take: pageSize,
            }
        }
}