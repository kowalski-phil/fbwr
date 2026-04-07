'use client';

import PageShell from '@/components/layout/PageShell';
import ProfileCard from '@/components/dashboard/ProfileCard';
import StreakDisplay from '@/components/dashboard/StreakDisplay';
import QuickActions from '@/components/dashboard/QuickActions';
import RecentActivity from '@/components/dashboard/RecentActivity';
import XPGainToast from '@/components/gamification/XPGainToast';
import LevelUpModal from '@/components/gamification/LevelUpModal';

export default function Home() {
  return (
    <PageShell>
      <div className="space-y-4">
        <h1 className="text-xl font-bold text-navy">Hey Felix! 👋</h1>
        <ProfileCard />
        <StreakDisplay />
        <QuickActions />
        <RecentActivity />
      </div>
      <XPGainToast />
      <LevelUpModal />
    </PageShell>
  );
}
