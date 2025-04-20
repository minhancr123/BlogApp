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
    profileImage?: string;
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
        <div className='sm:sticky flex-none sm:flex flex-col w-[15rem] bg-red-50 h-fit rounded-xl hidden'>
            <WhoToFollow followers={followers} />
            <TrendingTop ></TrendingTop>
        </div>
    );
}

const WhoToFollow: React.FC<WhoToFollowProps> = ({ followers }) => {
    const followUser = async (id : string) => {
        const result = await axios.post(`/users/follower/${id}`);

        console.log(result);
    }
    return (
        <Suspense fallback={<Loader2 className='animate-spin size-3' />}>
            <div className='text-xl text-center pt-2 h-[400px]'>
                <h2>Who to follow</h2>
                {followers.map((user, index) => (
                    <div key={index} className='flex gap-8 text-sm items-center justify-between w-full'>
                        <Link href={`/user/${user.username}`} className='flex items-center gap-2'>
                            <Avartar url={user.profileImage || undefined} alt={user.username} />
                            <div>
                                <p className='line-clamp-1 break-all font-semibold hover:underline'>{user.username}</p>
                                <p>@{user.username}</p>
                            </div>
                        </Link>
                        <FollowingButton id={user.id} initialData={{followers : 0 , isfollowbyUser :false}} ></FollowingButton>
                    </div>
                ))}
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
    console.log(TT);
    return (
        <div className='space-y-2 text-sm shadow-sm bg-red-50'>
            <h2 className='text-center'>Trending Top</h2>
            {TT.map((value, index) => (
                <div key={index}>
                    <p>{value.hashtag} ({FormatNumber(value.count)})</p>
                </div>
            ))}
        </div>
    );
};
