import type { NextConfig } from "next";

const removeImports = require('next-remove-imports')();
module.exports = removeImports({});

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ['next-mdx-remote'],
};

export default nextConfig;
