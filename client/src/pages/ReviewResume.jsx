import React, { useState } from 'react';
import { FileText, Sparkles } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const ReviewResume = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reviewResult, setReviewResult] = useState('');
  const { getToken } = useAuth();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Please upload a PDF file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error('Please select a PDF resume file');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('resume', selectedFile);

      const token = await getToken();
      const { data } = await axios.post('/api/ai/review-resume', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (data.success) {
        setReviewResult(data.content);
        toast.success('Resume reviewed successfully!');
      } else {
        toast.error(data.message || 'Failed to review resume');
      }
    } catch (error) {
      console.error('Error reviewing resume:', error);
      const errorMessage =
        error.response?.data?.message || 'Failed to review resume. Please try again later.';
      toast.error(errorMessage);
      setReviewResult('');
    } finally {
      setLoading(false);
    }
  };

  const formatReviewContent = (content) => {
    if (!content) return '';

    const lines = content.split('\n');

    return lines.map((line, index) => {
      const trimmed = line.trim();

      if (trimmed.length === 0) {
        return <div key={index} className="mb-2" />;
      }

      // Headings
      if (trimmed.startsWith('# ')) {
        return (
          <h1 key={index} className="text-lg font-bold text-gray-800 mb-2">
            {trimmed.replace(/^#\s/, '')}
          </h1>
        );
      } else if (trimmed.startsWith('## ')) {
        return (
          <h2 key={index} className="text-md font-semibold text-gray-700 mb-1">
            {trimmed.replace(/^##\s/, '')}
          </h2>
        );
      }

      // Bullet points
      if (trimmed.match(/^[-•*]\s+/)) {
        return (
          <li key={index} className="ml-5 list-disc text-sm text-gray-700">
            {trimmed.replace(/^[-•*]\s+/, '')}
          </li>
        );
      }

      // Bold and italic
      const formatted = trimmed
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');

      return (
        <p
          key={index}
          className="text-sm text-gray-700 mb-1"
          dangerouslySetInnerHTML={{ __html: formatted }}
        />
      );
    });
  };

  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>
      {/* Left Column */}
      <form
        onSubmit={onSubmitHandler}
        className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'
      >
        <div className='flex items-center gap-3 mb-4'>
          <Sparkles className='w-6 text-[#00DA83]' />
          <h1 className='text-xl font-semibold'>AI Resume Review</h1>
        </div>

        <p className='mt-6 text-sm font-medium'>Upload Resume</p>
        <input
          onChange={handleFileChange}
          accept='application/pdf'
          type='file'
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600'
          required
        />
        <p className='text-xs text-gray-500 font-light mt-1'>
          Supports PDF resume only (Max 5MB)
        </p>

        <button
          type='submit'
          disabled={loading || !selectedFile}
          className={`w-full flex justify-center items-center gap-2 ${
            loading || !selectedFile
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-[#00DA83] to-[#0CCDA3] cursor-pointer'
          } text-white px-4 py-2 mt-6 text-sm rounded-lg`}
        >
          <FileText className='w-5' />
          {loading ? 'Reviewing...' : 'Review Resume'}
        </button>
      </form>

      {/* Right Column */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px] overflow-y-auto'>
        <div className='flex items-center gap-3 mb-4'>
          <FileText className='w-5 h-5 text-[#00DA83]' />
          <h1 className='text-xl font-semibold'>Analysis Results</h1>
        </div>

        {reviewResult ? (
          <div className='prose prose-sm max-w-none'>{formatReviewContent(reviewResult)}</div>
        ) : (
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
              <FileText className='w-9 h-9' />
              <p>Upload a resume and click on "Review Resume" to get started.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewResume;
