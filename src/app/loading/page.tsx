import { LoadingDots } from '@/components/ui/loading-dots';

export default function LoadingPage() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <LoadingDots className="text-brand-brown dark:text-brand-green-light" size="lg" />
    </div>
  );
}
