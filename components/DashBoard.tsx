import React, { FC, Suspense, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { LogoutIcon, ExclamationCircleIcon } from '@heroicons/react/solid';
import { ErrorBoundary } from 'react-error-boundary';
import { UserProfile } from './UserProfile';
import { Spinner } from './Spinner';
import { useQueryClient } from 'react-query';
import useStore from '../store';
import { Notification } from './Notification';
import { Feed } from './Feed';

export const DashBoard: FC = () => {
  const queryClient = useQueryClient();
  const { resetEditedProfile, resetEditedNotice, resetEditedPost } = useStore();

  const signOut = () => {
    supabase.auth.signOut();
  };

  useEffect(() => {
    return () => {
      resetEditedProfile();
      resetEditedNotice();
      resetEditedPost();
      queryClient.removeQueries(['profile']);
      queryClient.removeQueries(['notices']);
      queryClient.removeQueries(['posts']);
    };
  }, [resetEditedProfile]);

  return (
    <>
      <LogoutIcon
        className="my-6 h-6 w-6 cursor-pointer text-blue-500"
        onClick={signOut}
      />
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center">
          <ErrorBoundary
            fallback={
              <ExclamationCircleIcon className="my-5 h-10 w-10 text-pink-500" />
            }
          >
            <Suspense fallback={<Spinner />}>
              <UserProfile />
            </Suspense>
          </ErrorBoundary>
        </div>

        <ErrorBoundary
          fallback={
            <ExclamationCircleIcon className="my-5 h-10 w-10 text-pink-500" />
          }
        >
          <div className="flex w-96 flex-col items-center">
            <Suspense fallback={<Spinner />}>
              <Feed />
            </Suspense>
          </div>
        </ErrorBoundary>

        <div className="flex flex-col items-center">
          <ErrorBoundary
            fallback={
              <ExclamationCircleIcon className="my-5 h-10 w-10 text-pink-500" />
            }
          >
            <Suspense fallback={<Spinner />}>
              <Notification />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </>
  );
};
