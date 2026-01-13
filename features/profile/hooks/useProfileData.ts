import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

export function useProfileData() {
  const currentUser = useQuery(api.users.current);
  const results = useQuery(api.testResults.listByUser, {});
  const inProgress = useQuery(api.testAnswers.listInProgress, {});
  const big5Latest = useQuery(api.testResults.getLatest, { testSlug: 'big5' });

  return {
    currentUser,
    results,
    inProgress,
    big5Latest,
  };
}

