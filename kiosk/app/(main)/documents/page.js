import Link from "next/link";

export default function DocumentsLandingPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6"></h1>
      <ul className="space-y-4 text-lg">
        <li>
          <Link
            href="/documents/upload"
            className="text-emerald-600 hover:underline"
          >
          </Link>
        </li>
        <li>
          <Link
            href="/documents/view"
            className="text-emerald-600 hover:underline"
          >
          </Link>
        </li>
      </ul>
    </div>
  );
}
