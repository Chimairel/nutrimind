"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Scale, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { updateBiometricWeight } from "@/actions/biometric.actions";

export default function UpdateWeightModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [weight, setWeight] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedWeight = parseFloat(weight);

    if (!parsedWeight || parsedWeight < 20 || parsedWeight > 400) {
      toast.error("Please enter a valid realistic weight in kg.");
      return;
    }

    setLoading(true);
    const result = await updateBiometricWeight(parsedWeight);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(`Weight updated! Daily target adjusted to ${result.targetCalories} kcal.`);
      setIsOpen(false);
      setWeight("");
    }
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        variant="outline" 
        className="w-full flex items-center justify-center gap-2 border-green-200 text-green-800 hover:bg-green-50 hover:text-green-900 bg-green-50/50"
      >
        <Scale size={16} />
        Log New Weight
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Scale size={18} className="text-green-600" />
                Update Biometrics
              </h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Current Weight (kg)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 70.5"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  disabled={loading}
                  className="h-12 text-lg text-center font-semibold focus-visible:ring-green-500"
                  autoFocus
                />
                <p className="text-xs text-gray-500 text-center">
                  Your daily calorie and macro targets will be recalculated instantly.
                </p>
              </div>

              <Button
                type="submit"
                disabled={loading || !weight}
                className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-medium shadow-sm transition-all"
              >
                {loading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                ) : (
                  "Save & Recalculate"
                )}
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
