'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RedirectLabAdmin() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/en/lab/admin');   // لوحة الطلبات الموحّدة
  }, [router]);
  return null;
}