import React, { FC, memo } from 'react';
import { PencilAltIcon, TrashIcon } from '@heroicons/react/solid';
import useStore from '../store';
import { Database } from '../types/schema';
import { useMutateNotice } from '../hooks/useMutateNotice';

type Notice = Database['public']['Tables']['notices']['Row'];
type Props = Omit<Notice, 'created_at'>;

const NoticeItemMemo: FC<Props> = ({ id, content, user_id }) => {
  const { session, updateEditedNotice } = useStore();
  const { deleteNoticeMutation } = useMutateNotice();

  return (
    <li className="my-3">
      <span>{content}</span>
      {session?.user.id === user_id && (
        <div className="float-right ml-20 flex">
          <PencilAltIcon
            className="mx-1 h-5 w-5 cursor-pointer text-blue-500"
            onClick={() => {
              if (content) {
                updateEditedNotice({ id, content });
              }
            }}
          />
          <TrashIcon
            className="h-5 w-5 cursor-pointer text-blue-500"
            onClick={() => deleteNoticeMutation.mutate(id)}
          />
        </div>
      )}
    </li>
  );
};

export const NoticeItem = memo(NoticeItemMemo);
