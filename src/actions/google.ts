import { OAUTH2_CLIENT, getAuthUrl } from '@/lib/google';

export function getAuthUrlAction() {
  // TODO: add auth checks here if needed
  return getAuthUrl();
}

export async function exchangeCodeForTokens(code: string) {
  const { tokens } = await OAUTH2_CLIENT.getToken(code);
  return tokens;
}
