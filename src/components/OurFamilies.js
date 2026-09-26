import React from 'react';
import siteConfig from '../siteConfig';
import Card from './ui/Card';

function FamilyColumn({ title, members }) {
  return (
    <div>
      <h2 className="script-section-title text-center mb-8">{title}</h2>
      <div className="grid gap-4">
        {members.length > 0 ? members.map((member, index) => (
          <Card key={index} className="p-5 text-center">
            {/* Renders Relation and Name directly together on a single line */}
            <p className="text-base text-apple-gray-900 font-medium">
              <span className="text-amber-800 font-semibold">{member.relation || member.relationship}:</span> {member.name}
            </p>
          </Card>
        )) : (
          <Card className="p-7 text-center">
            <p className="text-apple-gray-600">Family details will be added here.</p>
          </Card>
        )}
      </div>
    </div>
  );
}

function OurFamilies() {
  const families = siteConfig.families || {};
  return (
    <main className="min-h-screen wedding-surface pt-28 pb-20">
      <div className="section-container">
        <div className="text-center mb-14">
          <p className="eyebrow">With love & blessings</p>
          <h1 className="section-title">{families.title}</h1>
          <p className="section-subtitle">{families.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
          <FamilyColumn title="Shrijeet's Family" members={families.shrijeet || []} />
          <FamilyColumn title="Shivangi's Family" members={families.shivangi || []} />
        </div>
      </div>
    </main>
  );
}

export default OurFamilies;
