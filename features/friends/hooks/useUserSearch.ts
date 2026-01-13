import { useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";

export function useUserSearch() {
  const [searchUserId, setSearchUserId] = useState<string | null>(null);

  const searchResult = useQuery(
    api.friendships.searchByUserId,
    searchUserId ? { userId: searchUserId } : "skip"
  );

  const searchUser = (userId: string) => {
    setSearchUserId(userId);
  };

  const clearSearch = () => {
    setSearchUserId(null);
  };

  return {
    searchUser,
    clearSearch,
    searchResult: searchUserId ? searchResult : undefined,
    isSearching: searchUserId !== null && searchResult === undefined,
  };
}
