// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
    Button,
    Card,
    Modal,
    Navbar
} from "@components/component";

beforeEach(() => {
    document.body.innerHTML = "";
});


describe("Button", () => {
    it("creates a button with the correct text and class", () => {
        const button = Button({
            text: "Click Me",
            className: "btn-primary"
        });

        expect(button.tagName).toBe("BUTTON");
        expect(button.textContent).toBe("Click Me");
        expect(button.className).toBe("btn btn-primary");
    });

    it("calls onClick when clicked", () => {
        const onClick = vi.fn();

        const button = Button({
            text: "Click Me",
            onClick
        });

        button.click();

        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("works without an onClick function", () => {
        const button = Button({
            text: "No Action"
        });

        expect(button.textContent).toBe("No Action");

        button.click();
    });
});


describe("Card", () => {
    it("creates a card with recipe information", () => {
        const card = Card({
            title: "Chicken Curry",
            description: "Indian curry",
            category: "Indian"
        });

        expect(card.tagName).toBe("ARTICLE");
        expect(card.className).toBe("card");
        expect(card.textContent).toContain("Chicken Curry");
        expect(card.textContent).toContain("Indian curry");
        expect(card.textContent).toContain("Indian");
    });

    it("adds interactive behavior when onClick is provided", () => {
        const onClick = vi.fn();

        const card = Card({
            title: "Sushi",
            description: "Japanese sushi",
            category: "Japanese",
            onClick
        });

        expect(card.classList.contains("card-interactive")).toBe(true);

        card.click();

        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("works without onClick", () => {
        const card = Card({
            title: "Burger",
            description: "American burger",
            category: "American"
        });

        expect(
            card.classList.contains("card-interactive")
        ).toBe(false);
    });
});


describe("Modal", () => {
    it("creates a modal with title and body", () => {
        const body = document.createElement("p");
        body.textContent = "Modal content";

        const onClose = vi.fn();

        const modal = Modal({
            title: "Test Modal",
            bodyNode: body,
            onClose
        });

        expect(modal.className).toBe("modal-overlay");
        expect(modal.textContent).toContain("Test Modal");
        expect(modal.textContent).toContain("Modal content");
        expect(
            modal.querySelector(".modal-dialog")
        ).toBeTruthy();
        expect(
            modal.querySelector(".modal-header")
        ).toBeTruthy();
        expect(
            modal.querySelector(".modal-body")
        ).toBeTruthy();
    });

    it("calls onClose when close button is clicked", () => {
        const body = document.createElement("p");

        const onClose = vi.fn();

        const modal = Modal({
            title: "Test Modal",
            bodyNode: body,
            onClose
        });

        const closeButton = modal.querySelector(".btn-close");
        if(!(closeButton instanceof HTMLElement)) return
        closeButton.click();

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("calls onClose when clicking outside the dialog", () => {
        const body = document.createElement("p");

        const onClose = vi.fn();

        const modal = Modal({
            title: "Test Modal",
            bodyNode: body,
            onClose
        });

        modal.dispatchEvent(
            new MouseEvent("click", {
                bubbles: true
            })
        );

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("does not close when clicking inside the dialog", () => {
        const body = document.createElement("p");

        const onClose = vi.fn();

        const modal = Modal({
            title: "Test Modal",
            bodyNode: body,
            onClose
        });

        const dialog = modal.querySelector(".modal-dialog");
        if(!(dialog instanceof Element)) return
        dialog.dispatchEvent(
            new MouseEvent("click", {
                bubbles: true
            })
        );

        expect(onClose).not.toHaveBeenCalled();
    });
});


describe("Navbar", () => {
    it("renders all navigation links", () => {
        const router = {
            navigate: vi.fn()
        };

        const nav = Navbar({ router });

        expect(nav.className).toBe("navbar");
        expect(nav.textContent).toContain("Recipe Browser");
        expect(nav.textContent).toContain("Home");
        expect(nav.textContent).toContain("Recipes");
        expect(nav.textContent).toContain("Settings");
    });

    it("navigates home when logo is clicked", () => {
        const router = {
            navigate: vi.fn()
        };

        const nav = Navbar({ router });

        const logo = nav.querySelector("a");
        if(!(logo instanceof Element)) return
        logo.click();

        expect(router.navigate).toHaveBeenCalledWith("/");
    });

    it("navigates home when Home is clicked", () => {
        const router = {
            navigate: vi.fn()
        };

        const nav = Navbar({ router });

        const links = nav.querySelectorAll("a");
        const homeLink = Array.from(links)
            .find(link => link.textContent === "Home");
        if(!(homeLink instanceof Element)) return
        homeLink.click();

        expect(router.navigate).toHaveBeenCalledWith("/");
    });

    it("navigates to recipes when Recipes is clicked", () => {
        const router = {
            navigate: vi.fn()
        };

        const nav = Navbar({ router });

        const links = nav.querySelectorAll("a");
        const recipesLink = Array.from(links)
            .find(link => link.textContent === "Recipes");
        if(!(recipesLink instanceof Element)) return
        recipesLink.click();

        expect(router.navigate).toHaveBeenCalledWith("/list");
    });

    it("navigates to settings when Settings is clicked", () => {
        const router = {
            navigate: vi.fn()
        };

        const nav = Navbar({ router });

        const links = nav.querySelectorAll("a");
        const settingsLink = Array.from(links)
            .find(link => link.textContent === "Settings");
        if(!(settingsLink instanceof Element)) return
        settingsLink.click();

        expect(router.navigate).toHaveBeenCalledWith("/settings");
    });
});