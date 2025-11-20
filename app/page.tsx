/**
 * Root Page - Redirects to appropriate route
 */

import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to login page (auth check handled by layout)
  redirect('/login');
}
