declare module "jsonwebtoken" {
  export interface JwtPayload { sub?: string; [key: string]: unknown }
  export function sign(payload: object, secret: string, options?: { subject?: string; expiresIn?: string }): string;
  export function verify(token: string, secret: string): JwtPayload | string;
  const jwt: { sign: typeof sign; verify: typeof verify };
  export default jwt;
}
