/** @type {import('next').NextConfig} */
const nextConfig = {
  serverRuntimeConfig: {
    mobilePage: "/mobile",
    desktopPage: "/desktop",
  },
};

export default nextConfig;
