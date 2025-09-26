'use server';

// Utility functions for handling authentication storage using server-side cookies
import { cookies } from 'next/headers';

export async function setAuthToken(token: string) {
    const cookieStore = await cookies();
  await cookieStore.set('authToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/'
  });
}

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('authToken');
  return token?.value || null;
}

export async function removeAuthToken() {
  const cookieStore = await cookies();
  cookieStore.delete('authToken');
}

export async function setUser(user: any) {
  const cookieStore = await cookies();
  cookieStore.set('user', JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60,
    path: '/'
  });
}

export async function getUser(): Promise<any | null> {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('user');
  
  if (!userCookie?.value) return null;
  
  try {
    return JSON.parse(userCookie.value);
  } catch (error) {
    console.error('Error parsing user data from cookie:', error);
    cookieStore.delete('user');
    return null;
  }
}

export async function removeUser() {
  const cookieStore = await cookies();
  cookieStore.delete('user');
}
