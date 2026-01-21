'use client';

import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate prototype');
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-pink-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Teleperson Prototype Generator
            </h1>
            <p className="text-xl text-gray-600">
              Generate AI-powered demo websites in seconds
            </p>
          </div>

          {/* Input Form */}
          {!result && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="url" className="block text-sm font-semibold text-gray-700 mb-2">
                    Enter Website URL
                  </label>
                  <input
                    type="url"
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !url}
                  className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 text-lg shadow-lg"
                >
                  {loading ? 'Generating Demo...' : 'Generate Demo'}
                </button>
              </form>

              {loading && (
                <div className="mt-8">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-gray-600 font-medium">Researching company...</p>
                    <p className="text-sm text-gray-500 mt-2">This may take 30-60 seconds</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Result Display */}
          {result && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Demo Generated!</h2>
                <p className="text-gray-600">Your prototype is ready</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-1 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-1">Company</p>
                    <p className="text-lg text-gray-800">{result.companyName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-1">Industry</p>
                    <p className="text-lg text-gray-800">{result.industry}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-1">Prototype ID</p>
                    <p className="text-sm text-gray-600 font-mono">{result.prototypeId}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <a
                  href={result.previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 text-center shadow-lg"
                >
                  View Demo
                </a>
                <button
                  onClick={() => {
                    setResult(null);
                    setUrl('');
                    setError('');
                  }}
                  className="block w-full py-3 px-6 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all duration-200 text-center"
                >
                  Create Another Demo
                </button>
              </div>
            </div>
          )}

          {/* Info Section */}
          <div className="mt-12 bg-white/50 backdrop-blur rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">How it works</h3>
            <ol className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="font-semibold text-purple-600 mr-2">1.</span>
                <span>Paste any company website URL</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold text-purple-600 mr-2">2.</span>
                <span>AI researches the company and generates a custom chatbot prompt</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold text-purple-600 mr-2">3.</span>
                <span>Get a branded demo website with an AI-powered chat widget</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold text-purple-600 mr-2">4.</span>
                <span>Show prospects what Teleperson looks like on their site</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
