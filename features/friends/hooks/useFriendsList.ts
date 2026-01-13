import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

export function useFriendsList() {
  const friends = useQuery(api.friendships.listFriends) ?? [];
  const friendsCount = useQuery(api.friendships.getFriendsCount);
  const removeFriendMutation = useMutation(api.friendships.removeFriend);

  const [isRemoving, setIsRemoving] = useState<Id<"users"> | null>(null);

  const removeFriend = async (friendId: Id<"users">) => {
    try {
      setIsRemoving(friendId);
      await removeFriendMutation({ friendId });
      return { success: true };
    } catch (error) {
      console.error("友達解除に失敗しました:", error);
      return { success: false, error };
    } finally {
      setIsRemoving(null);
    }
  };

  return {
    friends,
    friendsCount: friendsCount?.friendsCount ?? 0,
    pendingCount: friendsCount?.pendingCount ?? 0,
    isLoading: friends === undefined,
    removeFriend,
    isRemoving,
  };
}
