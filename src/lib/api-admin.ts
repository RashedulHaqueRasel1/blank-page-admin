import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
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
    // Adding no-store to ensure admin dashboard always shows fresh live data
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function getAdminPages() {
  const data = await fetchWithAuth('/pages/admin/all-pages');
  return data.data;
}

export async function getAdminUsers() {
  const data = await fetchWithAuth('/users/admin/all-users');
  return data.data;
}

export async function getAdminVisitors(page = 1, limit = 20) {
  const data = await fetchWithAuth(`/visitors/admin/list?page=${page}&limit=${limit}`);
  return data;
}

export async function getAdminStats() {
  const data = await fetchWithAuth('/analytics/admin/overview');
  return data.data;
}

export async function getAdminSubscribers(page = 1, limit = 20) {
  const data = await fetchWithAuth(`/subscribers/admin/list?page=${page}&limit=${limit}`);
  return data;
}
