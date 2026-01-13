import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

export function useTestListData() {
  const tests = useQuery(api.tests.list, {});
  const inProgressTests = useQuery(api.testAnswers.listInProgress, {});
  const completedResults = useQuery(api.testResults.listByUser, {});

  return {
    tests,
    inProgressTests,
    completedResults,
  };
}

