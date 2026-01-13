import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

export function useTestScreenData(testSlug: string) {
  const testData = useQuery(api.tests.getWithQuestions, { slug: testSlug });
  const existingProgress = useQuery(
    api.testAnswers.getProgress,
    testData?.test ? { testId: testData.test._id } : 'skip'
  );

  return {
    existingProgress,
    testData,
  };
}

