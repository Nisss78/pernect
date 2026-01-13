import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

export function useResultHistoryData() {
  const results = useQuery(api.testResults.listByUser);

  return { results };
}

