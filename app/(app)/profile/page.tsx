"use client";
import { useState, useEffect } from "react";
import { User, MapPin, Target, AlertTriangle, Activity } from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('nutri_userProfile');
      if (stored) setProfile(JSON.parse(stored));
    } catch {}
  }, []);

  if (!profile) return (
    <div className="flex flex-col items-center justify-center pt-32 px-4 space-y-4">
      <div className="bg-gray-100 p-4 rounded-full"><User size={32} className="text-gray-400"/></div>
      <p className="text-gray-500 font-medium text-center">No profile data found.<br/>Please generate a plan under Dashboard.</p>
    </div>
  );

  return (
    <div className="px-4 pt-10 pb-24 space-y-8 animate-in fade-in duration-500">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Your Profile</h1>
        <p className="text-sm text-gray-500">Personalized biometrics and goals</p>
      </header>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-6">
        
        {/* Goal */}
        <div className="flex items-start space-x-4 border-b border-gray-50 pb-5">
          <div className="bg-green-100 p-2.5 rounded-xl shrink-0">
            <Target size={20} className="text-green-700" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Primary Goal</p>
            <p className="text-gray-900 font-medium">{profile.goal || "Not specified"}</p>
          </div>
        </div>

        {/* Biometrics */}
        <div className="flex items-start space-x-4 border-b border-gray-50 pb-5">
          <div className="bg-blue-100 p-2.5 rounded-xl shrink-0">
            <Activity size={20} className="text-blue-700" />
          </div>
          <div className="w-full">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Biometrics</p>
            <div className="grid grid-cols-2 gap-y-3 gap-x-2">
              <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
                <User size={14} className="text-gray-500"/>
                <span className="text-sm font-medium text-gray-800">{profile.age} yrs, {profile.sex}</span>
              </div>
              <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
                <span className="text-gray-500 text-xs font-bold w-[14px] text-center shrink-0">H</span>
                <span className="text-sm font-medium text-gray-800">{profile.height} cm</span>
              </div>
              <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg border border-gray-100 col-span-2">
                <span className="text-gray-500 text-xs font-bold w-[14px] text-center shrink-0">W</span>
                <span className="text-sm font-medium text-gray-800">{profile.weight} kg</span>
              </div>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-start space-x-4 border-b border-gray-50 pb-5">
          <div className="bg-orange-100 p-2.5 rounded-xl shrink-0">
            <MapPin size={20} className="text-orange-700" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Region</p>
            <p className="text-gray-900 font-medium">{profile.region || "Not specified"}</p>
          </div>
        </div>

        {/* Restrictions */}
        <div className="flex items-start space-x-4">
          <div className="bg-red-100 p-2.5 rounded-xl shrink-0">
            <AlertTriangle size={20} className="text-red-700" />
          </div>
          <div className="w-full">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Dietary Constraints</p>
            {profile.restrictions ? (
              <div className="bg-red-50 text-red-900 p-3 flex rounded-xl border border-red-100 mt-2">
                  <p className="text-sm font-medium leading-relaxed">{profile.restrictions}</p>
              </div>
            ) : (
              <p className="text-gray-400 text-sm italic mt-1">None specified</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
