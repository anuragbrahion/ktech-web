import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Share2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { getBlogManagement } from '../redux/slices/website';

const BlogDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [blog, setBlog] = useState(location.state?.blog || null);
  const [loading, setLoading] = useState(!location.state?.blog);

  const loadBlog = async () => {
    setLoading(true);

    const stored = JSON.parse(localStorage.getItem('blogs') || '[]');
    const storedBlog = stored.find((item) => item._id === id);

    if (storedBlog) {
      setBlog(storedBlog);
      setLoading(false);
      return;
    }

    try {
      const res = await dispatch(getBlogManagement({ page: 1, size: 100 }));
      const list = res?.payload?.data?.list || [];

      const fetchedBlog = list.find((item) => item._id === id);

      if (fetchedBlog) {
        setBlog(fetchedBlog);
        localStorage.setItem('blogs', JSON.stringify(list));
      } else {
        toast.error('Blog not found');
        navigate('/welcome', { replace: true });
      }
    } catch {
      toast.error('Unable to load blog');
      navigate('/welcome', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location.state?.blog) {
      setBlog(location.state.blog);
      setLoading(false);
      return;
    }
    loadBlog();
  }, [id]);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  const imageUrl = blog?.mainImageUrl?.url || "https://cdn-icons-png.flaticon.com/512/17134/17134613.png"

  if (loading) {
    return (
      <div className="animate-pulse p-10 max-w-4xl mx-auto">
        <div className="h-64 bg-gray-300 rounded-xl mb-6" />
        <div className="h-6 bg-gray-300 w-3/4 mb-4" />
        <div className="h-4 bg-gray-200 w-1/2 mb-2" />
        <div className="h-4 bg-gray-200 w-full mb-2" />
        <div className="h-4 bg-gray-200 w-full mb-2" />
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className="bg-gray-100 min-h-screen">

      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white shadow-sm px-4 py-3 flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
        >
          <ArrowLeft size={18} />
          Back
        </button>
      </div>

      {/* HERO */}
      <div className="relative h-[50vh]">
        <img
          src={imageUrl}
          alt={blog.title}
          className="w-full h-full object-cover"
          onError={(e) => {
                    e.currentTarget.src = 'https://cdn-icons-png.flaticon.com/512/17134/17134613.png';
                  }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/30" />

        <div className="absolute bottom-8 left-6 right-6 text-white max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-3">
            {blog.title}
          </h1>

          <div className="flex flex-wrap gap-4 text-sm opacity-90">
            <span className="flex items-center gap-2">
              <Calendar size={16} />
              {formatDate(blog.createdAt)}
            </span>

            <span className="flex items-center gap-2">
              <Clock size={16} />
              {Math.ceil(blog.description?.length / 800)} min read
            </span>
          </div>
        </div>
      </div>

      {/* CONTENT CARD */}
      <div className="max-w-3xl mx-auto px-4 -mt-18 relative z-10 pb-16">

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">

          {/* Short Description */}
          {blog.shortDescription && (
            <div className="mb-6 text-lg text-gray-600 border-l-4 border-blue-500 pl-4 italic">
              {blog.shortDescription}
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none text-gray-800">
            {blog.description.split('\n').map((para, index) => (
              <p key={index}>{para}</p>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-10 pt-6 border-t flex justify-between items-center">
            <span className="text-sm text-gray-400">
              Published on {formatDate(blog.createdAt)}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BlogDetail;