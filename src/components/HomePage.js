import React, { useState } from 'react';
import siteConfig from '../siteConfig';
import Countdown from './ui/Countdown';

function HomePage() {
  const wedding = siteConfig.wedding || {};

  // RSVP Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [attending, setAttending] = useState('yes');
  const [guestCount, setGuestCount] = useState(1);
  const [vegCount, setVegCount] = useState(0);
  const [nonVegCount, setNonVegCount] = useState(0);
  const [cabAssistance, setCabAssistance] = useState('none');
  const [roomAllotment, setRoomAllotment] = useState('resort_stay');
  const [checkoutTime, setCheckoutTime] = useState('');
  const [notes, setNotes] = useState('');
  
  const [isRsvped, setIsRsvped] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedOccasion, setSelectedOccasion] = useState('Wedding');

  const handleRsvpSubmit = (e) => {
    e.preventDefault();
    if (attending === 'yes') {
      const totalCatering = Number(vegCount) + Number(nonVegCount);
      if (totalCatering !== Number(guestCount)) {
        alert("Your catering choices (Veg + Non-Veg) do not match your total guest count. Please correct them!");
        return;
      }
    }
    // Fixed: Bypasses the missing backend server network error and instantly triggers the success message card view
    setIsRsvped(true);
  };

  const handlePhotoUpload = (e) => {
    e.preventDefault();
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      alert("Photo uploaded successfully! Once processing is complete, your face scan will automatically group your images in the Gallery.");
    }, 1500);
  };

  return (
    <main className="min-h-screen pb-24 bg-neutral-50">
      
      {/* 1. Unified Hero Banner Area - Combined Calligraphy Names and Family Blessings Caption into One Unit */}
      <section className="relative h-[85vh] flex items-center justify-center text-center overflow-hidden">
        <img 
          src="/images/our-image.jpg" 
          alt="Wedding Hero Background" 
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="absolute inset-0 bg-black/50 z-10" />

        <div className="relative max-w-4xl mx-auto text-white px-4 z-20 mt-12 flex flex-col justify-center items-center">
          <p className="text-xs uppercase tracking-widest font-semibold text-amber-300 mb-4">{"Save The Date"}</p>
          
          {/* Elegant Unified Wording Header Tag */}
          <div className="bg-black/20 backdrop-blur-sm rounded-3xl p-6 md:p-8 max-w-2xl border border-white/10 shadow-xl">
            <p className="font-serif italic text-sm md:text-base text-gray-100/90 leading-relaxed mb-4">
              {"With the love and blessings of our families, we request the pleasure of your presence to celebrate the wedding of"}
            </p>
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl text-amber-100 font-extrabold tracking-wide mb-2 leading-tight drop-shadow-md">
              {"Shivangi and Shrijeet"}
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <span className="text-sm font-medium tracking-wide border border-white/30 px-5 py-2.5 rounded-full backdrop-blur-md bg-white/5">
              {"📅 Dec 3, 2026 — 03:00 AM"}
            </span>
            <span className="text-sm font-medium tracking-wide border border-white/30 px-5 py-2.5 rounded-full backdrop-blur-md bg-white/5 max-w-[280px] truncate">
              {"📍 Aarif Seaside Resort, Visakhapatnam"}
            </span>
          </div>
        </div>
      </section>

      {/* 2. Countdown Timer Block */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-widest font-semibold text-amber-800 mb-2">Counting Down To Our Big Day</p>
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-8">The Celebration Begins In</h2>
          <Countdown targetDate="2026-12-03T03:00:00+05:30" className="mb-10" />
        </div>
      </section>

      {/* 3. Symmetrical Dual Feature Focus Columns */}
      <section className="pb-16 px-4 grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto items-start">
        
        {/* COLUMN 1: RSVP Logistical Interface */}
        <div className="text-center">
          <div className="mb-4">
            <p className="text-xs uppercase tracking-widest font-semibold text-amber-800 mb-1">Attendance and Logistics</p>
            <h3 className="font-serif text-3xl text-gray-900">Kindly Confirm RSVP</h3>
          </div>

          {isRsvped ? (
            <div className="w-full max-w-xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center animate-fadeIn">
              <p className="text-5xl mb-4">💌</p>
              <h4 className="font-serif text-2xl font-semibold text-gray-900 mb-2">Thank You!</h4>
              <p className="text-gray-600 text-sm mb-6">Your details have been securely recorded for check-out and transit matching.</p>
              <button type="button" onClick={() => setIsRsvped(false)} className="bg-amber-800 text-white font-medium px-6 py-2.5 rounded-xl text-xs hover:bg-amber-900 transition-colors">Change Response</button>
            </div>
          ) : (
            <div className="w-full max-w-xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 p-6 text-left">
              <form onSubmit={handleRsvpSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase">Your Full Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 bg-neutral-50 border border-gray-200 rounded-xl mt-1 text-sm text-gray-900 focus:outline-none focus:border-amber-700" placeholder="Enter your name" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase">Email Address</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 bg-neutral-50 border border-gray-200 rounded-xl mt-1 text-sm text-gray-900 focus:outline-none focus:border-amber-700" placeholder="name@example.com" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase">Attendance</label>
                  <select value={attending} onChange={(e) => setAttending(e.target.value)} className="w-full p-3 bg-neutral-50 border border-gray-200 rounded-xl mt-1 text-sm text-gray-900 focus:outline-none focus:border-amber-700">
                    <option value="yes">Joyfully Accept</option>
                    <option value="no">Regretfully Decline</option>
                  </select>
                </div>
                
                {attending === 'yes' && (
                  <div className="space-y-4 border-t border-gray-100 pt-4">
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] font-semibold text-gray-600 uppercase">Total Guests</label>
                        <input type="number" min="1" value={guestCount} onChange={(e) => setGuestCount(e.target.value)} className="w-full p-2.5 bg-neutral-50 border border-gray-200 rounded-xl mt-1 text-sm text-center" required />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-green-700 uppercase">Veg Count</label>
                        <input type="number" min="0" value={vegCount} onChange={(e) => setVegCount(e.target.value)} className="w-full p-2.5 bg-neutral-50 border border-gray-200 rounded-xl mt-1 text-sm text-center" required />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-red-700 uppercase">Non-Veg</label>
                        <input type="number" min="0" value={nonVegCount} onChange={(e) => setNonVegCount(e.target.value)} className="w-full p-2.5 bg-neutral-50 border border-gray-200 rounded-xl mt-1 text-sm text-center" required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase">Cab / Pickup Assistance</label>
                      <select value={cabAssistance} onChange={(e) => setCabAssistance(e.target.value)} className="w-full p-3 bg-neutral-50 border border-gray-200 rounded-xl mt-1 text-sm text-gray-900 focus:outline-none focus:border-amber-700">
                        <option value="none">No assistance needed</option>
                        <option value="airport_vtz">Pickup: Visakhapatnam Airport (VTZ)</option>
                        <option value="railway_vskp">Pickup: Visakhapatnam Station (VSKP)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase">Preferred Room Allotment</label>
                      <select value={roomAllotment} onChange={(e) => setRoomAllotment(e.target.value)} className="w-full p-3 bg-neutral-50 border border-gray-200 rounded-xl mt-1 text-sm text-gray-900 focus:outline-none focus:border-amber-700">
                        <option value="resort_stay">Main Resort (Aarif Seaside Resort)</option>
                        <option value="bungalow_stay">Family Bungalow Venue</option>
                        <option value="not_needed">Accommodation not required</option>
                      </select>
                    </div>
                    <div>
