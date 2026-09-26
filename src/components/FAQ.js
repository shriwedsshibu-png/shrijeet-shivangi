import React from 'react';
import siteConfig from '../siteConfig';
import Accordion from './ui/Accordion';

function FAQ() {
  const questions = siteConfig.faq?.questions || [];
  return (
    <main className="min-h-screen wedding-surface pt-28 pb-20">
      <div className="section-container max-w-3xl">
        <div className="text-center mb-12">
          <p className="eyebrow">Good to know</p>
          <h1 className="section-title">{siteConfig.faq.title}</h1>
          <p className="section-subtitle">{siteConfig.faq.subtitle}</p>
        </div>
        <Accordion items={questions} />
      </div>
    </main>
  );
}

export default FAQ;
