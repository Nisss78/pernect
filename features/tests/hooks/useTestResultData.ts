import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';

export function useTestResultData(resultId: Id<'testResults'>) {
  const resultData = useQuery(api.testResults.getById, { resultId });
  const isLastLoverTest = resultData?.test?.slug === 'last-lover';
  const lastLoverDetails = useQuery(
    api.lastLover.getResultDetails,
    isLastLoverTest && resultData?.resultType
      ? { typeCode: resultData.resultType }
      : 'skip'
  );

  return {
    isLastLoverTest,
    lastLoverDetails,
    resultData,
  };
}

