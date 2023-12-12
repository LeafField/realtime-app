import { useQueryClient, useMutation } from 'react-query';
import { supabase } from '../utils/supabase';
import { Database } from '../types/schema';
// import { Profile } from "../types";

type Profile = Database['public']['Tables']['profiles']['Row'];
type OmitProfile = Omit<Profile, 'updated_at' | 'created_at'>;

export const useMutateProfile = () => {
  const queryClient = useQueryClient();
  const createProfileMutation = useMutation(
    async (profile: OmitProfile) => {
      const { data, error } = await supabase
        .from('profiles')
        .insert(profile)
        .select();
      if (error) throw new Error(error.message);
      return data;
    },
    {
      onSuccess: (res) => {
        queryClient.setQueryData(['profile'], res[0]);
      },
      onError: (err: any) => {
        alert((err as Error).message);
      },
    },
  );

  const updateProfileMutation = useMutation(
    async (profile: OmitProfile) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', profile.id)
        .select();
      if (error) throw new Error(error.message);
      return data;
    },
    {
      onSuccess: (res) => {
        queryClient.setQueryData(['profile'], res[0]);
      },
      onError: (err: any) => {
        alert((err as Error).message);
      },
    },
  );
  return {
    createProfileMutation,
    updateProfileMutation,
  };
};
