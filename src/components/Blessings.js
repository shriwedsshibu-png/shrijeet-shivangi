import React, { useState } from 'react';
import siteConfig from '../siteConfig';
import Card from './ui/Card';
import Input from './ui/Input';
import Button from './ui/Button';

function Blessings() {
  const [formData, setFormData] = useState({ name: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.message.trim()) {
      setErrorMessage('Please enter your name and blessing.');
      return;
    }
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await fetch('/.netlify/functions/submit-blessings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || 'Something went wrong.');
      setSubmitted(true);
      setFormData({ name: '', message: '' });
    } catch (error) {
      setErrorMessage(error.message || 'Unable to send your blessing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen wedding-surface pt-28 pb-20">
      <div className="section-container max-w-3xl">
        <div className="text-center mb-12">
          <p className="eyebrow">Words we will keep forever</p>
          <h1 className="section-title">{siteConfig.blessings.title}</h1>
          <p className="section-subtitle">{siteConfig.blessings.subtitle}</p>
        </div>

        <Card className="p-7 md:p-10">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-apple-gray-800 mb-2">Your Name</label>
                <Input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Your name" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-apple-gray-800 mb-2">Your Blessing</label>
                <textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="input-apple min-h-[160px] resize-none" placeholder="Write your blessing or good wishes for us…" required />
              </div>
              {errorMessage && <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm">{errorMessage}</div>}
              <Button type="submit" variant="primary" size="lg" disabled={loading} className="w-full">{loading ? 'Sending…' : 'Leave a Blessing'}</Button>
            </form>
          ) : (
            <div className="text-center py-8">
              <div className="text-5xl mb-5">🙏</div>
              <h2 className="font-display text-3xl font-semibold text-apple-gray-900">Thank you.</h2>
              <p className="text-apple-gray-600 mt-3">Your words and blessings will be a part of our memories.</p>
              <button onClick={() => setSubmitted(false)} className="mt-6 text-maroon font-semibold hover:underline">Leave another blessing</button>
            </div>
          )}
        </Card>
      </div>
    </main>
  );
}

export default Blessings;
