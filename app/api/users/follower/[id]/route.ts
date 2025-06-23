import { validateRequest } from "@/app/auth"
import { FollowingInfo } from "@/app/lib/post_typeprops";
import { prisma } from "@/app/lib/prisma";
import {NextRequest,  NextResponse } from "next/server";

export const GET = async (req : NextRequest , context : {params: Promise<{id : string}>}) => {
    const {id} = await context.params;
    const {user} = await validateRequest();
    const {searchParams } = new URL(req.url);
    const page =  parseInt(searchParams.get("page") || "0");
    const pagesize = 10;
    if(!user) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    const userFollower = await prisma.user.findUnique({
        where: {id: id},
        select: {
            Followers: {
                where: {
                    followerId: user.id
                },
                select: {
                    followerId: true
                }
            },
            _count: {
                select: {
                    Followers: true
                }
            }
        }
    });


    if (!userFollower) {
        return NextResponse.json({error: "User not found"}, {status: 404});
    }

    const data: FollowingInfo = {
        followers: userFollower._count.Followers,
        isfollowbyUser: userFollower.Followers.length > 0
    };
    
    return NextResponse.json(data);
}

export const POST = async (req: NextRequest, context: { params: { id: string } }) => {
    console.log("API called with params:", context?.params);

    // Kiểm tra params
    if (!context || !context.params || !context.params.id) {
        console.error("Missing or invalid params:", context?.params);
        return NextResponse.json({ error: "Missing target user ID" }, { status: 400 });
    }

    const { params } = context;

    // Debug bước đầu tiên
    console.log("Starting POST handler for target ID:", params.id);

    try {
        console.log("Calling validateRequest...");
        const { user: loggedIn } = await validateRequest().catch((err) => {
            console.error("validateRequest failed:", err);
            throw new Error("Authentication failed");
        });
        console.log("Logged in user:", loggedIn);

        if (!loggedIn || !loggedIn.id) {
            console.error("No logged-in user found");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        console.log("Starting follow/unfollow logic for user:", loggedIn.id, "and target:", params.id);

        const targetUser = await prisma.user.findUnique({
            where: { id: params.id },
        });
        console.log("Target user found:", targetUser);

        if (!targetUser) {
            console.error("Target user not found:", params.id);
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const result = await prisma.$transaction(async (tx) => {
            const existingFollow = await tx.follow.findUnique({
                where: {
                    followerId_followingId: {
                        followerId: loggedIn.id,
                        followingId: params.id,
                    },
                },
            });
            console.log("Existing follow:", existingFollow);

            if (existingFollow) {
                await tx.follow.delete({
                    where: {
                        followerId_followingId: {
                            followerId: loggedIn.id,
                            followingId: params.id,
                        },
                    },
                });
                console.log("Unfollowed successfully");
                return { message: "Unfollowed successfully", isFollowing: false };
            } else {
                await tx.follow.create({
                    data: {
                        followerId: loggedIn.id,
                        followingId: params.id,
                    },
                });
                console.log("Followed successfully");
                return { message: "Followed successfully", isFollowing: true };
            }
        });

        const [updatedUser, updatedTargetUser] = await Promise.all([
            prisma.user.findUnique({
                where: { id: loggedIn.id },
                include: { Followings: { select: { followingId: true } } },
            }).catch((err) => {
                console.error("Error fetching updatedUser:", err);
                return null;
            }),
            prisma.user.findUnique({
                where: { id: params.id },
                include: { Followers: { select: { followerId: true } } },
            }).catch((err) => {
                console.error("Error fetching updatedTargetUser:", err);
                return null;
            }),
        ]);

        if (!updatedUser || !updatedTargetUser) {
            console.error("Failed to fetch updated user data");
            return NextResponse.json({ error: "Failed to fetch updated user data" }, { status: 500 });
        }

        console.log("Returning success response");
        return NextResponse.json({
            message: result.message,
            isFollowing: result.isFollowing,
            following: updatedUser.Followings.map((f) => f.followingId) || [],
            followers: updatedTargetUser.Followers.map((f) => f.followerId) || [],
        }, { status: 200 });
    } catch (error) {
        console.error("Error in follow/unfollow operation:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        return NextResponse.json(
            { error: "Internal server error", details: errorMessage },
            { status: 500 }
        );
    }
};
