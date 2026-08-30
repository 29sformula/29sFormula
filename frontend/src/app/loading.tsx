'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import NewtonsCradleLoader from '@/components/NewtonsCradleLoader';

export default function Loading() {
  const pathname = usePathname();

  if (pathname === '/') {
    return null;
  }

  return <NewtonsCradleLoader />;
}
