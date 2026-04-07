import type { NextConfig } from "next";

const now = new Date();
const buildTimestamp = now.toLocaleDateString('de-DE', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'Europe/Berlin',
}) + ' ' + now.toLocaleTimeString('de-DE', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Europe/Berlin',
}) + ' Uhr';

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BUILD_TIMESTAMP: buildTimestamp,
  },
};

export default nextConfig;
