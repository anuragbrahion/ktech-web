import React, { useState, useEffect } from 'react';
import { 
  PlayCircle, 
  Users, 
  BookOpen, 
  Award, 
  Star,  
  MessageCircle,
  Calendar,
  User,
   ArrowRight, 
  Save,
  Upload,
   X
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { createHomeManagement } from '../../../redux/slices/website';
import { useDispatch } from 'react-redux';
import { apiUrl } from '../../../utils/axiosProvider';

const HomePage = () => {
  const dispatch = useDispatch()
  const [activeSection, setActiveSection] = useState('banner');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [bannerData, setBannerData] = useState({
    heading: '',
    subHeading: '',
    bannerLogo: [],
    bgColor: '#ffffff',
    buttonText: 'Get Started',
    buttonColor: '#0ea5e9'
  });
    const [instructorData, setInstructorData] = useState({
    heading: '',
    subHeading: '',
    bgColor: '#3f8278',
    buttonText: 'Apply Now',
    buttonColor: '#f59e0b'
  });

  const [coursesData, setCoursesData] = useState({
    heading: '',
    subHeading: ''
  });

  const [howItWorksData, setHowItWorksData] = useState({
    heading: '',
    subHeading: '',
    bgColor: '#f0f9ff',
    steps: [
      { title: '', description: '' },
      { title: '', description: '' },
      { title: '', description: '' },
      { title: '', description: '' }
    ]
  });

  const [testimonialData, setTestimonialData] = useState({
    heading: '',
    subHeading: '',
    testimonials: [
      { name: '', role: '', comment: '', rating: 5 },
      { name: '', role: '', comment: '', rating: 5 },
      { name: '', role: '', comment: '', rating: 4 }
    ]
  });

  const [blogData, setBlogData] = useState({
    heading: '',
    subHeading: '',
    posts: [
      { title: '', excerpt: '', date: '', author: '' },
      { title: '', excerpt: '', date: '', author: '' },
      { title: '', excerpt: '', date: '', author: '' }
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

  const RichTextEditor = ({ value, onChange }) => {
    const handleChange = (e) => {
      onChange(e.currentTarget.innerHTML);
    };

    const applyStyle = (style) => {
      document.execCommand(style, false, null);
    };

    return (
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-300 p-2 flex gap-2">
          <button type="button" onClick={() => applyStyle('bold')} className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm font-semibold">B</button>
          <button type="button" onClick={() => applyStyle('italic')} className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm italic">I</button>
          <button type="button" onClick={() => applyStyle('underline')} className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm underline">U</button>
          <div className="w-px h-6 bg-gray-300 mx-2"></div>
          <button type="button" onClick={() => applyStyle('justifyLeft')} className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100">⎡</button>
          <button type="button" onClick={() => applyStyle('justifyCenter')} className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100">⎢</button>
          <button type="button" onClick={() => applyStyle('justifyRight')} className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100">⎤</button>
        </div>
        <div contentEditable className="min-h-[100px] p-4 focus:outline-none bg-white" dangerouslySetInnerHTML={{ __html: value || '' }} onInput={handleChange} />
      </div>
    );
  };

  const ColorPicker = ({ value, onChange, label }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex items-center gap-3">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="w-10 h-10 cursor-pointer" />
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
    </div>
  );

  const handleImageUpload = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('files', file);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${apiUrl}/files/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
       if (response.data && response.data.data) {
           setBannerData(prev => ({
            ...prev,
            bannerLogo: response.data.data
          })); 
        toast.success('Image uploaded successfully');
      }
    } catch (error) {
      toast.error(error||'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (section) => {
    if (section === 'banner') {
      setBannerData(prev => ({ ...prev, bannerLogo: [] }));
    }
  };

  const preparePayload = () => {
    return {
      banner: {
        heading: bannerData.heading || '<p>We Have Provide Best Education In Surat Gujarat</p>',
        subHeading: bannerData.subHeading || '<p><span style="color: rgb(0, 41, 102);">HAND HOLDING SUPPORT</span></p>',
        bgColor: bannerData.bgColor,
        bannerLogo: bannerData.bannerLogo
      },
      becomeInstructor: {
        heading: instructorData.heading || '<p>28+ computer courses Available</p>',
        subHeading: instructorData.subHeading || '<p>Bigginer to advance level computer courses.</p>',
        bgColor: instructorData.bgColor
      },
      allCoursesHeading: coursesData.heading || '<p>Basic courses, Accounting courses, programming courses, desigining courses.</p>',
      over50Courses: {
        heading: coursesData.heading || '<p>MS-OFFICE, TALLY, PHOTOSHOP, CorelDraw, Tripta relly&redix, Adobe illustrator, Spoken English, Embroidery design, Textile Design, Html, Css, java, Java Script, Php, Python, C Language, C++, Digital Print, Computer Hardware, Ui/Ux, Empire, Hindi Typing, Gujarati Typing And Internet</p>',
        subHeading: coursesData.subHeading || '<p><span class="ql-font-serif">Multi Diploma And Advance Diploma Courses Avaiable</span></p>'
      },
      howItWorks: {
        heading: howItWorksData.heading || '<p>28+ computer courses Available</p>',
        subHeading: howItWorksData.subHeading || '<p>Bigginer to advance level computer courses.</p>',
        bgColor: howItWorksData.bgColor
      },
      blogs: {
        heading: blogData.heading || '<p>BLOGS</p>',
        subHeading: blogData.subHeading || '<p>Related to Computers and IT Field</p>'
      },
      testimonial: {
        heading: testimonialData.heading || '<p>test heading</p>',
        subHeading: testimonialData.subHeading || '<p>test subheading</p>'
      }
    };
  };

  const handleSave = async () => {
    setLoading(true);
    const payload = preparePayload();
    
    try {
       const response = await dispatch(createHomeManagement(payload)) 

      if (response.data.success) {
        toast.success('Home page data saved successfully');
      } else {
        toast.error(response.data.message || 'Failed to save data');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save data');
    } finally {
      setLoading(false);
    }
  };

  const fetchHomeData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${apiUrl}/website/home`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success && response.data.data) {
        const data = response.data.data;
        
        if (data.banner) {
          setBannerData(prev => ({
            ...prev,
            heading: data.banner.heading || '',
            subHeading: data.banner.subHeading || '',
            bgColor: data.banner.bgColor || '#ffffff',
            bannerLogo: data.banner.bannerLogo || []
          }));
        }

        if (data.becomeInstructor) {
          setInstructorData(prev => ({
            ...prev,
            heading: data.becomeInstructor.heading || '',
            subHeading: data.becomeInstructor.subHeading || '',
            bgColor: data.becomeInstructor.bgColor || '#3f8278'
          }));
        }

        if (data.over50Courses) {
          setCoursesData({
            heading: data.over50Courses.heading || '',
            subHeading: data.over50Courses.subHeading || ''
          });
        }

        if (data.howItWorks) {
          setHowItWorksData(prev => ({
            ...prev,
            heading: data.howItWorks.heading || '',
            subHeading: data.howItWorks.subHeading || '',
            bgColor: data.howItWorks.bgColor || '#f0f9ff'
          }));
        }

        if (data.blogs) {
          setBlogData(prev => ({
            ...prev,
            heading: data.blogs.heading || '',
            subHeading: data.blogs.subHeading || ''
          }));
        }

        if (data.testimonial) {
          setTestimonialData(prev => ({
            ...prev,
            heading: data.testimonial.heading || '',
            subHeading: data.testimonial.subHeading || ''
          }));
        }
      }
    } catch (error) {
      console.error('Failed to fetch home data:', error);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  const renderEditor = () => {
    switch (activeSection) {
      case 'banner':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Heading</label>
                <RichTextEditor value={bannerData.heading} onChange={(value) => setBannerData({...bannerData, heading: value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sub Heading</label>
                <RichTextEditor value={bannerData.subHeading} onChange={(value) => setBannerData({...bannerData, subHeading: value})} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                <input type="text" value={bannerData.buttonText} onChange={(e) => setBannerData({...bannerData, buttonText: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <ColorPicker value={bannerData.buttonColor} onChange={(value) => setBannerData({...bannerData, buttonColor: value})} label="Button Color" />
              </div>
            </div>

            <ColorPicker value={bannerData.bgColor} onChange={(value) => setBannerData({...bannerData, bgColor: value})} label="Background Color" />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Banner Logo</label>
              <div className="space-y-4">
                {bannerData.bannerLogo.length > 0 ? (
                  <div className="relative">
                    <img src={bannerData.bannerLogo[0].url} alt="Banner logo" className="w-32 h-32 object-contain border rounded-lg" />
                    <button onClick={() => removeImage('banner')} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <input type="file" accept="image/*" onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0], 'banner')} className="hidden" id="banner-upload" />
                    <label htmlFor="banner-upload" className="cursor-pointer flex flex-col items-center gap-2">
                      <Upload className="w-8 h-8 text-gray-400" />
                      <span className="text-sm text-gray-500">Click to upload banner logo</span>
                      <span className="text-xs text-gray-400">PNG, JPG, GIF up to 5MB</span>
                    </label>
                  </div>
                )}
                {uploading && <p className="text-sm text-blue-600">Uploading...</p>}
              </div>
            </div>
          </div>
        );

      case 'instructor':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Heading</label>
                <RichTextEditor value={instructorData.heading} onChange={(value) => setInstructorData({...instructorData, heading: value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sub Heading</label>
                <RichTextEditor value={instructorData.subHeading} onChange={(value) => setInstructorData({...instructorData, subHeading: value})} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                <input type="text" value={instructorData.buttonText} onChange={(e) => setInstructorData({...instructorData, buttonText: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <ColorPicker value={instructorData.buttonColor} onChange={(value) => setInstructorData({...instructorData, buttonColor: value})} label="Button Color" />
              </div>
            </div>

            <ColorPicker value={instructorData.bgColor} onChange={(value) => setInstructorData({...instructorData, bgColor: value})} label="Background Color" />
          </div>
        );

      case 'courses':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Heading</label>
                <RichTextEditor value={coursesData.heading} onChange={(value) => setCoursesData({...coursesData, heading: value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sub Heading</label>
                <RichTextEditor value={coursesData.subHeading} onChange={(value) => setCoursesData({...coursesData, subHeading: value})} />
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
                <RichTextEditor value={howItWorksData.heading} onChange={(value) => setHowItWorksData({...howItWorksData, heading: value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sub Heading</label>
                <RichTextEditor value={howItWorksData.subHeading} onChange={(value) => setHowItWorksData({...howItWorksData, subHeading: value})} />
              </div>
            </div>

            <ColorPicker value={howItWorksData.bgColor} onChange={(value) => setHowItWorksData({...howItWorksData, bgColor: value})} label="Background Color" />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Steps</label>
              {howItWorksData.steps.map((step, index) => (
                <div key={index} className="mb-4 p-4 border border-gray-300 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-800">Step {index + 1}</h4>
                    <button type="button" onClick={() => {
                      const newSteps = [...howItWorksData.steps];
                      newSteps.splice(index, 1);
                      setHowItWorksData({...howItWorksData, steps: newSteps});
                    }} className="text-red-600 hover:text-red-800 text-sm">Remove</button>
                  </div>
                  <input type="text" value={step.title} onChange={(e) => {
                    const newSteps = [...howItWorksData.steps];
                    newSteps[index].title = e.target.value;
                    setHowItWorksData({...howItWorksData, steps: newSteps});
                  }} className="w-full mb-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <input type="text" value={step.description} onChange={(e) => {
                    const newSteps = [...howItWorksData.steps];
                    newSteps[index].description = e.target.value;
                    setHowItWorksData({...howItWorksData, steps: newSteps});
                  }} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              ))}
              <button type="button" onClick={() => {
                setHowItWorksData({
                  ...howItWorksData,
                  steps: [...howItWorksData.steps, { title: '', description: '' }]
                });
              }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">+ Add Step</button>
            </div>
          </div>
        );

      case 'testimonial':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Heading</label>
                <RichTextEditor value={testimonialData.heading} onChange={(value) => setTestimonialData({...testimonialData, heading: value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sub Heading</label>
                <RichTextEditor value={testimonialData.subHeading} onChange={(value) => setTestimonialData({...testimonialData, subHeading: value})} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Testimonials</label>
              {testimonialData.testimonials.map((testimonial, index) => (
                <div key={index} className="mb-4 p-4 border border-gray-300 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-800">Testimonial {index + 1}</h4>
                    <button type="button" onClick={() => {
                      const newTestimonials = [...testimonialData.testimonials];
                      newTestimonials.splice(index, 1);
                      setTestimonialData({...testimonialData, testimonials: newTestimonials});
                    }} className="text-red-600 hover:text-red-800 text-sm">Remove</button>
                  </div>
                  <div className="space-y-3">
                    <input type="text" value={testimonial.name} onChange={(e) => {
                      const newTestimonials = [...testimonialData.testimonials];
                      newTestimonials[index].name = e.target.value;
                      setTestimonialData({...testimonialData, testimonials: newTestimonials});
                    }} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <input type="text" value={testimonial.role} onChange={(e) => {
                      const newTestimonials = [...testimonialData.testimonials];
                      newTestimonials[index].role = e.target.value;
                      setTestimonialData({...testimonialData, testimonials: newTestimonials});
                    }} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <textarea value={testimonial.comment} onChange={(e) => {
                      const newTestimonials = [...testimonialData.testimonials];
                      newTestimonials[index].comment = e.target.value;
                      setTestimonialData({...testimonialData, testimonials: newTestimonials});
                    }} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" rows="2" />
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Rating:</span>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} type="button" onClick={() => {
                          const newTestimonials = [...testimonialData.testimonials];
                          newTestimonials[index].rating = star;
                          setTestimonialData({...testimonialData, testimonials: newTestimonials});
                        }} className={`p-1 ${star <= testimonial.rating ? 'text-yellow-500' : 'text-gray-300'}`}>
                          <Star size={16} fill={star <= testimonial.rating ? 'currentColor' : 'none'} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => {
                setTestimonialData({
                  ...testimonialData,
                  testimonials: [...testimonialData.testimonials, { name: '', role: '', comment: '', rating: 5 }]
                });
              }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">+ Add Testimonial</button>
            </div>
          </div>
        );

      case 'blog':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Heading</label>
                <RichTextEditor value={blogData.heading} onChange={(value) => setBlogData({...blogData, heading: value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sub Heading</label>
                <RichTextEditor value={blogData.subHeading} onChange={(value) => setBlogData({...blogData, subHeading: value})} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Blog Posts</label>
              {blogData.posts.map((post, index) => (
                <div key={index} className="mb-4 p-4 border border-gray-300 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-800">Post {index + 1}</h4>
                    <button type="button" onClick={() => {
                      const newPosts = [...blogData.posts];
                      newPosts.splice(index, 1);
                      setBlogData({...blogData, posts: newPosts});
                    }} className="text-red-600 hover:text-red-800 text-sm">Remove</button>
                  </div>
                  <div className="space-y-3">
                    <input type="text" value={post.title} onChange={(e) => {
                      const newPosts = [...blogData.posts];
                      newPosts[index].title = e.target.value;
                      setBlogData({...blogData, posts: newPosts});
                    }} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <textarea value={post.excerpt} onChange={(e) => {
                      const newPosts = [...blogData.posts];
                      newPosts[index].excerpt = e.target.value;
                      setBlogData({...blogData, posts: newPosts});
                    }} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" rows="2" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input type="text" value={post.date} onChange={(e) => {
                        const newPosts = [...blogData.posts];
                        newPosts[index].date = e.target.value;
                        setBlogData({...blogData, posts: newPosts});
                      }} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      <input type="text" value={post.author} onChange={(e) => {
                        const newPosts = [...blogData.posts];
                        newPosts[index].author = e.target.value;
                        setBlogData({...blogData, posts: newPosts});
                      }} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => {
                setBlogData({
                  ...blogData,
                  posts: [...blogData.posts, { title: '', excerpt: '', date: '', author: '' }]
                });
              }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">+ Add Blog Post</button>
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
          <div className="rounded-xl p-8 text-white shadow-xl" style={{ backgroundColor: bannerData.bgColor }}>
            <div className="max-w-2xl">
              {bannerData.bannerLogo.length > 0 && (
                <img src={bannerData.bannerLogo[0].url} alt="Banner" className="w-32 h-32 mb-6 object-contain" />
              )}
              <h1 className="text-3xl md:text-4xl font-bold mb-4" dangerouslySetInnerHTML={{ __html: bannerData.heading || 'We Have Provide Best Education In Surat Gujarat' }} />
              <p className="text-lg mb-8 opacity-90" dangerouslySetInnerHTML={{ __html: bannerData.subHeading || 'HAND HOLDING SUPPORT' }} />
              <button className="px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition" style={{ backgroundColor: bannerData.buttonColor }}>
                {bannerData.buttonText}
              </button>
            </div>
          </div>
        );

      case 'instructor':
        return (
          <div className="rounded-xl p-8 text-white shadow-xl" style={{ backgroundColor: instructorData.bgColor }}>
            <div className="max-w-2xl">
              <h1 className="text-3xl md:text-4xl font-bold mb-4" dangerouslySetInnerHTML={{ __html: instructorData.heading || '28+ computer courses Available' }} />
              <p className="text-lg mb-8 opacity-90" dangerouslySetInnerHTML={{ __html: instructorData.subHeading || 'Bigginer to advance level computer courses.' }} />
              <button className="px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition" style={{ backgroundColor: instructorData.buttonColor }}>
                {instructorData.buttonText}
              </button>
            </div>
          </div>
        );

      case 'courses':
        return (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4" dangerouslySetInnerHTML={{ __html: coursesData.heading || 'Over 50 Courses' }} />
              <p className="text-gray-600" dangerouslySetInnerHTML={{ __html: coursesData.subHeading || 'Explore our wide range of courses' }} />
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
          <div className="rounded-xl p-8 shadow-xl" style={{ backgroundColor: howItWorksData.bgColor }}>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4" dangerouslySetInnerHTML={{ __html: howItWorksData.heading || 'How It Works' }} />
              <p className="text-gray-600" dangerouslySetInnerHTML={{ __html: howItWorksData.subHeading || 'Simple steps to start your learning journey' }} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {howItWorksData.steps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
                    {index + 1}
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2">{step.title || `Step ${index + 1}`}</h3>
                  <p className="text-gray-600 text-sm">{step.description || 'Description here'}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'testimonial':
        return (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4" dangerouslySetInnerHTML={{ __html: testimonialData.heading || 'What Our Students Say' }} />
              <p className="text-gray-600" dangerouslySetInnerHTML={{ __html: testimonialData.subHeading || 'Join thousands of successful learners' }} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonialData.testimonials.map((testimonial, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
                  <div className="flex items-center gap-2 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} className={i < testimonial.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"} />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic">"{testimonial.comment || 'Testimonial text here'}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">{testimonial.name || 'Student Name'}</h4>
                      <p className="text-gray-600 text-sm">{testimonial.role || 'Role/Position'}</p>
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
              <h2 className="text-3xl font-bold text-gray-800 mb-4" dangerouslySetInnerHTML={{ __html: blogData.heading || 'Latest from Our Blog' }} />
              <p className="text-gray-600" dangerouslySetInnerHTML={{ __html: blogData.subHeading || 'Insights, tips and industry news' }} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogData.posts.map((post, index) => (
                <div key={index} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition">
                  <div className="h-48 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center gap-1"><Calendar size={14} />{post.date || 'Date'}</span>
                      <span>By {post.author || 'Author'}</span>
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg mb-3">{post.title || 'Blog Title'}</h3>
                    <p className="text-gray-600 mb-4">{post.excerpt || 'Blog excerpt here...'}</p>
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
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-bold text-gray-800 mb-4">Sections</h3>
              <div className="space-y-2">
                {sections.map(({ id, label, icon: Icon }) => (
                  <button key={id} onClick={() => setActiveSection(id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeSection === id ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                    <Icon size={20} />
                    <span className="font-medium">{label}</span>
                  </button>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <button onClick={handleSave} disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading ? 'Saving...' : 'Save All Changes'} <Save size={18} />
                </button>
                <button onClick={fetchHomeData} className="w-full mt-3 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                  Refresh Data
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Edit {sections.find(s => s.id === activeSection)?.label}</h3>
                <span className="text-sm text-gray-500">Live Preview Below</span>
              </div>
              {renderEditor()}
            </div>

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