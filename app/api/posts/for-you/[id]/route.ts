import { validateRequest } from "@/app/auth";
import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { user } = await validateRequest();
  const postId = context.params.id;

  try {
    const PostValid = await prisma.post.findMany({
      where: {
        id: postId,
        userId: user?.id,
      },
    });

    if (PostValid.length > 0) {
      const post = await prisma.post.delete({
        where: {
          id: postId,
        },
      });
      return NextResponse.json({ post, message: "Post Deleted Successfully" }, { status: 200 });
    } else {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 404 });
  }
}
