import { useQuery } from 'react-query';
import { supabase } from '../utils/supabase';
import { Database } from '../types/schema';

type Post = Database['public']['Tables']['posts']['Row'];

export const useQueryPosts = () => {
  const getPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) throw new Error(error.message);
    return data;
  };

  return useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
    staleTime: Infinity,
  });
};
