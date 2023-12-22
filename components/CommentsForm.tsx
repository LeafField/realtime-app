import React, { FC, memo, FormEvent, Dispatch, SetStateAction } from 'react';
import { MailIcon } from '@heroicons/react/solid';
import useStore from '../store';
import { EditedComment } from '../types';
import { useMutateComment } from '../hooks/useMutateComment';

type Props = {
  postId: string;
  editedComment: EditedComment;
  setEditedComment: Dispatch<SetStateAction<EditedComment>>;
};

export const CommentsFormMemo: FC<Props> = ({
  editedComment,
  postId,
  setEditedComment,
}) => {
  const session = useStore((state) => state.session);
  const { createCommentsMutation, updateCommentMutatin } = useMutateComment();

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editedComment.id === '') {
      await createCommentsMutation.mutateAsync({
        comment: editedComment.comment,
        user_id: session!.user.id,
        post_id: postId,
      });
      setEditedComment({ id: '', comment: '' });
    } else {
      await updateCommentMutatin.mutateAsync({
        id: editedComment.id,
        comment: editedComment.comment,
      });
      setEditedComment({ id: '', comment: '' });
    }
  };

  return (
    <form onSubmit={submitHandler}>
      <div className="flex items-center justify-center">
        <input
          type="text"
          placeholder="New Comment ?"
          value={editedComment.comment}
          onChange={(e) =>
            setEditedComment({ ...editedComment, comment: e.target.value })
          }
          className="my-2 rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none"
        />
      </div>
      <button type="submit" disabled={!editedComment.comment}>
        <MailIcon
          className={`ml-3 h-6 w-6 cursor-pointer ${
            editedComment.comment ? 'text-indigo-500' : 'text-gray-500'
          }`}
        />
      </button>
    </form>
  );
};

export const CommentForm = memo(CommentsFormMemo);
