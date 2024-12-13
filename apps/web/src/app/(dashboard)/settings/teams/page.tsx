import { headers } from 'next/headers';

import { extractNextHeaderRequestMetadata } from '@documenso/lib/universal/extract-request-metadata';

import { SettingsHeader } from '~/components/(dashboard)/settings/layout/header';
import { CreateTeamDialog } from '~/components/(teams)/dialogs/create-team-dialog';
import { UserSettingsTeamsPageDataTable } from '~/components/(teams)/tables/user-settings-teams-page-data-table';

import { TeamEmailContainer } from './team-email-container';
import { TeamInvitations } from './team-invitations';

export default function TeamsSettingsPage() {
  const requestHeaders = Object.fromEntries(headers().entries());

  const requestMetadata = extractNextHeaderRequestMetadata(requestHeaders);

  return (
    <div>
      <SettingsHeader title="Teams" subtitle="Manage all teams you are currently associated with.">
        <CreateTeamDialog requestMetadata={requestMetadata} />
      </SettingsHeader>

      <UserSettingsTeamsPageDataTable />

      <div className="mt-8 space-y-8">
        <TeamEmailContainer />

        <TeamInvitations />
      </div>
    </div>
  );
}
