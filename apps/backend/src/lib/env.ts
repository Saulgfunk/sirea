function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

const port = Number(process.env.PORT ?? 4000);

export const env = {
  port,
  databaseUrl: required('DATABASE_URL'),
  jwtSecret: required('JWT_SECRET'),
  // Used to build absolute URLs for uploaded files (src/routes/uploads.ts).
  // Must be reachable from wherever the client runs — localhost only works
  // for a browser/simulator on this same machine; a phone on Expo Go needs
  // this Mac's LAN IP, same as apps/mobile/.env's EXPO_PUBLIC_API_URL.
  publicUrl: process.env.PUBLIC_URL ?? `http://localhost:${port}`,
};
