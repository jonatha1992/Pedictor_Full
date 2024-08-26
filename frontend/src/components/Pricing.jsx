// src/components/Pricing.jsx
import React from "react";

const Pricing = () => {
  const plans = [
    {
      name: "Basic",
      price: "$10/month",
      features: ["Feature 1", "Feature 2", "Feature 3"],
    },
    {
      name: "Pro",
      price: "$20/month",
      features: ["Feature 1", "Feature 2", "Feature 3"],
    },
    {
      name: "Enterprise",
      price: "$30/month",
      features: ["Feature 1", "Feature 2", "Feature 3"],
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold text-primary mb-8">Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div key={index} className="p-6 bg-gray-100 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-4 text-primary">
                {plan.name}
              </h3>
              <p className="text-4xl font-bold mb-4 text-secondary">
                {plan.price}
              </p>
              <ul className="mb-4">
                {plan.features.map((feature, i) => (
                  <li key={i} className="mb-2 text-accent">
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="bg-primary text-white px-4 py-2 rounded-full font-bold hover:bg-accent">
                Choose Plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
