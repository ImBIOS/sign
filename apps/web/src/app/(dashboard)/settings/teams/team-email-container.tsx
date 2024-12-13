'use client';

import { AnimatePresence } from 'framer-motion';

import { trpc } from '@documenso/trpc/react';
import { AnimateGenericFadeInOut } from '@documenso/ui/components/animate/animate-generic-fade-in-out';

import { TeamEmailUsage } from './team-email-usage';

export const TeamEmailContainer = () => {
  const { data: teamEmail } = trpc.team.getTeamEmailByEmail.useQuery();

  return (
    <AnimatePresence>
      {teamEmail && (
        <AnimateGenericFadeInOut>
          <TeamEmailUsage teamEmail={teamEmail} />
        </AnimateGenericFadeInOut>
      )}
    </AnimatePresence>
  );
};
