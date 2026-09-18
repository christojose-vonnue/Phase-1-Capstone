export class ApiClient {
    /**
 * Fetches data from an API and returns it as the requested type.
 *
 * @typeParam T - The expected shape of the API response.
 * @param url - The API endpoint to request.
 * @returns A promise containing the response data typed as T.
 */
    async get<T>(url: string): Promise<T> {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Request failed: ${response.status}`);
        }

        return response.json() as Promise<T>;
    }
}