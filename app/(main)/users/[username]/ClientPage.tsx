"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Avartar from "../../UserAvartarProps";
import { FormatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSession } from "../../SessionProvider";
import { getuser, UserCreatedAt, postcount, Flowwingcount, uploadAvatar } from "../handleUser";
import { toast } from "react-toastify";

export default function ClientPage({ username }: { username: string }) {
  const { register, handleSubmit, watch } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [createdAt, setCreatedAt] = useState<Date | null>(null);
  const [postCount, setPostCount] = useState<number>(0);
  const [followCount, setFollowCount] = useState<number>(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const session = useSession();
  const loggedInUser = session?.user;
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const avatarWatch = watch("avatar");

  useEffect(() => {
    const init = async () => {
      if (!loggedInUser) return;
      const fetchedUser = await getuser(username, loggedInUser.id);
      setUser(fetchedUser);
      const created = await UserCreatedAt(loggedInUser.id);
      setCreatedAt(created);
      const post = await postcount(loggedInUser.id);
      const follow = await Flowwingcount(loggedInUser.id);
      setPostCount(post);
      setFollowCount(follow);
    };
    init();
  }, [loggedInUser, username]);

  useEffect(() => {
    if (avatarWatch?.[0]) {
      const file = avatarWatch[0];
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
      handleSubmit(onSubmit)();
    }
  }, [avatarWatch]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const result = await uploadAvatar(user.id, data.avatar[0]);
      setUser(result);
      setPreviewUrl(null);
      toast.success("Avatar updated successfully");
    } catch (error) {
      toast.error("Failed to upload avatar");
      console.error("Upload failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!loggedInUser) return <h1>You are not authorized to view this page</h1>;
  if (!user) return <h1>User not found or loading...</h1>;

  return (
    <div className="flex flex-col items-center w-full px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl">
        {/* Avatar section */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative group cursor-pointer" onClick={handleClick}>
            <Avartar
              avatarUrl={previewUrl || user.avatarUrl || ""}
              alt={user.username || ""}
              size={250}
              className="rounded-full ring-2 ring-primary ring-offset-2 ring-offset-background transition"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm rounded-full transition">
              Click to change
            </div>
          </div>

          <h1 className="text-xl font-semibold text-foreground">{user.username}</h1>

          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="rounded-full w-24 h-24 object-cover border border-muted mt-2 shadow"
            />
          )}
        </div>

        {/* Info + Upload section */}
        <div className="space-y-6 text-foreground">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Member since</p>
            <p className="text-lg font-medium">
              {createdAt ? FormatDateTime(createdAt) : "Loading..."}
            </p>
          </div>

          <div className="flex gap-6 text-sm text-muted-foreground">
            <span>📝 Posts: <strong className="text-foreground">{postCount}</strong></span>
            <span>👥 Following: <strong className="text-foreground">{followCount}</strong></span>
          </div>

          <form encType="multipart/form-data" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input
              type="file"
              accept="image/*"
              {...register("avatar", { required: true })}
              ref={(e) => {
                register("avatar").ref(e);
                fileInputRef.current = e;
              }}
              className="hidden"
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isLoading ? "Uploading..." : "Upload Avatar"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
