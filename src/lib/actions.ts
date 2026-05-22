"use server";

import { revalidatePath } from 'next/cache';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

async function fetchAuthMutation(endpoint: string, options: RequestInit = {}) {
  const session = await getServerSession(authOptions);
  const token = (session as any)?.accessToken;

  if (!token) {
    throw new Error("Unauthorized: No access token found");
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function deletePageAdmin(customUrl: string) {
  await fetchAuthMutation(`/publish/${customUrl}/delete`, { method: 'DELETE' });
  revalidatePath('/pages');
  revalidatePath('/');
}

export async function deleteVisitorAdmin(id: string) {
  await fetchAuthMutation(`/visitors/admin/${id}`, { method: 'DELETE' });
  revalidatePath('/visitors');
  revalidatePath('/');
}

export async function deleteSubscriberAdmin(id: string) {
  await fetchAuthMutation(`/subscribers/admin/${id}`, { method: 'DELETE' });
  revalidatePath('/subscribers');
}

export async function updateSubscriberAdmin(id: string, data: { isSubscribed?: boolean, isVerified?: boolean }) {
  await fetchAuthMutation(`/subscribers/admin/${id}`, { 
    method: 'PATCH',
    body: JSON.stringify(data)
  });
  revalidatePath('/subscribers');
}
