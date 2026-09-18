import { describe, it, expect, vi, afterEach } from "vitest";
import { ApiClient } from "./t6_apiClient";
type User = {
    id: number;
    name: string;
}
describe("ApiClient", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("returns a typed response from fetch", async () => {
        type User = {
            id: number;
            name: string;
        };

        const mockUser: User = {
            id: 1,
            name: "Alice"
        };

        vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => mockUser
        } as Response);

        const client = new ApiClient();

        const result = await client.get<User>("/users/1");

        expect(result).toEqual(mockUser);
        expect(result.id).toBe(1);
        expect(result.name).toBe("Alice");
    });

    it("throws when the request fails", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: false,
            status: 404
        } as Response);

        const client = new ApiClient();

        await expect(
            client.get<User>("/users/1")
        ).rejects.toThrow("Request failed: 404");
    });
});