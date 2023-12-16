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

type Notice = Database['public']['Tables']['notices']['Row'];

export const useSubscribeNotices = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const subsc = supabase
      .channel('notices')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notices' },
        (payload: RealtimePostgresInsertPayload<Notice>) => {
          let previousNotice = queryClient.getQueryData<Notice[]>(['notices']);
          if (!previousNotice) {
            previousNotice = [];
          }
          queryClient.setQueryData(
            ['notices'],
            [
              ...previousNotice,
              {
                id: payload.new.id,
                created_at: payload.new.created_at,
                content: payload.new.content,
                user_id: payload.new.user_id,
              },
            ],
          );
        },
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'notices' },
        (payload: RealtimePostgresUpdatePayload<Notice>) => {
          let previousNotice = queryClient.getQueryData<Notice[]>(['notices']);
          if (!previousNotice) {
            previousNotice = [];
          }
          queryClient.setQueryData(
            ['notices'],
            previousNotice.map((notice) =>
              notice.id === payload.new.id
                ? {
                    id: payload.new.id,
                    content: payload.new.content,
                    created_at: payload.new.created_at,
                    user_id: payload.new.user_id,
                  }
                : notice,
            ),
          );
        },
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'notices' },
        (payload: RealtimePostgresDeletePayload<Notice>) => {
          let previousNotice = queryClient.getQueryData<Notice[]>(['notices']);
          if (!previousNotice) {
            previousNotice = [];
          }
          queryClient.setQueryData(
            ['notices'],
            previousNotice.filter((notice) => notice.id !== payload.old.id),
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
