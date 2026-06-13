import { CookieOptions, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export const generateTokens = (id: string, role: string) => {
  const accessToken = jwt.sign({ id, role }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as any,
  });
  const refreshToken = jwt.sign({ id, role }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as any,
  });
  return { accessToken, refreshToken };
};

export const setTokenCookies = (res: Response, accessToken: string, refreshToken: string) => {
  const isProd = env.NODE_ENV === 'production';
  
  const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    // In production, specify cookie domain. Localhost should omit domain to avoid cross-domain issues on local ports
    domain: isProd ? env.COOKIE_DOMAIN : undefined,
    path: '/',
  };

  // Set Access Token (15 mins)
  res.cookie('accessToken', accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });

  // Set Refresh Token (7 days)
  res.cookie('refreshToken', refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const clearTokenCookies = (res: Response) => {
  const isProd = env.NODE_ENV === 'production';
  const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    domain: isProd ? env.COOKIE_DOMAIN : undefined,
    path: '/',
  };

  res.clearCookie('accessToken', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);
};
