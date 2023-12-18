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
        (payload: RealtimePostgresInsertPayload<Post>) => {
          let previousPosts = queryClient.getQueryData<Post[]>(['posts']);
          if (!previousPosts) {
            previousPosts = [];
          }
          queryClient.setQueryData(
            ['posts'],
            [
              ...previousPosts,
              {
                id: payload.new.id,
                created_at: payload.new.created_at,
                post_url: payload.new.post_url,
                title: payload.new.title,
                user_id: payload.new.user_id,
              },
            ],
          );
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'posts',
        } satisfies RealtimePostgresChangesFilter<'UPDATE'>,
        (payload: RealtimePostgresUpdatePayload<Post>) => {
          let previousPosts = queryClient.getQueryData<Post[]>(['posts']);
          if (!previousPosts) {
            previousPosts = [];
          }
          queryClient.setQueryData(
            ['posts'],
            previousPosts.map((post) =>
              post.id === payload.new.id
                ? {
                    id: payload.new.id,
                    created_at: payload.new.created_at,
                    post_url: payload.new.post_url,
                    title: payload.new.title,
                    user_id: payload.new.user_id,
                  }
                : post,
            ),
          );
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'posts',
        } satisfies RealtimePostgresChangesFilter<'DELETE'>,
        (payload: RealtimePostgresDeletePayload<Post>) => {
          let previousPosts = queryClient.getQueryData<Post[]>(['posts']);
          if (!previousPosts) {
            previousPosts = [];
          }
          queryClient.setQueryData(
            ['posts'],
            previousPosts.filter((post) => post.id !== payload.old.id),
          );
        },
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
