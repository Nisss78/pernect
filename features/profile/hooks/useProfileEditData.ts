import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

export function useProfileEditData() {
  const currentUser = useQuery(api.users.current);

  return { currentUser };
}

