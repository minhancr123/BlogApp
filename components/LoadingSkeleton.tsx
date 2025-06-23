import React from 'react';

export const LoadingSkeleton = () => {
  return (
    <div className="w-full h-auto p-4 bg-red-50 dark:bg-gray-900 rounded-xl shadow-md space-y-6">
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </div>
  );
};

const Skeleton = () => {
  return (
    <div className="space-y-3">
      <div className="h-4 w-3/4 animate-pulse rounded bg-primary/20 dark:bg-white/10" />
      <div className="h-3 w-2/3 animate-pulse rounded bg-primary/20 dark:bg-white/10" />
      <div className="h-3 w-full animate-pulse rounded bg-primary/20 dark:bg-white/10" />
      <div className="h-3 w-5/6 animate-pulse rounded bg-primary/20 dark:bg-white/10" />
    </div>
  );
};
