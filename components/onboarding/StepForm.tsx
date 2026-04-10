"use client";
import { useState, useEffect } from 'react';
import RegionSelector from './RegionSelector';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function StepForm() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const router = useRouter();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  // Unified State containing 4-step biometric captures
  const [formData, setFormData] = useState({
    goal: '',
    age: '',
    sex: 'Male',
    height: '',
    weight: '',
    activityLevel: 'Sedentary',
    region: 'Metro Manila (NCR)',
    restrictions: ''
  });

  const handleNext = () => {
    setError(null);
    if (step === 1 && !formData.goal) {
      setError("Please select a primary goal to continue.");
      return;
    }
    if (step === 2 && (!formData.age || !formData.height || !formData.weight)) {
      setError("Please enter your age, height, and weight to calculate an accurate daily calorie target.");
      return;
    }
    if (step < 4) setStep(step + 1);
  };

  const handleComplete = async () => {
    setLoading(true);
    setError(null);
    try {
      // Calculate native TDEE and Target before sending
      let bmr = 0;
      const w = parseFloat(formData.weight);
      const h = parseFloat(formData.height);
      const a = parseInt(formData.age);
      if(formData.sex === 'Male') {
         bmr = (10 * w) + (6.25 * h) - (5 * a) + 5;
      } else {
         bmr = (10 * w) + (6.25 * h) - (5 * a) - 161;
      }
      
      let multiplier = 1.2;
      if(formData.activityLevel === 'Lightly Active') multiplier = 1.375;
      if(formData.activityLevel === 'Moderately Active') multiplier = 1.55;
      if(formData.activityLevel === 'Very Active') multiplier = 1.725;
      
      let tdee = bmr * multiplier;
      if(formData.goal === 'Lose Weight') tdee -= 500;
      if(formData.goal === 'Gain Weight' || formData.goal === 'Build Muscle') tdee += 300;
      
      const targetCalories = Math.round(tdee);
      const finalPayload = { ...formData, targetCalories };

      const res = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalPayload)
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("API Error Response:", res.status, errorText);
        
        const combinedError = `${res.status} ${errorText}`;
        if (combinedError.includes("429")) {
          throw new Error("API quota exceeded. Please wait a minute and try again, or wait until tomorrow if your daily limit is exhausted.");
        } else if (combinedError.includes("503")) {
          throw new Error("Gemini servers are busy. Please wait 30 seconds and try again.");
        } else if (combinedError.includes("500")) {
          throw new Error("Server error. Check the terminal logs for details.");
        } else {
          try {
            const jsonErr = JSON.parse(errorText);
            throw new Error(jsonErr.error || jsonErr.message || errorText);
          } catch {
            throw new Error(errorText || "Failed to generate your personalized AI plan.");
          }
        }
      }
      
      const payload = await res.json();
      
      // Save directly to Neon Database overriding the LocalStorage
      const { saveOnboardingData } = await import("@/actions/user.actions");
      await saveOnboardingData(finalPayload, payload);

      router.push('/dashboard');
      
    } catch (err: unknown) {
      console.error("Full request error:", err);
      const originalErr = err instanceof Error ? err.message : String(err);
      let errorMsg = originalErr || 'Something went wrong. Please try again.';
      let cooldownTime = 10;
      
      if (originalErr.includes("429")) {
        errorMsg = "API quota exceeded. Please wait a minute and try again, or wait until tomorrow if your daily limit is exhausted.";
        const match = originalErr.match(/retry in ([\d\.]+)s/i);
        if (match && match[1]) {
          cooldownTime = Math.ceil(parseFloat(match[1]));
        } else {
          cooldownTime = 60;
        }
      } else if (originalErr.includes("503")) {
        errorMsg = "Gemini servers are busy. Please wait 30 seconds and try again.";
        cooldownTime = 30;
      } else if (originalErr.includes("500")) {
        errorMsg = "Server error. Check the terminal logs for details.";
      }
      
      setError(errorMsg);
      setCooldown(cooldownTime);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex space-x-2 w-full justify-center mb-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i <= step ? 'w-10 bg-green-500' : 'w-4 bg-gray-200'}`} />
        ))}
      </div>

      <div className="flex-1">
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">What&apos;s your primary goal?</h2>
            <div className="space-y-3">
              {['Lose Weight', 'Maintain Weight', 'Gain Weight', 'Build Muscle'].map(goal => (
                <button 
                  key={goal} 
                  onClick={() => setFormData({...formData, goal})}
                  className={`w-full text-left px-5 py-4 rounded-xl border transition-all font-medium focus:outline-none focus:ring-1 focus:ring-green-500 ${formData.goal === goal ? 'border-green-500 bg-green-50 text-green-900' : 'border-gray-200 bg-white hover:border-green-500 text-gray-800 shadow-sm'}`}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Your Biometrics</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Age</label>
                  <input type="number" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} placeholder="Years" className="w-full h-12 rounded-xl border border-gray-200 px-4 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Sex</label>
                  <select value={formData.sex} onChange={e => setFormData({...formData, sex: e.target.value})} className="w-full h-12 rounded-xl border border-gray-200 px-4 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors bg-white">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Height</label>
                  <input type="number" value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})} placeholder="cm" className="w-full h-12 rounded-xl border border-gray-200 px-4 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Weight</label>
                  <input type="number" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} placeholder="kg" className="w-full h-12 rounded-xl border border-gray-200 px-4 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors" />
                </div>
                <div className="space-y-1.5 col-span-2">
                  <label className="text-sm font-semibold text-gray-700">Activity Level</label>
                  <select value={formData.activityLevel} onChange={e => setFormData({...formData, activityLevel: e.target.value})} className="w-full h-12 rounded-xl border border-gray-200 px-4 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors bg-white">
                    <option value="Sedentary">Sedentary (Little to no exercise)</option>
                    <option value="Lightly Active">Lightly Active (1-3 days/week)</option>
                    <option value="Moderately Active">Moderately Active (3-5 days/week)</option>
                    <option value="Very Active">Very Active (6-7 days/week)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Where are you located?</h2>
              <p className="text-sm text-gray-500 mt-1">We tailor grocery availability based on your localized markets.</p>
            </div>
            <div className="pt-2" onChange={() => {}}>
              <RegionSelector />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Any dietary constraints?</h2>
            
            <div className="flex flex-wrap gap-2">
              {['None', 'Vegetarian', 'Vegan', 'Halal', 'No Pork', 'No Beef', 'Peanut Allergy'].map(preset => (
                <button
                  key={preset}
                  onClick={() => {
                    if (preset === 'None') {
                      setFormData({...formData, restrictions: ''});
                    } else {
                      const current = formData.restrictions;
                      // Avoid duplicating the same preset if they click it multiple times
                      if (current.includes(preset)) return;
                      const newRes = current ? `${current}, ${preset}` : preset;
                      setFormData({...formData, restrictions: newRes});
                    }
                  }}
                  className="px-3 py-1.5 text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-700 hover:border-green-500 hover:bg-green-50 transition-colors focus:outline-none focus:ring-1 focus:ring-green-500 shadow-sm"
                >
                  {preset === 'None' ? 'None (Clear)' : `+ ${preset}`}
                </button>
              ))}
            </div>

            <textarea 
              value={formData.restrictions}
              onChange={e => setFormData({...formData, restrictions: e.target.value})}
              placeholder="e.g. No shrimp, peanut allergy, vegetarian, lactose intolerant..."
              className="w-full h-32 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:border-green-500 focus:ring-green-500 resize-none text-gray-800 shadow-sm placeholder:text-gray-400 font-medium transition-colors"
            />
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-xl border border-red-100 shadow-sm animate-in fade-in mb-4">
           <p className="text-sm font-medium text-red-800">{error}</p>
        </div>
      )}

      <button 
        onClick={step === 4 ? handleComplete : handleNext}
        disabled={loading || (step === 4 && cooldown > 0)}
        className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 active:scale-[0.98] transition-all shadow-md focus:outline-none flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? (
           <><Loader2 className="mr-2 h-5 w-5 animate-spin"/> Generating AI Plan...</>
        ) : (
           step === 4 ? (cooldown > 0 ? `Try again in ${cooldown}s` : "Generate My Plan") : "Continue"
        )}
      </button>
    </div>
  );
}
