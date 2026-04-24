export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3030';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultOptions: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        ...options,
    };

    const response = await fetch(url, defaultOptions);
    const data = await response.json().catch(() => ({
        result: false,
        msg: 'Invalid or empty server response',
        data: []
    }));
    return data;
}
