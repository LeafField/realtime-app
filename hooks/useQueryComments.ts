import { useQuery } from 'react-query';
import { supabase } from '../utils/supabase';
import { Database } from '../types/schema';

export const useQueryComments = (postId: string) => {
  const getComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) throw new Error(error.message);
    return data;
  };

  return useQuery({
    queryKey: ['comments', postId],
    queryFn: getComments,
    staleTime: Infinity,
  });
};
