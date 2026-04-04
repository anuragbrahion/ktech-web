import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';
import { toast } from 'react-toastify';
import { getBlogManagement } from '../redux/slices/website';
import { useDispatch } from 'react-redux';
import moment from 'moment-timezone';

const BlogList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await dispatch(getBlogManagement({ page: 1, size: 10 }));

      if (res?.payload) {
        const list = res.payload.data.list || [];
        setBlogs(list);
        setTotal(res.payload.data.total || 0);
        localStorage.setItem('blogs', JSON.stringify(list));
      } else {
        toast.error('Failed to fetch blogs');
      }
    } catch (err) {
      toast.error(err, 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

const handleClick = (blog) => {
  navigate(`/blog/${blog._id}`, { state: { blog } });
};

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!blogs.length) {
    return <p className="text-center py-20 text-gray-500">No blogs found</p>;
  }

  return (
    <div className="bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {blogs.map((blog) => (
            <div
              key={blog._id}
              onClick={() => handleClick(blog)}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition cursor-pointer"
            >
              <div className="h-52 overflow-hidden">
                <img
                  src={blog?.mainImageUrl?.url || "https://cdn-icons-png.flaticon.com/512/17134/17134613.png"}
                  alt={blog?.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  onError={(e) => {
                    e.currentTarget.src = 'https://cdn-icons-png.flaticon.com/512/17134/17134613.png';
                  }}
                />
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex justify-between text-xs text-gray-400 mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {moment(blog.createdAt).format('Do MMMM YYYY')}
                  </span>
                </div>

                <h2 className="text-lg capitalize font-semibold text-gray-800 mb-2 group-hover:text-blue-600">
                  {blog.title}
                </h2>

                <p className="text-sm capitalize text-gray-600 line-clamp-2">
                  {blog.shortDescription}
                </p>

                <div className="mt-4 text-blue-600 text-sm font-medium">
                  Read More →
                </div>

              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default BlogList;