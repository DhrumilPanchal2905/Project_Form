/** @type {import('next').NextConfig} */
const securityHeaders = [
    {
      key: "X-DNS-Prefetch-Control",
      value: "on",
    },
    {
      key: "Strict-Transport-Security",
      value: "max-age=63072000; includeSubDomains; preload",
    },
    {
      key: "Server",
      value: "Apache", // This is just an example, you can remove it if you don't want to show the server type
    },
    {
      key: "X-Content-Type-Options",
      value: "nosniff",
    },
    {
      key: "X-Frame-Options",
      value: "DENY",
    },
    {
      key: "X-XSS-Protection",
      value: "1; mode=block",
    },
    {
      key: "Referrer-Policy",
      value: "no-referrer-when-downgrade",
    },
    {
      key: "Permissions-Policy",
      value: "camera=(), microphone=(), geolocation=()",
    },
  ];
  
  const nextConfig = {
    async headers() {
      return [
        {
          source: '/:path*',
          headers: securityHeaders,
        },
      ];
    },
    env: {
      NEXT_APP_ENVIRONMENT: process.env.NEXT_APP_ENVIRONMENT,
      NEXT_APP_BASE_URL: process.env.NEXT_APP_BASE_URL,
    },
    future: {
      webpack5: true,
    },
    // ...other configurations
  };
  
  export default nextConfig;
  