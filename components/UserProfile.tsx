import React, { FC } from 'react';
import Image from 'next/image';
import { CameraIcon } from '@heroicons/react/solid';
import { format } from 'date-fns';
import useStore from '../store';
import { useQueryProfile } from '../hooks/useQueryProfile';
import { useMutateProfile } from '../hooks/useMutateProfile';
import { useDownloadUrl } from '../hooks/useDownloadUrl';
import { useUploadAbatarimg } from '../hooks/useUploadAbatarimg';
import { Spinner } from './Spinner';

export const UserProfile: FC = () => {
  const { session, editedProfile, updateEditedProfile } = useStore();
  const { data: profile } = useQueryProfile();
  const { updateProfileMutation } = useMutateProfile();
  const { useMutateUploadAvatarImg } = useUploadAbatarimg();
  const { fullUrl: avatarUrl, isLoading } = useDownloadUrl(
    editedProfile.avatarUrl,
    'avatars',
  );

  const updateProfile = () => {
    updateProfileMutation.mutate({
      id: session!.user.id,
      username: editedProfile.username!,
      favorites: editedProfile.favorites!,
      avatar_url: editedProfile.avatarUrl!,
    });
  };

  return (
    <>
      <p className="mb-4">{profile?.username}</p>
      {profile?.created_at && (
        <p className="my-1 text-sm">
          {format(new Date(profile.created_at), 'yyyy-MM-dd HH:mm:ss')}
        </p>
      )}
      {profile?.updated_at && (
        <p className="text-sm">
          {format(new Date(profile.updated_at), 'yyyy-MM-dd HH:mm:ss')}
        </p>
      )}
      <p className="mt-4">Username</p>
      <input
        type="text"
        value={editedProfile.username || ''}
        onChange={(e) =>
          updateEditedProfile({ ...editedProfile, username: e.target.value })
        }
        className="mx-2 my-2 rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none"
      />
      <p>Favorites</p>
      <input
        type="text"
        className="mx-2 my-2 rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none"
        value={editedProfile.favorites}
        onChange={(e) =>
          updateEditedProfile({ ...editedProfile, favorites: e.target.value })
        }
      />
      <button
        className={`my-5 rounded ${
          updateProfileMutation.isLoading || !editedProfile.username
            ? 'bg-gray-400'
            : 'bg-indigo-600'
        } px-3 py-2 text-sm font-medium text-white`}
        onClick={updateProfile}
        disabled={updateProfileMutation.isLoading || !editedProfile.username}
      >
        {updateProfileMutation.isLoading ? 'Loading...' : 'Update'}
      </button>
      {avatarUrl && (
        <Image
          src={avatarUrl}
          alt="avatar"
          className="rounded-full"
          width={150}
          height={150}
        />
      )}
      {isLoading && <Spinner />}
      <div className="flex justify-center">
        <label htmlFor="avatar">
          <CameraIcon className="my-3 h-7 w-7 cursor-pointer text-gray-500" />
        </label>
        <input
          type="file"
          id="avatar"
          accept="image/*"
          className="hidden"
          onChange={(e) => useMutateUploadAvatarImg.mutate(e)}
        />
      </div>
    </>
  );
};
