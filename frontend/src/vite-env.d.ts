/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STRIPE_BUY_BUTTON_ID?: string;
  readonly VITE_STRIPE_PUBLISHABLE_KEY?: string;
}

declare namespace React {
  namespace JSX {
    interface IntrinsicElements {
      "stripe-buy-button": {
        "buy-button-id": string;
        "publishable-key": string;
        "client-reference-id"?: string;
      };
    }
  }
}
