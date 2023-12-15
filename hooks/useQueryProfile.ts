import { useQuery } from 'react-query';
import { supabase } from '../utils/supabase';
import useStore from '../store';
import { useMutateProfile } from './useMutateProfile';
import { Database } from '../types/schema';

type Profile = Database['public']['Tables']['profiles']['Row'];
type OmitProfile = Omit<Profile, 'updated_at' | 'created_at'>;

export const useQueryProfile = () => {
  const { editedProfile, updateEditedProfile, session } = useStore();
  const { createProfileMutation } = useMutateProfile();

  const getProfile = async () => {
    const { data, error, status } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session!.user.id)
      .single();

    if (error && status === 406 && session) {
      createProfileMutation.mutate({
        id: session.user.id,
        username: session.user.email!,
        favorites: '',
        avatar_url: '',
      });
      updateEditedProfile({
        ...editedProfile,
        username: session.user.email,
      });
    }

    if (error && status !== 406) {
      console.log('ここかな？');
      throw new Error(error.message);
    }
    return data;
  };

  return useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    staleTime: Infinity,
    onSuccess: (data) => {
      if (data) {
        updateEditedProfile({
          username: data.username!,
          favorites: data.favorites ? data.favorites : '',
          avatarUrl: data.avatar_url ? data.avatar_url : '',
        });
      }
    },
  });
};
