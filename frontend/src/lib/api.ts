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

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.msg || 'Something went wrong');
    }

    return response.json();
}
