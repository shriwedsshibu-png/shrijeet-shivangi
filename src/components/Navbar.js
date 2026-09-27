import React from 'react';
import { Heart, Home, Image, Calendar, MessageSquare } from 'lucide-react'; // Installs standard icons safely

const Navbar = ({ activeTab, setActiveTab }) => {
  // Navigation tabs definition
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'story', label: 'Our Story', icon: Heart },
    { id: 'events', label: 'Events & RSVP', icon: Calendar },
    { id: 'gallery', label: 'Gallery', icon: Image },
    { id: 'blessings', label: 'Blessings & Shagun', icon: MessageSquare },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* 🌟 Floating Top Branding Pill */}
      <div className="flex justify-center mb-2">
        <div className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full shadow-md border border-amber-100 flex items-center space-x-2 animate-bounce-slow">
          <span className="text-xs font-semibold tracking-widest text-amber-700 uppercase">
            Shrijeet ♾️ Shivangi
          </span>
        </div>
      </div>

      {/* 📱 Main Bottom Navigation Bar */}
      {/* pb-8 (Padding Bottom) lifts the entire bar safely above the Netlify floating badge */}
      <nav className="bg-white/95 backdrop-blur-md border-t border-amber-100 shadow-xl px-4 pt-3 pb-8 md:pb-4">
        <div className="max-w-md mx-auto flex justify-between items-center">
          {navItems.map((item) => {
            const IconElement = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="flex flex-col items-center flex-1 justify-center transition-all duration-300 relative group"
              >
                {/* Visual Active Anchor Indicator */}
                {isActive && (
                  <span className="absolute -top-3 w-1.5 h-1.5 bg-amber-600 rounded-full" />
                )}

                {/* 🌟 Bigger Icons (w-8 h-8) for easy physical tapping on mobile devices */}
                <IconElement
                  className={`w-8 h-8 stroke-[1.5] transition-transform duration-300 group-hover:scale-110 ${
                    isActive 
                      ? 'text-amber-600 fill-amber-50' 
                      : 'text-gray-400 group-hover:text-amber-500'
                  }`}
                />

                {/* Scannable Micro Text Labels */}
                <span
                  className={`text-[10px] font-medium mt-1 tracking-tight transition-colors duration-300 ${
                    isActive ? 'text-amber-700 font-semibold' : 'text-gray-500'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
