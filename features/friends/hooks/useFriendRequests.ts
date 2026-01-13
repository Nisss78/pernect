import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

export function useFriendRequests() {
  const pendingRequests = useQuery(api.friendships.listPendingRequests) ?? [];
  const sentRequests = useQuery(api.friendships.listSentRequests) ?? [];

  const acceptMutation = useMutation(api.friendships.acceptRequest);
  const rejectMutation = useMutation(api.friendships.rejectRequest);
  const cancelMutation = useMutation(api.friendships.cancelRequest);
  const sendRequestMutation = useMutation(api.friendships.sendRequest);

  const [processingId, setProcessingId] = useState<Id<"friendships"> | null>(
    null
  );
  const [isSending, setIsSending] = useState(false);

  const acceptRequest = async (friendshipId: Id<"friendships">) => {
    try {
      setProcessingId(friendshipId);
      await acceptMutation({ friendshipId });
      return { success: true };
    } catch (error) {
      console.error("承認に失敗しました:", error);
      return { success: false, error };
    } finally {
      setProcessingId(null);
    }
  };

  const rejectRequest = async (friendshipId: Id<"friendships">) => {
    try {
      setProcessingId(friendshipId);
      await rejectMutation({ friendshipId });
      return { success: true };
    } catch (error) {
      console.error("拒否に失敗しました:", error);
      return { success: false, error };
    } finally {
      setProcessingId(null);
    }
  };

  const cancelRequest = async (friendshipId: Id<"friendships">) => {
    try {
      setProcessingId(friendshipId);
      await cancelMutation({ friendshipId });
      return { success: true };
    } catch (error) {
      console.error("キャンセルに失敗しました:", error);
      return { success: false, error };
    } finally {
      setProcessingId(null);
    }
  };

  const sendRequest = async (receiverUserId: string) => {
    try {
      setIsSending(true);
      const result = await sendRequestMutation({ receiverUserId });
      return { success: true, ...result };
    } catch (error) {
      console.error("申請に失敗しました:", error);
      return { success: false, error };
    } finally {
      setIsSending(false);
    }
  };

  return {
    pendingRequests,
    sentRequests,
    isLoading: pendingRequests === undefined || sentRequests === undefined,
    acceptRequest,
    rejectRequest,
    cancelRequest,
    sendRequest,
    processingId,
    isSending,
  };
}
