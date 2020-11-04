import React from "react";
import { useFirstLevelCommentsQuery } from "../../../../gql/generated";
import Comment from '../Comment/Comment';
import { feedStore } from "../../../../recoil/feedStore";
import useListenForRefetch from "../../../../hooks/apollo/useListenForRefetch";
import useSuspendableQuery from "../../../../hooks/apollo/useSuspendableQuery";

interface Props {
  feedItemId: string;
}

function CommentList({feedItemId}: Props) {
  const { data, refetch } = useSuspendableQuery(useFirstLevelCommentsQuery({variables: {feedItemId}}));
  useListenForRefetch(feedStore.refetchCommentList(feedItemId), refetch);

  return (
    <>
      {data.comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </>
  );
}

export default CommentList;
