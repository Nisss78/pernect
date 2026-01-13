import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

export function useResultComparisonData(testSlug: string) {
  const data = useQuery(api.testResults.getByTestAndUser, { testSlug });

  return { data };
}

