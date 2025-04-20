import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds : true,
  },
  /* config options here */
 experimental:{
  staleTimes:{
    dynamic : 30 ,
    static : 180
  }
 },
 serverExternalPackages : ["@node-rs/argon2"]
};

export default nextConfig;
