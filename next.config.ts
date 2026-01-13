import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_PARTYKIT_HOST: process.env.NEXT_PUBLIC_PARTYKIT_HOST || 'shasn-game.nakshatra3108.partykit.dev',
  },
};

export default nextConfig;
