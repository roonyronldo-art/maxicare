export const runtime = 'nodejs';
import { redirect } from 'next/navigation';

// Default locale for users visiting /clinic without explicit language segment
export default function ClinicRootPage() {
  redirect('/en/clinic');
}
