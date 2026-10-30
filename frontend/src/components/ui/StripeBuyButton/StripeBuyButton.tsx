const STRIPE_BUY_BUTTON_ID = "buy_btn_1UWOY1DOaPJthnPU6l8sbL2T";
const STRIPE_PUBLISHABLE_KEY =
  "pk_test_51UWAEHDOaPJthnPUJ3YTvVw8NCLBsXCV3rj69wEiLavtkD6Lt4kmbCkPj54mIuW74vwFr6raE3o95xNe26KsASRg00YUb3cray";

export default function StripeBuyButton() {
  return (
    <stripe-buy-button
      buy-button-id={STRIPE_BUY_BUTTON_ID}
      publishable-key={STRIPE_PUBLISHABLE_KEY}
    />
  );
}
