import React from 'react'

export const LoadingSkeleton = () => {
  return (
    <div className="bg-red-50 w-[420px] h-[90px] flex flex-col">
        <Skeleton></Skeleton>
        <Skeleton></Skeleton>
        <Skeleton></Skeleton>

    </div>
  )
}

const Skeleton = () => {
    return (
        <div className='mt-6'>
            <div className='animate-pulse rounded-md bg-primary/10 h-2 w-full mt-4 '></div>
            <div className='animate-pulse rounded-md bg-primary/10 h-2 w-full mt-4'></div>
            <div className='animate-pulse rounded-md bg-primary/10 h-2 w-full mt-4'></div>
            <div className='animate-pulse rounded-md bg-primary/10 h-2 w-full mt-4'></div>
        </div>
    )
}
