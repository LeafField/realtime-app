import React, { FC, memo, useState } from 'react';
import { EditedComment } from '../types';
import { useQueryComments } from '../hooks/useQueryComments';
import { useSubscribeComments } from '../hooks/useSubscribeComments';
import { CommentItem } from './CommentItem';
import { CommentForm } from './CommentsForm';

type Props = {
  postId: string;
};

export const CommentsMemo: FC<Props> = ({ postId }) => {
  const [editedComment, setEditedComment] = useState<EditedComment>({
    id: '',
    comment: '',
  });
  const { data: comments } = useQueryComments(postId);

  useSubscribeComments(postId);
  return (
    <div className="w-60">
      <CommentForm
        postId={postId}
        editedComment={editedComment}
        setEditedComment={setEditedComment}
      />
      <ul className="my-5" data-testid="ul-comment">
        {comments?.map((comment) => (
          <CommentItem
            key={comment.id}
            id={comment.id}
            comment={comment.comment!}
            user_id={comment.user_id!}
            setEditedComment={setEditedComment}
          />
        ))}
      </ul>
    </div>
  );
};

export const Comments = memo(CommentsMemo);
