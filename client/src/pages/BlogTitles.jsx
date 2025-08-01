import React, { useState } from 'react';
import { Edit, Hash, Sparkle } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

// Set base URL
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const BlogTitles = () => {
  const articleLength = [
    'General', 'Technology', 'Business', 'Health', 'Life Style', 'Education', 'Travel', 'Food'
  ];

  // Function to format blog titles with proper styling
  const formatBlogTitles = (content) => {
    if (!content) return '';
    
    // Split content into lines
    const lines = content.split('\n');
    
    return lines.map((line, index) => {
      const trimmedLine = line.trim();
      
      // Skip empty lines
      if (trimmedLine.length === 0) {
        return <div key={index} className="mb-2" />;
      }
      
      // Check for numbered titles (1., 2., etc.)
      if (trimmedLine.match(/^\d+\./)) {
        return (
          <div key={index} className="mb-3 p-3 bg-gray-50 rounded-lg border-l-4 border-purple-500">
            <span className="text-purple-600 font-semibold mr-2">
              {trimmedLine.match(/^\d+/)[0]}.
            </span>
            <span className="text-gray-800 font-medium">
              {trimmedLine.replace(/^\d+\.\s*/, '')}
            </span>
          </div>
        );
      }
      
      // Check for bullet points
      if (trimmedLine.match(/^[\-•*]\s/)) {
        return (
          <div key={index} className="mb-3 p-3 bg-gray-50 rounded-lg border-l-4 border-purple-500">
            <span className="text-purple-600 mr-2">•</span>
            <span className="text-gray-800 font-medium">
              {trimmedLine.replace(/^[\-•*]\s/, '')}
            </span>
          </div>
        );
      }
      
      // Check for emphasis (text wrapped in * or _)
      if (trimmedLine.includes('*') || trimmedLine.includes('_')) {
        const formattedLine = trimmedLine
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/__(.*?)__/g, '<strong>$1</strong>')
          .replace(/_(.*?)_/g, '<em>$1</em>');
        
        return (
          <div key={index} 
               className="mb-3 p-3 bg-gray-50 rounded-lg border-l-4 border-purple-500"
               dangerouslySetInnerHTML={{ __html: formattedLine }}
          />
        );
      }
      
      // Regular titles
      return (
        <div key={index} className="mb-3 p-3 bg-gray-50 rounded-lg border-l-4 border-purple-500">
          <span className="text-gray-800 font-medium">
            {trimmedLine}
          </span>
        </div>
      );
    });
  };

  const [selectedCategory, setSelectedCategory] = useState('General');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedTitles, setGeneratedTitles] = useState('');
  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!input.trim()) {
      toast.error('Please enter keywords for blog titles');
      return;
    }

    try {
      setLoading(true);
      const prompt = `Generate 10 creative and engaging blog titles for "${input}" in the ${selectedCategory} category. Make them catchy, SEO-friendly, and appealing to readers.`;

      const token = await getToken();
      const { data } = await axios.post(
        '/api/ai/blog-titles',
        {
          prompt,
          length: 200,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setGeneratedTitles(data.content);
        toast.success('Blog titles generated successfully!');
      } else {
        toast.error(data.message || 'Failed to generate blog titles');
      }
    } catch (error) {
      console.error('Error generating blog titles:', error);
      const errorMessage = error.response?.data?.message || 'Failed to generate blog titles. Please try again later.';
      toast.error(errorMessage);
      setGeneratedTitles('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>
      {/* left col */}
      <form
        onSubmit={onSubmitHandler}
        className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'
      >
        <div className='flex items-center gap-3 mb-4'>
          <Sparkle className='w-6 text-[#8E37EB]' />
          <h1 className='text-xl font-semibold'>AI Title Generator</h1>
        </div>

        <p className='mt-6 text-sm font-medium'>Keywords</p>
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type='text'
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300'
          placeholder='The future of Artificial Intelligence is...'
          required
        />

        <p className='mt-4 text-sm font-medium'>Category</p>
        <div className='mt-3 flex gap-3 flex-wrap'>
          {articleLength.map((item) => (
            <span
              key={item}
              onClick={() => setSelectedCategory(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${
                selectedCategory === item
                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                  : 'text-gray-500 border-gray-300'
              }`}
            >
              {item}
            </span>
          ))}
        </div>

        <button
          type='submit'
          disabled={loading}
          className={`w-full flex justify-center items-center gap-2 ${
            loading
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-[#C341F6] to-[#8E37EB] cursor-pointer'
          } text-white px-4 py-2 mt-6 text-sm rounded-lg`}
        >
          <Hash className='w-5' />
          {loading ? 'Generating...' : 'Generate Titles'}
        </button>
      </form>

      {/* right col */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96'>
        <div className='flex items-center gap-3 mb-4'>
          <Hash className='w-5 h-5 text-[#8E37EB]' />
          <h1 className='text-xl font-semibold'>Generated Titles</h1>
        </div>

        {generatedTitles ? (
          <div className='text-sm text-slate-700 overflow-y-auto prose prose-sm max-w-none'>
            {formatBlogTitles(generatedTitles)}
          </div>
        ) : (
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
              <Hash className='w-9 h-9' />
              <p>Enter a topic and click on "Generate Titles" to get started.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogTitles;
