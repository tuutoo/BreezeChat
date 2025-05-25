'use client';

import { redirect } from 'next/navigation'

export default function Home() {
  // Redirect to the default locale (zh)
  redirect('/zh')
}
