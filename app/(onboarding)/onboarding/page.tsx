"use client";
import { useState } from 'react';
import WelcomeScreen from '@/components/onboarding/WelcomeScreen';
import StepForm from '@/components/onboarding/StepForm';

export default function OnboardingPage() {
  const [started, setStarted] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50/50 selection:bg-green-100">
      <div className="w-full max-w-md mx-auto h-screen relative flex flex-col p-6 bg-white shadow-2xl shadow-gray-200/50">
        {!started ? (
          <WelcomeScreen onStart={() => setStarted(true)} />
        ) : (
          <div className="flex-1 w-full flex flex-col pt-8">
            <StepForm />
          </div>
        )}
      </div>
    </div>
  );
}
