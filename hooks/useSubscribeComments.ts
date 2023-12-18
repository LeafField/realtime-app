import { useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { useQueryClient } from 'react-query';
import { Database } from '../types/schema';
import {
  RealtimePostgresChangesFilter,
  RealtimePostgresDeletePayload,
  RealtimePostgresInsertPayload,
  RealtimePostgresUpdatePayload,
} from '@supabase/supabase-js';

type Comment = Database['public']['Tables']['comments']['Row'];
type EditedComment = Pick<Comment, 'id' | 'comment'>;

export const useSubscribeComments = (postId: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const subsc = supabase
      .channel('comments')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comments',
          filter: `post_id=eq.${postId}`,
        } satisfies RealtimePostgresChangesFilter<'INSERT'>,
        (payload: RealtimePostgresInsertPayload<Comment>) => {
          let previousComments = queryClient.getQueryData<Comment[]>([
            'comments',
            postId,
          ]);
          if (!previousComments) {
            previousComments = [];
          }
          queryClient.setQueryData(
            ['comments', postId],
            [
              ...previousComments,
              {
                id: payload.new.id,
                comment: payload.new.comment,
                created_at: payload.new.created_at,
                post_id: payload.new.post_id,
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
          table: 'comments',
          filter: `post_id=eq.${postId}`,
        } satisfies RealtimePostgresChangesFilter<'UPDATE'>,
        (payload: RealtimePostgresUpdatePayload<Comment>) => {
          let previousComments = queryClient.getQueryData<Comment[]>([
            'comments',
            postId,
          ]);
          if (!previousComments) {
            previousComments = [];
          }
          queryClient.setQueryData(
            ['comments', postId],
            previousComments.map((comment) =>
              comment.id === payload.new.id
                ? {
                    id: payload.new.id,
                    comment: payload.new.comment,
                    created_at: payload.new.created_at,
                    post_id: payload.new.post_id,
                    user_id: payload.new.user_id,
                  }
                : comment,
            ),
          );
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'comments',
          filter: `post_id=eq.${postId}`,
        } satisfies RealtimePostgresChangesFilter<'DELETE'>,
        (payload: RealtimePostgresDeletePayload<Comment>) => {
          let previousComments = queryClient.getQueryData<Comment[]>([
            'comments',
            postId,
          ]);
          if (!previousComments) {
            previousComments = [];
          }
          queryClient.setQueryData(
            ['comments', postId],
            previousComments.filter((comment) => comment.id !== payload.old.id),
          );
        },
      )
      .subscribe();
  }, [queryClient, postId]);
};
