import { useQuery } from 'react-query';
import { supabase } from '../utils/supabase';
import { Database } from '../types/schema';

type Profile = Database['public']['Tables']['profiles']['Row'];

export const useQueryAvatar = (userId: string) => {
  const getAvatarUrl = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('id', userId)
      .single();
    if (error) throw new Error(error.message);
    return data;
  };
  return useQuery({
    queryKey: ['avatar_url', userId],
    queryFn: getAvatarUrl,
  });
};
