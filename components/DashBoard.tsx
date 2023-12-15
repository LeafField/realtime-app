import React, { FC, Suspense, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { LogoutIcon, ExclamationCircleIcon } from '@heroicons/react/solid';
import { ErrorBoundary } from 'react-error-boundary';
import { UserProfile } from './UserProfile';
import { Spinner } from './Spinner';
import { useQueryClient } from 'react-query';
import useStore from '../store';

export const DashBoard: FC = () => {
  const queryClient = useQueryClient();
  const { resetEditedProfile } = useStore();

  const signOut = () => {
    supabase.auth.signOut();
  };

  useEffect(() => {
    return () => {
      resetEditedProfile();
      queryClient.removeQueries(['profile']);
    };
  }, [resetEditedProfile]);

  return (
    <>
      <LogoutIcon
        className="my-6 h-6 w-6 cursor-pointer text-blue-500"
        onClick={signOut}
      />
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
    </>
  );
};
