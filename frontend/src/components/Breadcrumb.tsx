import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Breadcrumb(): JSX.Element {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(Boolean);

  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/');
    const isLast = index === pathSegments.length - 1;
    const formattedSegment = segment.charAt(0).toUpperCase() + segment.slice(1);

    return (
      <li key={href} className="inline-flex items-center">
        {!isLast ? (
          <Link href={href} className="text-blue-500 hover:text-blue-700 hover:underline">
            {formattedSegment}
          </Link>
        ) : (
          <span className="text-gray-500">{formattedSegment}</span>
        )}
        {!isLast && <span className="mx-2">/</span>}
      </li>
    );
  });

  return (
    <nav aria-label="breadcrumb">
      <ol className="flex text-sm text-gray-600">{breadcrumbs}</ol>
    </nav>
  );
}
