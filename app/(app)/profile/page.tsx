import { db } from "@/lib/db";
import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import { User, MapPin, Target, AlertTriangle, Activity, LogOut } from "lucide-react";
import Image from "next/image";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [dbUser, profile] = await Promise.all([
    db.user.findUnique({ where: { id: session.user.id } }),
    db.profile.findUnique({ where: { userId: session.user.id } })
  ]);

  if (!dbUser || !profile) return (
    <div className="flex flex-col items-center justify-center pt-32 px-4 space-y-4">
      <div className="bg-gray-100 p-4 rounded-full"><User size={32} className="text-gray-400"/></div>
      <p className="text-gray-500 font-medium text-center">No profile data found.<br/>Please generate a plan under Dashboard.</p>
    </div>
  );

  return (
    <div className="px-4 pt-10 pb-24 space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Your Profile</h1>
          <p className="text-sm text-gray-500">Manage identity and biometrics</p>
        </div>
        <form action={async () => {
          "use server";
          await signOut({ redirectTo: "/login" });
        }}>
          <button type="submit" className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors">
            <LogOut size={20} />
          </button>
        </form>
      </header>

      {/* Identity Card */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center space-x-4">
        {dbUser.image ? (
          <Image src={dbUser.image} alt="User Avatar" width={64} height={64} className="rounded-full bg-gray-100" />
        ) : (
          <div className="bg-green-100 p-4 rounded-full shrink-0">
            <User size={32} className="text-green-700" />
          </div>
        )}
        <div className="overflow-hidden">
          <h2 className="text-lg font-bold text-gray-900 truncate tracking-tight">{dbUser.name || "Anonymous User"}</h2>
          <p className="text-sm text-gray-500 truncate">{dbUser.email}</p>
        </div>
      </div>

      {/* Biometrics Card */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-6">
        
        {/* Goal */}
        <div className="flex items-start space-x-4 border-b border-gray-50 pb-5">
          <div className="bg-green-100 p-2.5 rounded-xl shrink-0">
            <Target size={20} className="text-green-700" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Primary Goal</p>
            <p className="text-gray-900 font-medium">{profile.goal?.replace('_', ' ') || "Not specified"}</p>
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
                <span className="text-sm font-medium text-gray-800">{profile.age} yrs, {profile.gender}</span>
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

        {/* Location / Activity */}
        <div className="flex items-start space-x-4 border-b border-gray-50 pb-5">
          <div className="bg-orange-100 p-2.5 rounded-xl shrink-0">
            <MapPin size={20} className="text-orange-700" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Activity Level</p>
            <p className="text-gray-900 font-medium capitalize">{profile.activityLevel?.replace('_', ' ').toLowerCase() || "Not specified"}</p>
          </div>
        </div>

        {/* Nutrition Constraints Note (If we add it to Prisma later) */}
        <div className="flex items-start space-x-4">
          <div className="bg-red-100 p-2.5 rounded-xl shrink-0">
            <AlertTriangle size={20} className="text-red-700" />
          </div>
          <div className="w-full">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Calculated Status</p>
            <div className="bg-red-50 text-red-900 p-3 flex rounded-xl border border-red-100 mt-2">
                <p className="text-sm font-medium leading-relaxed">
                  Basal Metabolic Rate mapping dictates <span className="font-bold">{profile.dailyCalories} kcal</span> daily constraint.
                </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
