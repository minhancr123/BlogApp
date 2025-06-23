import { validateRequest } from '@/app/auth';
import { SelectUser } from '@/app/lib/post_typeprops';
import { prisma } from '@/app/lib/prisma';
import { Prisma } from '@prisma/client';
import React, { Suspense } from 'react';
import { User as UserType } from '@prisma/client';
import Avartar from '@/app/(main)/UserAvartarProps';
import Link from 'next/link';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { unstable_cache } from 'next/cache';
import {FormatNumber} from "../lib/utils"
import axios from 'axios';
import { FollowingButton } from './FollowingButton';
import { FollowingInfo } from '@/app/lib/post_typeprops';
interface SimpleUser {
    id: string;
    username: string;
    displayname: string;
    avatarUrl?: string;
}

interface WhoToFollowProps {
    followers: SimpleUser[];
}

export default async function TrendSideBar() {
    const result = await validateRequest();
    console.log(result);

    const followers = await prisma.user.findMany({
        where: {
            NOT: { id: result.user?.id },   
        },
        select: SelectUser,
        take: 5,
    });

    return (
      <aside className="sm:sticky top-20 flex-none hidden md:flex flex-col s
shadow-md  transition-colors duration-300">
    
        <WhoToFollow followers={followers} />
        <TrendingTop />
        
      </aside>
    );
    
}

const WhoToFollow: React.FC<WhoToFollowProps> = ({ followers }) => {
    const followUser = async (id : string) => {
        const result = await axios.post(`/users/follower/${id}`);

        console.log(result);
    }
    return (
      <Suspense fallback={<Loader2 className='animate-spin size-5 text-blue-500 dark:text-blue-300' />}>
      <div className="text-xl text-center pt-4 h-[400px] rounded-xl border border-blue-400 dark:border-blue-700 bg-gradient-to-br from-blue-50 via-white to-purple-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-950 shadow-lg backdrop-blur-sm p-4 relative overflow-hidden">
    
        {/* Optional hiệu ứng sparkle/lấp lánh */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.3),transparent)] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.1),transparent)] pointer-events-none animate-pulse"></div>
    
        <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-300 dark:via-purple-300 dark:to-pink-300 font-bold text-2xl mb-4">✨ Who to follow ✨</h2>
    
        {followers.length > 0 ? (
          <div className="flex flex-col gap-4 overflow-y-auto max-h-[300px]">
            {followers.map((user, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/70 dark:hover:bg-white/10 transition duration-200 group">
    
                <Link href={`/user/${user.username}`} className="flex items-center gap-3">
                  <Avartar
                    avatarUrl={user.avatarUrl || undefined}
                    alt={user.username}
                    className="w-10 h-10 border border-blue-300 dark:border-blue-500 shadow-md group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="text-left">
                    <p className="line-clamp-1 break-all font-semibold text-sm text-gray-800 dark:text-gray-100 group-hover:underline">
                      {user.username}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">@{user.username}</p>
                  </div>
                </Link>
    
                <FollowingButton
                  id={user.id}
                  initialData={{ followers: 0, isfollowbyUser: false }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex w-full items-center justify-center">
            <h2 className="text-blue-500 dark:text-blue-300 animate-pulse">No one to show</h2>
          </div>
        )}
      </div>
    </Suspense>
    
    );
};

const GetTrendingTop = unstable_cache(async () => {
    const result = await prisma.$queryRaw<{ hashtag: string; count: bigint }[]>`
        SELECT LOWER(unnest(regexp_matches(content, '#[[:alnum:]_]+', 'g'))) AS hashtag , COUNT(*) as count
        FROM "Post"
        GROUP BY hashtag
        ORDER BY count DESC, hashtag ASC
        LIMIT 5;

    `;

    return result.map(row => ({
        hashtag: row.hashtag,
        count: Number(row.count),
    }));
});

const TrendingTop = async () => {
  const TT = await GetTrendingTop();

  return (
    <div className="space-y-3 p-4 rounded-xl dark:mt-3  shadow-lg bg-gradient-to-br from-red-50 via-white to-yellow-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
      <h2 className="text-center text-lg font-semibold text-red-600 dark:text-red-300 mb-2">🔥 Trending Top 🔥</h2>

      {TT.length > 0 ? (
        <ul className="space-y-2 max-h-[300px] overflow-y-auto">
          {TT.map((value, index) => (
            <li
              key={index}
              className="flex justify-between items-center bg-white dark:bg-white/10 hover:bg-red-100 dark:hover:bg-white/20 px-3 py-2 rounded-md transition duration-200 shadow-sm"
            >
              <span className="font-medium text-gray-800 dark:text-gray-100 break-all">#{value.hashtag}</span>
              <span className="text-sm text-gray-600 dark:text-gray-300">{FormatNumber(value.count)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400">No trending hashtags yet.</p>
      )}
    </div>
  );
};

