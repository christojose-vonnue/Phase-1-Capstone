export class ApiClient {
    async get<T>(url: string): Promise<T> {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Request failed: ${response.status}`);
        }

        return response.json() as Promise<T>;
    }
}