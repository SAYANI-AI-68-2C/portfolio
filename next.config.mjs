/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_ACTIONS || process.env.DEPLOY_TARGET === 'gh-pages';
const basePath = isGithubPages ? '/portfolio' : '';

const nextConfig = {
  output: 'export',
  basePath,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  reactStrictMode: true,
};

export default nextConfig;
