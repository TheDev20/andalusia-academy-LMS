/// <reference types="vite/client" />

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
