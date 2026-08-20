import React from "react";
import "../pages/page-shared.scss";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started with basic mood detection",
    features: [
      "Basic mood detection",
      "5 songs per day",
      "Standard audio quality",
      "Ad-supported experience",
    ],
    accent: "rgba(255, 255, 255, 0.15)",
    current: true,
  },
  {
    name: "Premium",
    price: "$9.99",
    period: "/month",
    description: "Unlock the full Moodify experience",
    features: [
      "Advanced mood detection",
      "Unlimited songs",
      "High-quality audio",
      "Ad-free experience",
      "Offline downloads",
      "Personalized playlists",
    ],
    accent: "#dd4200",
    featured: true,
  },
  {
    name: "Pro",
    price: "$19.99",
    period: "/month",
    description: "For music professionals and creators",
    features: [
      "Everything in Premium",
      "API access",
      "Custom mood profiles",
      "Priority support",
      "Creator tools",
      "Analytics dashboard",
    ],
    accent: "#8b5cf6",
  },
];

const Subscription = () => {
  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Subscription</h1>
        <p className="page__subtitle">
          Choose the plan that fits your music journey.
        </p>
      </div>

      <div className="plans-grid">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`plan-card ${plan.featured ? "plan-card--featured" : ""}`}
          >
            {plan.featured && (
              <div className="plan-card__badge">Most Popular</div>
            )}
            {plan.current && (
              <div className="plan-card__badge plan-card__badge--current">Current Plan</div>
            )}

            <h3 className="plan-card__name">{plan.name}</h3>

            <div className="plan-card__price">
              <span className="plan-card__amount">{plan.price}</span>
              <span className="plan-card__period">{plan.period}</span>
            </div>

            <p className="plan-card__desc">{plan.description}</p>

            <ul className="plan-card__features">
              {plan.features.map((feature) => (
                <li key={feature} className="plan-card__feature">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                    <polyline points="20,6 9,17 4,12" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              className={`plan-card__btn ${plan.featured ? "plan-card__btn--primary" : ""}`}
              disabled
            >
              {plan.current ? "Current Plan" : plan.featured ? "Get Premium" : "Coming Soon"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subscription;
