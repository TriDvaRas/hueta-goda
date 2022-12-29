import { HGApiError } from "../types/hg-api";

export function parseApiError(err: any): HGApiError {
    return typeof err.response?.data == 'object' ? err.response.data : { error: err.message || 'Unknown Error', status: +(err.status || 500) }
}