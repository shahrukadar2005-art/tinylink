"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import { formatDate } from "@/lib/utils";
import {
  ArrowLeft,
  ExternalLink,
  MousePointerClick,
  Calendar,
  Link as LinkIcon,
  Loader,
} from "lucide-react";

export default function StatsPage() {
  const { code } = useParams() as { code: string };
  const router = useRouter();

  const [link, setLink] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const shortUrl = `${baseUrl}/${code}`;

  useEffect(() => {
    if (!code) return;

    async function fetchStats() {
      try {
        const res = await fetch(`/api/links/${code}`);
        if (res.status === 404) {
          router.push("/404");
          return;
        }

        const data = await res.json();
        setLink(data);
      } catch (err) {
        console.error("Stats fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [code, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!link) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-xl">Link not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <a
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </a>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Link Statistics
          </h1>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex items-center text-blue-600 mb-2">
                <MousePointerClick className="w-5 h-5 mr-2" />
                <span className="font-semibold">Total Clicks</span>
              </div>
              <p className="text-4xl font-bold text-gray-800">
                {link.totalClicks}
              </p>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <div className="flex items-center text-green-600 mb-2">
                <Calendar className="w-5 h-5 mr-2" />
                <span className="font-semibold">Last Clicked</span>
              </div>
              <p className="text-lg text-gray-800">
                {formatDate(link.lastClickedAt)}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-600 mb-2">
                <LinkIcon className="w-4 h-4 mr-2" />
                Short URL
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={shortUrl}
                  readOnly
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                />
                <button
                  onClick={() => navigator.clipboard.writeText(shortUrl)}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Copy
                </button>
              </div>
            </div>

            <div>
              <label className="flex items-center text-sm font-semibold text-gray-600 mb-2">
                <ExternalLink className="w-4 h-4 mr-2" />
                Target URL
              </label>
              <a
                href={link.targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-blue-600 hover:bg-gray-100 truncate"
              >
                {link.targetUrl}
              </a>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600 mb-2 block">
                Created At
              </label>
              <p className="px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                {formatDate(link.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
