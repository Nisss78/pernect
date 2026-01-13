import { useQuery } from 'convex/react';
import { useMemo } from 'react';
import { api } from '../../../convex/_generated/api';

export function useHomeData() {
  const popularTests = useQuery(api.tests.getPopular, { limit: 5 });
  const recommendedTests = useQuery(api.tests.getRecommended, { limit: 4 });
  const allTests = useQuery(api.tests.list, {});
  const inProgress = useQuery(api.testAnswers.listInProgress, {});

  const recentTests = useMemo(() => {
    if (!allTests) return undefined;
    return [...allTests].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)).slice(0, 4);
  }, [allTests]);

  return {
    allTests,
    inProgress,
    popularTests,
    recommendedTests,
    recentTests,
  };
}

