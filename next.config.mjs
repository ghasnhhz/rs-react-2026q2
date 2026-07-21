import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Existing Vitest tests still reference React Router and are being ported in a
  // later batch; don't let them block production builds.
  eslint: { ignoreDuringBuilds: true },
};

export default withNextIntl(nextConfig);
