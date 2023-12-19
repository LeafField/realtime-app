import React, { FC } from 'react';
import { useQueryPosts } from '../hooks/useQueryPosts';
import { useSubscribePosts } from '../hooks/useSubscribePosts';
import { PostItem } from './PostItem';
import { PostForm } from './PostForm';

export const Feed: FC = () => {
  const { data: posts } = useQueryPosts();
  useSubscribePosts();
  return (
    <>
      <p className="mb-4 text-center">Feed</p>
      <PostForm />
      <ul className="my-5" data-testid="ul-post">
        {posts?.map((post) => (
          <PostItem
            key={post.id}
            id={post.id}
            title={post.title}
            post_url={post.post_url}
            user_id={post.user_id}
          />
        ))}
      </ul>
    </>
  );
};
