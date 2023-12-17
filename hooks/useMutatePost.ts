import { useMutation } from 'react-query';
import useStore from '../store';
import { supabase } from '../utils/supabase';
import { Database } from '../types/schema';

type Post = Database['public']['Tables']['posts']['Row'];
type EditedPost = Pick<Post, 'id' | 'title' | 'post_url'>;
type OmitPostType = Omit<Post, 'id' | 'created_at'>;

export const useMutatePost = () => {
  const { resetEditedPost } = useStore();
  const createPostMutation = useMutation(
    async (post: OmitPostType) => {
      const { data, error } = await supabase
        .from('posts')
        .insert(post)
        .select();
      if (error) throw new Error(error.message);
      return data;
    },
    {
      onSuccess: () => {
        resetEditedPost();
      },
      onError: (err: any) => {
        alert((err as Error).message);
        resetEditedPost();
      },
    },
  );

  const updatePostMutation = useMutation(
    async (post: EditedPost) => {
      const { data, error } = await supabase
        .from('posts')
        .update(post)
        .eq('id', post.id)
        .select();
      if (error) throw new Error(error.message);
      return data;
    },
    {
      onSuccess: () => {
        resetEditedPost();
      },
      onError: (err: any) => {
        alert((err as Error).message);
        resetEditedPost();
      },
    },
  );

  const deletePostMutation = useMutation(
    async (id: string) => {
      const { data, error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id)
        .select();
      if (error) throw new Error(error.message);
      return data;
    },
    {
      onSuccess: () => {
        resetEditedPost();
      },
      onError: (err: any) => {
        alert((err as Error).message);
        resetEditedPost();
      },
    },
  );

  return { createPostMutation, deletePostMutation, updatePostMutation };
};
