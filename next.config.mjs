/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_PB_PUBLIC_EMAIL: 'public@site.com',
    NEXT_PUBLIC_PB_PUBLIC_PASSWORD: 'readonly',
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/en',
        permanent: false,
        locale: false,
      },
    ];
  },
};

export default nextConfig;
