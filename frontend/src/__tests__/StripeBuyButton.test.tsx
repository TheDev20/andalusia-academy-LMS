import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import StripeBuyButton from "../components/ui/StripeBuyButton/StripeBuyButton";

const SCRIPT_SELECTOR = 'script[src="https://js.stripe.com/v3/buy-button.js"]';

describe("StripeBuyButton", () => {
  afterEach(() => {
    cleanup();
    document.head.querySelectorAll(SCRIPT_SELECTOR).forEach((script) => script.remove());
  });

  it("does not load Stripe's script until a button is shown", () => {
    expect(document.querySelector(SCRIPT_SELECTOR)).toBeNull();
  });

  it("loads Stripe's script once, however many buttons are shown", () => {
    const { rerender } = render(<StripeBuyButton clientReferenceId="order-1" />);
    render(<StripeBuyButton clientReferenceId="order-2" />);
    rerender(<StripeBuyButton clientReferenceId="order-1" />);

    const scripts = document.querySelectorAll(SCRIPT_SELECTOR);
    expect(scripts).toHaveLength(1);
    expect((scripts[0] as HTMLScriptElement).async).toBe(true);
  });

  it("passes the order id through as the client reference", () => {
    const { container } = render(<StripeBuyButton clientReferenceId="order-9" />);

    expect(container.querySelector("stripe-buy-button")?.getAttribute("client-reference-id")).toBe("order-9");
  });
});
