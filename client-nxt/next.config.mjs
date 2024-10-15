/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
      ppr: 'incremental',
      asyncWebAssembly: true,
    },
    module: {
      rules: [
        {
          test: /\.wasm$/,
          type: 'webassembly/async',
        },
      ],
    },
};
// next.config.mjs

export default nextConfig;