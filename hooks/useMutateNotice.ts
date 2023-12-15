import { useMutation } from 'react-query';
import { supabase } from '../utils/supabase';
import useStore from '../store';
import { Database } from '../types/schema';

type Notice = Database['public']['Tables']['notices']['Row'];
type OmitNotice = Omit<Notice, 'id' | 'created_at'>;
type EditedNotice = Pick<Notice, 'id' | 'content'>;

export const useMutateNotice = () => {
  const reset = useStore((state) => state.resetEditedNotice);

  const createNoticeMutation = useMutation(
    async (notice: OmitNotice) => {
      const { data, error } = await supabase
        .from('notices')
        .insert(notice)
        .select();
      if (error) throw new Error(error.message);
      return data;
    },
    {
      onSuccess: () => {
        reset();
      },
      onError: (err: any) => {
        alert((err as Error).message);
        reset();
      },
    },
  );

  const updateNoticeMutation = useMutation(
    async (notice: EditedNotice) => {
      const { data, error } = await supabase
        .from('notices')
        .update(notice)
        .eq('id', notice.id)
        .select();
      if (error) throw new Error(error.message);
      return data;
    },
    {
      onSuccess: () => {
        reset();
      },
      onError: (err: any) => {
        alert((err as Error).message);
        reset();
      },
    },
  );

  const deleteNoticeMutation = useMutation(
    async (id: string) => {
      const { data, error } = await supabase
        .from('notices')
        .delete()
        .eq('id', id)
        .select();
      if (error) throw new Error(error.message);
      return data;
    },
    {
      onSuccess: () => {
        reset();
      },
      onError: (err: any) => {
        alert((err as Error).message);
        reset();
      },
    },
  );

  return { createNoticeMutation, deleteNoticeMutation, updateNoticeMutation };
};
