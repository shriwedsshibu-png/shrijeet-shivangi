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
  const [copied, setCopied] = useState(false);

  // 📝 EDIT YOUR PAYMENT DETAILS HERE:
  const yourUPIID = "shrijeet.singh@okaxis"; // <-- Replace this with your exact UPI ID string!
  const payeeName = "Shrijeet and Shivangi";    // <-- Your display name inside their bank apps

  // Automated string constructor making the smartphone app auto-launch link
  const upiDeepLink = `upi://pay?pa=${yourUPIID}&pn=${encodeURIComponent(payeeName)}&cu=INR`;

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(yourUPIID);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

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
    <main className="min-h-screen wedding-surface pt-24 pb-24 md:pt-28 md:pb-20">
      <div className="section-container max-w-6xl mx-auto px-4">
        
        {/* Page Top Heading */}
        <div className="text-center mb-10">
          <p className="eyebrow tracking-widest text-amber-700 uppercase font-semibold text-xs">Tokens of Love & Wishes</p>
          <h1 className="section-title text-3xl md:text-4xl font-bold font-display text-gray-900 mt-2">Blessings & Shagun</h1>
          <p className="section-subtitle text-gray-600 mt-2 max-w-xl mx-auto">
            Your love, presence, and blessings are the greatest gifts we could receive. If you wish to honor us with a token, choices are available below.
          </p>
        </div>

        {/* Split Screen Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* 💌 LEFT COLUMN: Digital Blessings Form */}
          <div className="w-full">
            <Card className="p-6 md:p-8 border border-amber-100/60 shadow-sm bg-white">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span>💌</span> Leave a Digital Blessing
              </h2>
              
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name</label>
                    <Input 
                      type="text" 
                      value={formData.name} 
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                      placeholder="Enter your full name" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Your Blessing</label>
                    <textarea 
                      value={formData.message} 
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })} 
                      className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 min-h-[150px] resize-none text-base" 
                      placeholder="Write your beautiful wishes or prayers for us here…" 
                      required 
                    />
                  </div>
                  
                  {errorMessage && (
                    <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm font-medium">
                      {errorMessage}
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="lg" 
                    disabled={loading} 
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 rounded-xl transition-all duration-300"
                  >
                    {loading ? 'Sending…' : 'Submit Blessing'}
                  </Button>
                </form>
              ) : (
                <div className="text-center py-6">
                  <div className="text-5xl mb-4">🙏</div>
                  <h3 className="font-display text-2xl font-bold text-gray-900">Blessing Received!</h3>
                  <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                    Thank you so much! Your heartfelt words have been saved and will remain a cherished memory for both of us forever.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)} 
                    className="mt-6 text-amber-700 font-semibold text-sm hover:underline hover:text-amber-800"
                  >
                    Write another blessing
                  </button>
                </div>
              )}
            </Card>
          </div>

          {/* 🪙 RIGHT COLUMN: Digital Shagun UPI QR Code & Instant Links */}
          <div className="w-full">
            <Card className="p-6 md:p-8 border border-amber-100/60 shadow-sm bg-white text-center">
              <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
                <span>✨</span> Digital Shagun
              </h2>
              <p className="text-xs text-amber-700 uppercase tracking-widest font-semibold mb-6">(Optional Box)</p>
              
              <div className="bg-amber-50/50 rounded-2xl p-5 border border-amber-100/40 max-w-sm mx-auto shadow-inner space-y-5">
                
                {/* ⚡ NEW FEATURE: Smartphone One-Click Deep Link Button */}
                <div className="block">
                  <a 
                    href={upiDeepLink}
                    className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all duration-300 transform active:scale-95 text-base w-full"
                  >
                    <span>📱</span> Pay via Any UPI App
                  </a>
                  <p className="text-[11px] text-gray-500 mt-1.5">Works perfectly when browsing directly on your mobile device!</p>
                </div>

                <div className="relative flex items-center justify-center">
                  <div className="border-t border-gray-200 w-full"></div>
                  <span className="absolute bg-amber-50/100 px-3 text-xs text-gray-400 font-medium">OR SCAN QR</span>
                </div>

                {/* QR Code Display Area */}
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm inline-block">
                  <img 
                    src="/images/qr-code.jpg" 
                    alt="Wedding Shagun UPI QR Code" 
                    className="w-48 h-48 mx-auto object-contain rounded-lg"
                    onError={(e) => {
                      e.target.onerror = null;
                      // Backs up with a dynamic QR generation pointing exactly to your specific user IDs
                      e.target.src = `https://qrserver.com{encodeURIComponent(upiDeepLink)}`; 
                    }}
                  />
                </div>

                {/* ⚡ NEW FEATURE: Visible UPI ID Text and Copy Mechanism */}
                <div className="bg-white rounded-xl p-3 border border-gray-100 flex items-center justify-between shadow-xs">
                  <div className="text-left pl-1">
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">UPI ID</p>
                    <p className="text-sm font-mono font-bold text-gray-700 select-all">{yourUPIID}</p>
                  </div>
                  <button 
                    onClick={handleCopyUPI}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                      copied 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {copied ? '✅ Copied!' : '📋 Copy'}
                  </button>
                </div>
                
              </div>

              {/* Massive Optional Shagun Text at Bottom */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-lg md:text-xl font-bold tracking-wide text-amber-800 uppercase font-display">
                  Shagun Box ♾️ Best Wishes
                </p>
                <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto leading-relaxed">
                  For your convenience, you can tap the green button, scan the QR code, or copy the UPI ID directly. Thank you for your kindness!
                </p>
              </div>
            </Card>
          </div>

        </div>
        
      </div>
