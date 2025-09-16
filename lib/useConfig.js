// lib/useConfig.js
import useSWR from 'swr';

const fetcher = async (url) => {
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export default function useConfig() {
  const { data, error, isLoading, mutate } = useSWR('/api/content', fetcher);
  return { config: data || {}, content: data || {}, loading: isLoading, error, mutate };
}

