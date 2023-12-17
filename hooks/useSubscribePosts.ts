import { useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { supabase } from '../utils/supabase';
import {
  RealtimePostgresInsertPayload,
  RealtimePostgresUpdatePayload,
  RealtimePostgresDeletePayload,
  RealtimePostgresChangesFilter,
} from '@supabase/supabase-js';
import { Database } from '../types/schema';

type Post = Database['public']['Tables']['posts']['Row'];

export const useSubscribePosts = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const subsc = supabase
      .channel('posts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'posts',
        } satisfies RealtimePostgresChangesFilter<'INSERT'>,
        (payload: RealtimePostgresInsertPayload<Post>) => {},
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'posts',
        } satisfies RealtimePostgresChangesFilter<'UPDATE'>,
        (payload: RealtimePostgresUpdatePayload<Post>) => {},
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'posts',
        } satisfies RealtimePostgresChangesFilter<'DELETE'>,
        (payload: RealtimePostgresDeletePayload<Post>) => {},
      )
      .subscribe();

    const removeSubscription = async () => {
      await supabase.removeChannel(subsc);
    };
    return () => {
      removeSubscription();
    };
  }, [queryClient]);
};
