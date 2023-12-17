import { useMutation } from 'react-query';
import { supabase } from '../utils/supabase';
import { Database } from '../types/schema';

type Comments = Database['public']['Tables']['comments']['Row'];
type EditedComments = Pick<Comments, 'id' | 'comment'>;
type OmitComments = Omit<Comments, 'id' | 'created_at'>;

export const useMutateComment = () => {
  const createCommentsMutation = useMutation(
    async (comment: OmitComments) => {
      const { data, error } = await supabase
        .from('comments')
        .insert(comment)
        .select();
      if (error) throw new Error(error.message);
      return data;
    },
    {
      onError: (err: any) => {
        alert((err as Error).message);
      },
    },
  );

  const updateCommentMutatin = useMutation(
    async (comment: EditedComments) => {
      const { data, error } = await supabase
        .from('comments')
        .update({ comment: comment.comment })
        .eq('id', comment.id)
        .select();
      if (error) throw new Error(error.message);
      return data;
    },
    {
      onError: (err: any) => {
        alert((err as Error).message);
      },
    },
  );

  const deleteCommentMutation = useMutation(
    async (id: string) => {
      const { data, error } = await supabase
        .from('comments')
        .delete()
        .eq('id', id)
        .select();
      if (error) throw new Error(error.message);
      return data;
    },
    {
      onError: (err: any) => {
        alert((err as Error).message);
      },
    },
  );
  return {
    createCommentsMutation,
    updateCommentMutatin,
    deleteCommentMutation,
  };
};
