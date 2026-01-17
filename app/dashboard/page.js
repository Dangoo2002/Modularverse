'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { fetchWithAuth, getUser } from '../lib/auth';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [analytics, setAnalytics] = useState({ postCount: 0, userCount: 0 });
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function init() {
      try {
        const u = await getUser();
        if (!u) {
          setRedirecting(true);
          router.push('/login');
          return;
        }
        setUser(u);
        await loadPosts();
        if (u.role === 'admin') await loadAnalytics();
      } catch (err) {
        console.error('Auth error:', err);
        setRedirecting(true);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [router]);

  const loadPosts = async () => {
    try {
      const res = await fetchWithAuth('/posts');
      if (res.ok) {
        setPosts(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadAnalytics = async () => {
    try {
      const [postRes, userRes] = await Promise.all([
        fetchWithAuth('/posts'),
        fetchWithAuth('/users'),
      ]);
      if (postRes.ok && userRes.ok) {
        setAnalytics({
          postCount: (await postRes.json()).length,
          userCount: (await userRes.json()).length,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetchWithAuth('/posts', {
        method: 'POST',
        body: JSON.stringify({ ...newPost, status: 'draft' }),
      });
      if (res.ok) {
        setNewPost({ title: '', content: '' });
        loadPosts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePublishToggle = async (post) => {
    try {
      const newStatus = post.status === 'draft' ? 'published' : 'draft';
      const res = await fetchWithAuth(`/posts/${post._id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) loadPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      const res = await fetchWithAuth(`/posts/${id}`, { method: 'DELETE' });
      if (res.ok) loadPosts();
    } catch (err) {
      console.error(err);
    }
  };

  // Show loading or redirecting state
  if (loading || redirecting || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          {redirecting ? (
            <p className="text-gray-600">Redirecting to login...</p>
          ) : (
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-32 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 mb-10">
            Welcome back, {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
          </p>

          {user.role === 'admin' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Posts</h3>
                <p className="text-4xl font-bold text-gray-900">{analytics.postCount}</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Users</h3>
                <p className="text-4xl font-bold text-gray-900">{analytics.userCount}</p>
              </div>
            </div>
          )}

          {(user.role === 'admin' || user.role === 'editor') && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Post</h2>
              <form onSubmit={handleCreate} className="space-y-5">
                <div>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    placeholder="Post title"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all text-black"
                    required
                  />
                </div>
                <div>
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    placeholder="Write your content here..."
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all resize-none text-black"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Create Draft
                </button>
              </form>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 md:p-8 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900">Your Content</h2>
            </div>
            {posts.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                No posts yet. {user.role !== 'viewer' && 'Create your first post above.'}
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {posts.map((post) => (
                  <div key={post._id} className="p-6 md:p-8 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                          </span>
                          <span>by {post.author?.name || 'You'}</span>
                        </div>
                        <p className="text-gray-600 line-clamp-3">{post.content}</p>
                      </div>

                      {(user.role === 'admin' || user.role === 'editor') && (
                        <div className="flex flex-row md:flex-col gap-3 mt-4 md:mt-0">
                          <button
                            onClick={() => handlePublishToggle(post)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              post.status === 'draft'
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-yellow-600 text-white hover:bg-yellow-700'
                            }`}
                          >
                            {post.status === 'draft' ? 'Publish' : 'Unpublish'}
                          </button>
                          <button
                            onClick={() => handleDelete(post._id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}