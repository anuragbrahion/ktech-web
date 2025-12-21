import React, { useState } from 'react';
import { 
  PlayCircle, 
  Users, 
  BookOpen, 
  Award, 
  Star, 
  ChevronLeft, 
  ChevronRight,
  MessageCircle,
  Calendar,
  User,
  CheckCircle,
  ArrowRight,
  Globe,
  Clock,
  TrendingUp
} from 'lucide-react';

const HomePage = () => {
  const [activeSection, setActiveSection] = useState('banner');
  const [bannerData, setBannerData] = useState({
    heading: 'Learn Anytime, Anywhere',
    subHeading: 'Unlock your potential with our comprehensive online courses',
    bannerLogo: '',
    bannerColor: '#0ea5e9',
    buttonText: 'Get Started',
    buttonColor: '#0ea5e9'
  });

  const [instructorData, setInstructorData] = useState({
    heading: 'Become an Instructor',
    subHeading: 'Share your knowledge and earn while teaching',
    bannerLogo: '',
    bannerColor: '#1e293b',
    buttonText: 'Apply Now',
    buttonColor: '#f59e0b'
  });

  const [coursesData, setCoursesData] = useState({
    heading: 'Over 50 Courses',
    subHeading: 'Explore our wide range of courses designed for your success'
  });

  const [howItWorksData, setHowItWorksData] = useState({
    heading: 'How It Works',
    subHeading: 'Simple steps to start your learning journey',
    backgroundColor: '#f0f9ff',
    steps: [
      { title: 'Browse Courses', description: 'Find the perfect course for your needs' },
      { title: 'Enroll Now', description: 'Simple registration process' },
      { title: 'Start Learning', description: 'Access course materials immediately' },
      { title: 'Get Certified', description: 'Receive your completion certificate' }
    ]
  });

  const [testimonialData, setTestimonialData] = useState({
    heading: 'What Our Students Say',
    subHeading: 'Join thousands of successful learners',
    testimonials: [
      { name: 'Sarah Johnson', role: 'Web Developer', comment: 'The courses transformed my career!', rating: 5 },
      { name: 'Michael Chen', role: 'Data Scientist', comment: 'Best learning platform I\'ve used.', rating: 5 },
      { name: 'Emma Wilson', role: 'UI/UX Designer', comment: 'Practical and engaging content.', rating: 4 }
    ]
  });

  const [blogData, setBlogData] = useState({
    heading: 'Latest from Our Blog',
    subHeading: 'Insights, tips and industry news',
    posts: [
      { title: 'Future of Online Education', excerpt: 'Exploring trends in digital learning...', date: 'Mar 15, 2024', author: 'Admin' },
      { title: 'Mastering React in 2024', excerpt: 'Latest techniques and best practices...', date: 'Mar 12, 2024', author: 'Tech Team' },
      { title: 'Career Growth Strategies', excerpt: 'How to advance your career with online courses...', date: 'Mar 10, 2024', author: 'Career Coach' }
    ]
  });

  const sections = [
    { id: 'banner', label: 'Banner', icon: PlayCircle },
    { id: 'instructor', label: 'Become Instructor', icon: Users },
    { id: 'courses', label: 'Courses Section', icon: BookOpen },
    { id: 'howItWorks', label: 'How It Works', icon: Award },
    { id: 'testimonial', label: 'Testimonials', icon: Star },
    { id: 'blog', label: 'Blog Section', icon: MessageCircle }
  ];

  const RichTextEditor = ({ value, onChange, placeholder }) => {
    const [text, setText] = useState(value || '');

    const handleChange = (e) => {
      setText(e.currentTarget.innerHTML);
      onChange(e.currentTarget.innerHTML);
    };

    const applyStyle = (style) => {
      document.execCommand(style, false, null);
    };

    return (
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-300 p-2 flex gap-2">
          <button
            type="button"
            onClick={() => applyStyle('bold')}
            className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm font-semibold"
          >
            B
          </button>
          <button
            type="button"
            onClick={() => applyStyle('italic')}
            className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm italic"
          >
            I
          </button>
          <button
            type="button"
            onClick={() => applyStyle('underline')}
            className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm underline"
          >
            U
          </button>
          <div className="w-px h-6 bg-gray-300 mx-2"></div>
          <button
            type="button"
            onClick={() => applyStyle('justifyLeft')}
            className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100"
          >
            ⎡
          </button>
          <button
            type="button"
            onClick={() => applyStyle('justifyCenter')}
            className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100"
          >
            ⎢
          </button>
          <button
            type="button"
            onClick={() => applyStyle('justifyRight')}
            className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100"
          >
            ⎤
          </button>
        </div>
        <div
          contentEditable
          className="min-h-[100px] p-4 focus:outline-none bg-white"
          dangerouslySetInnerHTML={{ __html: text }}
          onInput={handleChange}
          placeholder={placeholder}
        />
      </div>
    );
  };

  const ColorPicker = ({ value, onChange, label }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );

  const renderEditor = () => {
    switch (activeSection) {
      case 'banner':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Heading</label>
                <RichTextEditor
                  value={bannerData.heading}
                  onChange={(value) => setBannerData({...bannerData, heading: value})}
                  placeholder="Enter banner heading..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sub Heading</label>
                <RichTextEditor
                  value={bannerData.subHeading}
                  onChange={(value) => setBannerData({...bannerData, subHeading: value})}
                  placeholder="Enter sub heading..."
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                <input
                  type="text"
                  value={bannerData.buttonText}
                  onChange={(e) => setBannerData({...bannerData, buttonText: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter button text"
                />
              </div>
              <div>
                <ColorPicker
                  value={bannerData.buttonColor}
                  onChange={(value) => setBannerData({...bannerData, buttonColor: value})}
                  label="Button Color"
                />
              </div>
            </div>

            <ColorPicker
              value={bannerData.bannerColor}
              onChange={(value) => setBannerData({...bannerData, bannerColor: value})}
              label="Banner Background Color"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Banner Logo URL</label>
              <input
                type="text"
                value={bannerData.bannerLogo}
                onChange={(e) => setBannerData({...bannerData, bannerLogo: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter logo URL or upload..."
              />
            </div>
          </div>
        );

      case 'instructor':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Heading</label>
                <RichTextEditor
                  value={instructorData.heading}
                  onChange={(value) => setInstructorData({...instructorData, heading: value})}
                  placeholder="Enter instructor heading..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sub Heading</label>
                <RichTextEditor
                  value={instructorData.subHeading}
                  onChange={(value) => setInstructorData({...instructorData, subHeading: value})}
                  placeholder="Enter sub heading..."
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                <input
                  type="text"
                  value={instructorData.buttonText}
                  onChange={(e) => setInstructorData({...instructorData, buttonText: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter button text"
                />
              </div>
              <div>
                <ColorPicker
                  value={instructorData.buttonColor}
                  onChange={(value) => setInstructorData({...instructorData, buttonColor: value})}
                  label="Button Color"
                />
              </div>
            </div>

            <ColorPicker
              value={instructorData.bannerColor}
              onChange={(value) => setInstructorData({...instructorData, bannerColor: value})}
              label="Section Background Color"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Banner Logo URL</label>
              <input
                type="text"
                value={instructorData.bannerLogo}
                onChange={(e) => setInstructorData({...instructorData, bannerLogo: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter logo URL or upload..."
              />
            </div>
          </div>
        );

      case 'courses':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Heading</label>
                <RichTextEditor
                  value={coursesData.heading}
                  onChange={(value) => setCoursesData({...coursesData, heading: value})}
                  placeholder="Enter courses heading..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sub Heading</label>
                <RichTextEditor
                  value={coursesData.subHeading}
                  onChange={(value) => setCoursesData({...coursesData, subHeading: value})}
                  placeholder="Enter sub heading..."
                />
              </div>
            </div>
          </div>
        );

      case 'howItWorks':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Heading</label>
                <RichTextEditor
                  value={howItWorksData.heading}
                  onChange={(value) => setHowItWorksData({...howItWorksData, heading: value})}
                  placeholder="Enter heading..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sub Heading</label>
                <RichTextEditor
                  value={howItWorksData.subHeading}
                  onChange={(value) => setHowItWorksData({...howItWorksData, subHeading: value})}
                  placeholder="Enter sub heading..."
                />
              </div>
            </div>

            <ColorPicker
              value={howItWorksData.backgroundColor}
              onChange={(value) => setHowItWorksData({...howItWorksData, backgroundColor: value})}
              label="Section Background Color"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Steps</label>
              {howItWorksData.steps.map((step, index) => (
                <div key={index} className="mb-4 p-4 border border-gray-300 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-800">Step {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => {
                        const newSteps = [...howItWorksData.steps];
                        newSteps.splice(index, 1);
                        setHowItWorksData({...howItWorksData, steps: newSteps});
                      }}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => {
                      const newSteps = [...howItWorksData.steps];
                      newSteps[index].title = e.target.value;
                      setHowItWorksData({...howItWorksData, steps: newSteps});
                    }}
                    className="w-full mb-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Step title"
                  />
                  <input
                    type="text"
                    value={step.description}
                    onChange={(e) => {
                      const newSteps = [...howItWorksData.steps];
                      newSteps[index].description = e.target.value;
                      setHowItWorksData({...howItWorksData, steps: newSteps});
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Step description"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  setHowItWorksData({
                    ...howItWorksData,
                    steps: [...howItWorksData.steps, { title: '', description: '' }]
                  });
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                + Add Step
              </button>
            </div>
          </div>
        );

      case 'testimonial':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Heading</label>
                <RichTextEditor
                  value={testimonialData.heading}
                  onChange={(value) => setTestimonialData({...testimonialData, heading: value})}
                  placeholder="Enter heading..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sub Heading</label>
                <RichTextEditor
                  value={testimonialData.subHeading}
                  onChange={(value) => setTestimonialData({...testimonialData, subHeading: value})}
                  placeholder="Enter sub heading..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Testimonials</label>
              {testimonialData.testimonials.map((testimonial, index) => (
                <div key={index} className="mb-4 p-4 border border-gray-300 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-800">Testimonial {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => {
                        const newTestimonials = [...testimonialData.testimonials];
                        newTestimonials.splice(index, 1);
                        setTestimonialData({...testimonialData, testimonials: newTestimonials});
                      }}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={testimonial.name}
                      onChange={(e) => {
                        const newTestimonials = [...testimonialData.testimonials];
                        newTestimonials[index].name = e.target.value;
                        setTestimonialData({...testimonialData, testimonials: newTestimonials});
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Name"
                    />
                    <input
                      type="text"
                      value={testimonial.role}
                      onChange={(e) => {
                        const newTestimonials = [...testimonialData.testimonials];
                        newTestimonials[index].role = e.target.value;
                        setTestimonialData({...testimonialData, testimonials: newTestimonials});
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Role"
                    />
                    <textarea
                      value={testimonial.comment}
                      onChange={(e) => {
                        const newTestimonials = [...testimonialData.testimonials];
                        newTestimonials[index].comment = e.target.value;
                        setTestimonialData({...testimonialData, testimonials: newTestimonials});
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Testimonial text"
                      rows="2"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Rating:</span>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => {
                            const newTestimonials = [...testimonialData.testimonials];
                            newTestimonials[index].rating = star;
                            setTestimonialData({...testimonialData, testimonials: newTestimonials});
                          }}
                          className={`p-1 ${star <= testimonial.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                        >
                          <Star size={16} fill={star <= testimonial.rating ? 'currentColor' : 'none'} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  setTestimonialData({
                    ...testimonialData,
                    testimonials: [...testimonialData.testimonials, { 
                      name: '', 
                      role: '', 
                      comment: '', 
                      rating: 5 
                    }]
                  });
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                + Add Testimonial
              </button>
            </div>
          </div>
        );

      case 'blog':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Heading</label>
                <RichTextEditor
                  value={blogData.heading}
                  onChange={(value) => setBlogData({...blogData, heading: value})}
                  placeholder="Enter heading..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sub Heading</label>
                <RichTextEditor
                  value={blogData.subHeading}
                  onChange={(value) => setBlogData({...blogData, subHeading: value})}
                  placeholder="Enter sub heading..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Blog Posts</label>
              {blogData.posts.map((post, index) => (
                <div key={index} className="mb-4 p-4 border border-gray-300 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-800">Post {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => {
                        const newPosts = [...blogData.posts];
                        newPosts.splice(index, 1);
                        setBlogData({...blogData, posts: newPosts});
                      }}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={post.title}
                      onChange={(e) => {
                        const newPosts = [...blogData.posts];
                        newPosts[index].title = e.target.value;
                        setBlogData({...blogData, posts: newPosts});
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Post title"
                    />
                    <textarea
                      value={post.excerpt}
                      onChange={(e) => {
                        const newPosts = [...blogData.posts];
                        newPosts[index].excerpt = e.target.value;
                        setBlogData({...blogData, posts: newPosts});
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Post excerpt"
                      rows="2"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={post.date}
                        onChange={(e) => {
                          const newPosts = [...blogData.posts];
                          newPosts[index].date = e.target.value;
                          setBlogData({...blogData, posts: newPosts});
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Date"
                      />
                      <input
                        type="text"
                        value={post.author}
                        onChange={(e) => {
                          const newPosts = [...blogData.posts];
                          newPosts[index].author = e.target.value;
                          setBlogData({...blogData, posts: newPosts});
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Author"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  setBlogData({
                    ...blogData,
                    posts: [...blogData.posts, { 
                      title: '', 
                      excerpt: '', 
                      date: '', 
                      author: '' 
                    }]
                  });
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                + Add Blog Post
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const PreviewSection = () => {
    switch (activeSection) {
      case 'banner':
        return (
          <div 
            className="rounded-xl p-8 text-white shadow-xl"
            style={{ backgroundColor: bannerData.bannerColor }}
          >
            <div className="max-w-2xl">
              <h1 
                className="text-3xl md:text-4xl font-bold mb-4"
                dangerouslySetInnerHTML={{ __html: bannerData.heading }}
              />
              <p 
                className="text-lg mb-8 opacity-90"
                dangerouslySetInnerHTML={{ __html: bannerData.subHeading }}
              />
              <button 
                className="px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition"
                style={{ backgroundColor: bannerData.buttonColor }}
              >
                {bannerData.buttonText}
              </button>
            </div>
          </div>
        );

      case 'instructor':
        return (
          <div 
            className="rounded-xl p-8 text-white shadow-xl"
            style={{ backgroundColor: instructorData.bannerColor }}
          >
            <div className="max-w-2xl">
              <h1 
                className="text-3xl md:text-4xl font-bold mb-4"
                dangerouslySetInnerHTML={{ __html: instructorData.heading }}
              />
              <p 
                className="text-lg mb-8 opacity-90"
                dangerouslySetInnerHTML={{ __html: instructorData.subHeading }}
              />
              <button 
                className="px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition"
                style={{ backgroundColor: instructorData.buttonColor }}
              >
                {instructorData.buttonText}
              </button>
            </div>
          </div>
        );

      case 'courses':
        return (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 
                className="text-3xl font-bold text-gray-800 mb-4"
                dangerouslySetInnerHTML={{ __html: coursesData.heading }}
              />
              <p 
                className="text-gray-600"
                dangerouslySetInnerHTML={{ __html: coursesData.subHeading }}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2">Course Title {i}</h3>
                  <p className="text-gray-600 text-sm mb-4">Brief description of the course content</p>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 font-semibold">$99</span>
                    <span className="text-gray-500 text-sm">⭐ 4.8</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'howItWorks':
        return (
          <div 
            className="rounded-xl p-8 shadow-xl"
            style={{ backgroundColor: howItWorksData.backgroundColor }}
          >
            <div className="text-center mb-12">
              <h2 
                className="text-3xl font-bold text-gray-800 mb-4"
                dangerouslySetInnerHTML={{ __html: howItWorksData.heading }}
              />
              <p 
                className="text-gray-600"
                dangerouslySetInnerHTML={{ __html: howItWorksData.subHeading }}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {howItWorksData.steps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
                    {index + 1}
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'testimonial':
        return (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-12">
              <h2 
                className="text-3xl font-bold text-gray-800 mb-4"
                dangerouslySetInnerHTML={{ __html: testimonialData.heading }}
              />
              <p 
                className="text-gray-600"
                dangerouslySetInnerHTML={{ __html: testimonialData.subHeading }}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonialData.testimonials.map((testimonial, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
                  <div className="flex items-center gap-2 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        className={i < testimonial.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic">"{testimonial.comment}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                      <p className="text-gray-600 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'blog':
        return (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-12">
              <h2 
                className="text-3xl font-bold text-gray-800 mb-4"
                dangerouslySetInnerHTML={{ __html: blogData.heading }}
              />
              <p 
                className="text-gray-600"
                dangerouslySetInnerHTML={{ __html: blogData.subHeading }}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogData.posts.map((post, index) => (
                <div key={index} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition">
                  <div className="h-48 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {post.date}
                      </span>
                      <span>By {post.author}</span>
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg mb-3">{post.title}</h3>
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                    <button className="text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
                      Read More <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="w-full mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Home Page Editor</h1>
          <p className="text-gray-600">Edit and preview your home page sections</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-bold text-gray-800 mb-4">Sections</h3>
              <div className="space-y-2">
                {sections.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveSection(id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      activeSection === id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{label}</span>
                  </button>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => console.log('Save data:', {
                    bannerData,
                    instructorData,
                    coursesData,
                    howItWorksData,
                    testimonialData,
                    blogData
                  })}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition"
                >
                  Save All Changes
                </button>
                <button className="w-full mt-3 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                  Reset to Default
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Editor Panel */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  Edit {sections.find(s => s.id === activeSection)?.label}
                </h3>
                <span className="text-sm text-gray-500">Live Preview Below</span>
              </div>
              {renderEditor()}
            </div>

            {/* Preview Panel */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Preview</h3>
              <PreviewSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;