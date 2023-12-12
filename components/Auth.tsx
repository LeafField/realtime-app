import React, { FC, FormEvent, useState } from 'react';
import { ShieldCheckIcon } from '@heroicons/react/solid';
import { useMutateAuth } from '../hooks/useMutateAuth';

export const Auth: FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const {
    email,
    setEmail,
    password,
    setPassword,
    loginMutation,
    registerMutation,
  } = useMutateAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLogin) {
      loginMutation.mutate();
    } else {
      registerMutation.mutate();
    }
  };

  return (
    <>
      <ShieldCheckIcon className="mb-8 h-12 w-12 text-blue-500" />
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="my-2 rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none"
          />
        </div>
        <div>
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="my-2 rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none"
          />
        </div>
        <div className="my-6 flex items-center justify-center text-sm">
          <span
            className="cursor-pointer font-medium text-indigo-500"
            onClick={() => setIsLogin(!isLogin)}
          >
            change mode ?
          </span>
        </div>
        <button
          className="flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm text-white"
          type="submit"
        >
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>
    </>
  );
};
