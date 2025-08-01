import { Edit, Sparkle } from 'lucide-react';
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

// Set base URL
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const WriteArticle = () => {
  const articleLength = [
    { length: 800, text: 'short(500-800 words)' },
    { length: 1200, text: 'medium(800-1200 words)' },
    { length: 1600, text: 'long(1200+ words)' },
  ];

  // Function to format article content with proper styling
  const formatArticleContent = (content) => {
    if (!content) return '';
    
    // Split content into lines
    const lines = content.split('\n');
    
    return lines.map((line, index) => {
      const trimmedLine = line.trim();
      
      // Check for headings (lines that start with # or are in ALL CAPS)
      if (trimmedLine.startsWith('#') || 
          (trimmedLine.length > 3 && trimmedLine === trimmedLine.toUpperCase() && trimmedLine.length < 100)) {
        return (
          <h2 key={index} className="text-lg font-bold text-gray-900 mb-3 mt-6 first:mt-0">
            {trimmedLine.replace(/^#+\s*/, '')}
          </h2>
        );
      }
      
      // Check for subheadings (lines that end with : and are shorter)
      if (trimmedLine.endsWith(':') && trimmedLine.length < 50) {
        return (
          <h3 key={index} className="text-md font-semibold text-gray-800 mb-2 mt-4">
            {trimmedLine}
          </h3>
        );
      }
      
      // Check for bullet points or numbered lists
      if (trimmedLine.match(/^[\d\-•*]\s/)) {
        return (
          <li key={index} className="ml-4 mb-1 text-gray-700">
            {trimmedLine.replace(/^[\d\-•*]\s/, '')}
          </li>
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
          <p key={index} 
             className="mb-3 text-gray-700 leading-relaxed"
             dangerouslySetInnerHTML={{ __html: formattedLine }}
          />
        );
      }
      
      // Regular paragraphs
      if (trimmedLine.length > 0) {
        return (
          <p key={index} className="mb-3 text-gray-700 leading-relaxed">
            {trimmedLine}
          </p>
        );
      }
      
      // Empty lines for spacing
      return <div key={index} className="mb-2" />;
    });
  };

  const [selectedLength, setSelectedLength] = useState(articleLength[0]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!input.trim()) {
      toast.error('Please enter a topic for the article');
      return;
    }

    try {
      setLoading(true);
      const prompt = `Write a comprehensive article about "${input}" in ${selectedLength.text}. Make it engaging, informative, and well-structured with proper headings and paragraphs.`;

      console.log('🔍 Making API request to:', `${import.meta.env.VITE_BASE_URL}/api/ai/write-article`);
      console.log('📝 Request payload:', { prompt, length: selectedLength.length });

      const token = await getToken();
      console.log('🔑 Auth token obtained:', token ? 'Yes' : 'No');

      const { data } = await axios.post(
        '/api/ai/write-article',
        {
          prompt,
          length: selectedLength.length,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('📨 Response received:', data);

      if (data.success) {
        setContent(data.content);
        toast.success('Article generated successfully!');
      } else {
        toast.error(data.message || 'Failed to generate article');
      }
    } catch (error) {
      console.error('❌ Error generating article:', error);
      console.error('📊 Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      });
      const errorMessage = error.response?.data?.message || 'Failed to generate article. Please try again later.';
      toast.error(errorMessage);
      setContent('');
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
          <Sparkle className='w-6 text-[#4A7AFF]' />
          <h1 className='text-xl font-semibold'>Article Configurations</h1>
        </div>

        <p className='mt-6 text-sm font-medium'>Article Topic</p>
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type='text'
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300'
          placeholder='The future of Artificial Intelligence is...'
          required
        />

        <p className='mt-4 text-sm font-medium'>Article Length</p>
        <div className='mt-3 flex gap-3 flex-wrap'>
          {articleLength.map((item, index) => (
            <span
              key={index}
              onClick={() => setSelectedLength(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${
                selectedLength.text === item.text
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'text-gray-500 border-gray-300'
              }`}
            >
              {item.text}
            </span>
          ))}
        </div>

        <button
          type='submit'
          disabled={loading}
          className={`w-full flex justify-center items-center gap-2 ${
            loading
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-[#226BFF] to-[#65ADFF] cursor-pointer'
          } text-white px-4 py-2 mt-6 text-sm rounded-lg`}
        >
          <Edit className='w-5' />
          {loading ? 'Generating...' : 'Generate Article'}
        </button>
      </form>

      {/* right col */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]'>
        <div className='flex items-center gap-3 mb-4'>
          <Edit className='w-5 h-5 text-[#4A7AFF]' />
          <h1 className='text-xl font-semibold'>Generated Article</h1>
        </div>

        {content ? (
          <div className='text-sm text-slate-700 overflow-y-auto prose prose-sm max-w-none'>
            {formatArticleContent(content)}
          </div>
        ) : (
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
              <Edit className='w-9 h-9' />
              <p>Enter a topic and click on "Generate Article" to get started.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WriteArticle;
