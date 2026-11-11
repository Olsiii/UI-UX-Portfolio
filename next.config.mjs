// Images uploaded in the admin panel are served from Supabase Storage.
const remotePatterns = [{ protocol: "https", hostname: "**.supabase.co", pathname: "/storage/v1/object/public/**" }];
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
if (supabaseUrl) {
  try {
    const u = new URL(supabaseUrl);
    remotePatterns.push({ protocol: u.protocol.replace(":", ""), hostname: u.hostname, port: u.port, pathname: "/storage/v1/object/public/**" });
  } catch {
    // ignore a malformed URL; the admin panel reports the connection problem
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { remotePatterns },
};

export default nextConfig;
