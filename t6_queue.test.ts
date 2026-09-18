import { describe, it, expect } from "vitest";
import { Queue } from "./t6_Queue";

describe("Queue<T>", () => {

    it("stores and retrieves strings", () => {
        const queue = new Queue<string>();

        queue.enqueue("hello");
        queue.enqueue("world");

        expect(queue.peek()).toBe("hello");
        expect(queue.dequeue()).toBe("hello");
        expect(queue.dequeue()).toBe("world");
        expect(queue.isEmpty()).toBe(true);
    });

    it("stores and retrieves numbers", () => {
        const queue = new Queue<number>();

        queue.enqueue(10);
        queue.enqueue(20);

        expect(queue.peek()).toBe(10);
        expect(queue.dequeue()).toBe(10);
        expect(queue.dequeue()).toBe(20);
        expect(queue.isEmpty()).toBe(true);
    });

    it("stores and retrieves objects", () => {
        type User = {
            id: number;
            name: string;
        };

        const queue = new Queue<User>();

        const user1: User = {
            id: 1,
            name: "Alice"
        };

        const user2: User = {
            id: 2,
            name: "Bob"
        };

        queue.enqueue(user1);
        queue.enqueue(user2);

        expect(queue.peek()).toEqual(user1);
        expect(queue.dequeue()).toEqual(user1);
        expect(queue.dequeue()).toEqual(user2);
        expect(queue.isEmpty()).toBe(true);
    });

    it("returns undefined when dequeuing an empty queue", () => {
        const queue = new Queue<number>();

        expect(queue.dequeue()).toBeUndefined();
        expect(queue.peek()).toBeUndefined();
        expect(queue.isEmpty()).toBe(true);
    });
});