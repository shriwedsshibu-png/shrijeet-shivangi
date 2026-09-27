import React from 'react';
import siteConfig from '../siteConfig';
import Countdown from './ui/Countdown';

function HomePage() {
  const wedding = siteConfig.wedding || {};

  return (
    <main className="min-h-screen pb-24 bg-neutral-50">
      
      {/* 1. Hero Banner Area */}
      <section 
        className="relative h-[80vh] flex items-center justify-center text-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/our-image.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/45 z-0" />
        <div className="relative max-w-4xl mx-auto text-white px-4 z-10">
          <p className="text-xs uppercase tracking-widest font-semibold text-amber-300 mb-3">Save The Date</p>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-8xl text-white font-extrabold tracking-wide mb-4 text-center leading-tight">
            Shivangi and Shrijeet
          </h1>
          <p className="max-w-xl mx-auto text-sm md:text-base opacity-90 leading-relaxed font-light mb-8">
            With the blessings of our families, we invite you to celebrate, share and be a part of our special moments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <span className="text-sm font-medium tracking-wide border border-white/30 px-4 py-2 rounded-full backdrop-blur-sm">
              📅 Dec 3, 2026 — 03:00 AM
            </span>
            <span className="text-sm font-medium tracking-wide border border-white/30 px-4 py-2 rounded-full backdrop-blur-sm max-w-[280px] truncate">
              📍 Aarif Seaside Resort, Visakhapatnam
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
        
        {/* COLUMN 1: Detailed RSVP & Logistics Interface */}
        <div className="text-center">
          <div className="mb-4">
            <p className="text-xs uppercase tracking-widest font-semibold text-amber-800 mb-1">Attendance and Logistics</p>
            <h3 className="font-serif text-3xl text-gray-900">Kindly Confirm RSVP</h3>
          </div>

          <div className="w-full max-w-xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 p-6 text-left">
            <form className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase">Your Full Name</label>
                <input type="text" className="w-full p-3 bg-neutral-50 border border-gray-200 rounded-xl mt-1 text-sm text-gray-900 focus:outline-none" placeholder="Enter your name" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase">Email Address</label>
                <input type="email" className="w-full p-3 bg-neutral-50 border border-gray-200 rounded-xl mt-1 text-sm text-gray-900 focus:outline-none" placeholder="name@example.com" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase">Attendance</label>
                <select className="w-full p-3 bg-neutral-50 border border-gray-200 rounded-xl mt-1 text-sm text-gray-900 focus:outline-none">
                  <option value="yes">Joyfully Accept</option>
                  <option value="no">Regretfully Decline</option>
                </select>
              </div>
              
              <div className="space-y-4 border-t border-gray-100 pt-4">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-600 uppercase">Total Guests</label>
                    <input type="number" min="1" defaultValue="1" className="w-full p-2.5 bg-neutral-50 border border-gray-200 rounded-xl mt-1 text-sm text-center" required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-green-700 uppercase">Veg Count</label>
                    <input type="number" min="0" defaultValue="0" className="w-full p-2.5 bg-neutral-50 border border-gray-200 rounded-xl mt-1 text-sm text-center" required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-red-700 uppercase">Non-Veg</label>
                    <input type="number" min="0" defaultValue="0" className="w-full p-2.5 bg-neutral-50 border border-gray-200 rounded-xl mt-1 text-sm text-center" required />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase">Cab / Pickup Assistance</label>
                  <select className="w-full p-3 bg-neutral-50 border border-gray-200 rounded-xl mt-1 text-sm text-gray-900 focus:outline-none">
                    <option value="none">No assistance needed (Arranging own transit)</option>
                    <option value="airport_vtz">Pickup: Visakhapatnam Airport (VTZ)</option>
                    <option value="railway_vskp">Pickup: Visakhapatnam Station (VSKP)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase">Preferred Room Allotment</label>
                  <select className="w-full p-3 bg-neutral-50 border border-gray-200 rounded-xl mt-1 text-sm text-gray-900 focus:outline-none">
                    <option value="resort_stay">Main Resort (Aarif Seaside Resort)</option>
                    <option value="bungalow_stay">Family Bungalow Venue</option>
                    <option value="not_needed">Accommodation not required</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase">Check-Out Date and Time</label>
                  <input type="text" className="w-full p-3 bg-neutral-50 border border-gray-200 rounded-xl mt-1 text-sm text-gray-900 focus:outline-none" placeholder="e.g. 4th Dec, 11:00 AM" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase">Travel Details or Notes</label>
                  <textarea rows="2" className="w-full p-3 bg-neutral-50 border border-gray-200 rounded-xl mt-1 text-sm text-gray-900 focus:outline-none resize-none" placeholder="Provide flight/train timings..." />
                </div>
              </div>

              <div className="pt-2">
                <button type="submit" className="w-full bg-amber-800 text-white font-medium py-3 rounded-xl text-sm hover:bg-amber-900 transition-colors shadow-sm">
                  Confirm RSVP
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* COLUMN 2: Photo Uploader & AI Guidelines */}
        <div className="text-center">
          <div className="mb-4">
            <p className="text-xs uppercase tracking-widest font-semibold text-maroon mb-1">Capture The Memories</p>
            <h3 className="font-serif text-3xl text-gray-900">Share Your Moments</h3>
          </div>

          <div className="w-full max-w-xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 p-6 text-left">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase">Select Celebration Event</label>
                <select className="w-full p-3 bg-neutral-50 border border-gray-200 rounded-xl mt-1 text-sm text-gray-900 focus:outline-none">
                  <option value="Faldaan">Faldaan Ceremony</option>
                  <option value="Mehndi">Mehndi Morning</option>
                  <option value="Sangeet">Engagement and Sangeet Night</option>
                  <option value="Haldi">Haldi Rituals</option>
                  <option value="Wedding">Main Varmaala and Wedding Ceremony</option>
                </select>
              </div>
              <div className="border-2 border-dashed border-gray-200 bg-neutral-50 rounded-2xl p-6 text-center transition-all">
                <p className="text-4xl mb-2">📸</p>
                <p className="text-xs text-gray-700 font-medium">Drag and drop your snapshots here or</p>
                <label className="inline-block mt-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-lg cursor-pointer transition-colors">
                  Browse Files
                  <input type="file" multiple className="hidden" accept="image/*" />
                </label>
              </div>
              <div className="bg-amber-50/60 border border-amber-100 rounded-xl p-3 text-center">
                <p className="text-[11px] text-amber-900 leading-relaxed font-medium">
                  ✨ <strong>AI Smart Sort:</strong> Upload a clear selfie first, and our background facial-recognition software will organize the gallery to show you your photos!
                </p>
              </div>
              <button type="button" className="w-full bg-maroon text-white font-medium py-3 rounded-xl text-sm hover:bg-maroon/90 transition-colors shadow-sm">
                Upload Selected Images
              </button>
