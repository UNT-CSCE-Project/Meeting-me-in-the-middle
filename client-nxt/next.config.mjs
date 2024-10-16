/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
      ppr: 'incremental',
      asyncWebAssembly: true,
      serverActions: true
    },
   
};
// next.config.mjs

export default nextConfig;