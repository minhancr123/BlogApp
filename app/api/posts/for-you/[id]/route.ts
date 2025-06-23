import { validateRequest } from "@/app/auth";
import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { user } = await validateRequest();
  const { id: postId } = await params;

  try {
    const postList = await prisma.post.findMany({
      where: {
        id: postId,
        userId: user?.id,
      },
    });

    if (postList.length > 0) {
      const deleted = await prisma.post.delete({
        where: { id: postId },
      });
      return NextResponse.json({ post: deleted, message: "Post Deleted" }, { status: 200 });
    } else {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  } catch (err) {
    return NextResponse.json({ message: "Error", error: `${err}` }, { status: 500 });
  }
}