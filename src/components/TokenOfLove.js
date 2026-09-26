import React from 'react';
import siteConfig from '../siteConfig';
import Card from './ui/Card';
import Button from './ui/Button';

function TokenOfLove() {
  const gift = siteConfig.tokenOfLove || {};
  return (
    <main className="min-h-screen wedding-surface pt-28 pb-20">
      <div className="section-container max-w-4xl">
        <div className="text-center mb-12">
          <p className="eyebrow">A little gesture, from the heart</p>
          <h1 className="section-title">{gift.title}</h1>
          <p className="section-subtitle">{gift.subtitle}</p>
        </div>

        <Card className="p-8 md:p-12 text-center max-w-2xl mx-auto">
          <div className="text-5xl mb-6">💝</div>
          <p className="text-lg md:text-xl text-apple-gray-700 leading-relaxed mb-8">{gift.message}</p>

          {gift.upiQrImage ? (
            <div className="mb-8">
              <img src={gift.upiQrImage} alt="UPI QR code" className="w-56 h-56 mx-auto rounded-2xl border border-apple-gray-200 p-3 bg-white" />
              <p className="mt-4 font-medium text-apple-gray-900">Scan to send a shagun</p>
              {gift.upiId && <p className="text-sm text-apple-gray-600 mt-1">UPI: {gift.upiId}</p>}
            </div>
          ) : (
            <div className="mb-8 p-5 rounded-2xl bg-apple-gray-100 text-apple-gray-700">
              <p className="font-medium">UPI QR will be added here.</p>
              <p className="text-sm mt-1">The payment details can be added once you are ready.</p>
            </div>
          )}

          {gift.amazonGiftCardUrl && (
            <a href={gift.amazonGiftCardUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" size="lg">Amazon Pay Gift Card</Button>
            </a>
          )}

          <p className="text-xs text-apple-gray-500 mt-6">Completely optional — your presence and blessings mean the most to us.</p>
        </Card>
      </div>
    </main>
  );
}

export default TokenOfLove;
