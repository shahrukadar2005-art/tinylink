'use client';

import { useState, useEffect } from 'react';
import AddLinkForm from './AddLinkForm';
import { Trash2, ExternalLink, BarChart3, Copy, Search } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Link {
  id: number;
  code: string;
  targetUrl: string;
  totalClicks: number;
  lastClickedAt: Date | null;
  createdAt: Date;
}

export default function Dashboard() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const res = await fetch('/api/links');
      const data = await res.json();
      setLinks(data);
    } catch (error) {
      console.error('Error fetching links:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteLink = async (code: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return;

    try {
      const res = await fetch(`/api/links/${code}`, { method: 'DELETE' });
      if (res.ok) {
        setLinks(links.filter(link => link.code !== code));
      }
    } catch (error) {
      console.error('Error deleting link:', error);
    }
  };

  const copyToClipboard = (code: string) => {
    const url = `${baseUrl}/${code}`;
    navigator.clipboard.writeText(url);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filteredLinks = links.filter(link =>
    link.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.targetUrl.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <AddLinkForm onLinkCreated={fetchLinks} />

      <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">All Links</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search links..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading links...</p>
          </div>
        ) : filteredLinks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">
              {searchTerm ? 'No links match your search.' : 'No links yet. Create your first one!'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Short Code</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Target URL</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Clicks</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Last Clicked</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLinks.map((link) => (
                  <tr key={link.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <code className="text-blue-600 font-mono font-semibold">{link.code}</code>
                        <button
                          onClick={() => copyToClipboard(link.code)}
                          className="text-gray-400 hover:text-blue-600"
                          title="Copy short URL"
                        >
                          {copiedCode === link.code ? (
                            <span className="text-green-600 text-xs">✓</span>
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={link.targetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1 max-w-md truncate"
                        title={link.targetUrl}
                      >
                        <span className="truncate">{link.targetUrl}</span>
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-gray-800">{link.totalClicks}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatDate(link.lastClickedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <a
                          href={`/code/${link.code}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="View stats"
                        >
                          <BarChart3 className="w-5 h-5" />
                        </a>
                        <button
                          onClick={() => deleteLink(link.code)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete link"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}