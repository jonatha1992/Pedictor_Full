// src/components/FAQs.jsx
import React from "react";

const FAQs = () => {
  const faqs = [
    {
      question: "How does the app work?",
      answer: "Our app uses AI to predict roulette outcomes.",
    },
    {
      question: "Is there a free trial?",
      answer: "Yes, we offer a 7-day free trial.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards.",
    },
  ];

  return (
    <section id="faq" className="py-20 bg-gray-100">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center text-primary mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="p-4 bg-white rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-2">{faq.question}</h3>
              <p>{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQs;
