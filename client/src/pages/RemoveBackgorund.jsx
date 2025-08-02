import { Eraser, Sparkles } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

// Set base URL
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveBackgorund = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processedImage, setProcessedImage] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const { getToken } = useAuth();

  // Create and manage preview URL when file is selected
  useEffect(() => {
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
      
      // Clean up the URL when component unmounts or file changes
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [selectedFile]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('File size should be less than 10MB');
        return;
      }
      setSelectedFile(file);
      setProcessedImage(''); // Clear any previous processed image
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error('Please select an image file');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('image', selectedFile);

      const token = await getToken();
      const { data } = await axios.post(
        '/api/ai/remove-background',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (data.success) {
        console.log('Processed Image URL:', data.content); // Log the processed image URL
        setProcessedImage(data.content);
        toast.success('Background removed successfully!');
      } else {
        toast.error(data.message || 'Failed to remove background');
      }
    } catch (error) {
      console.error('Error removing background:', error);
      const errorMessage = error.response?.data?.message || 'Failed to remove background. Please try again later.';
      toast.error(errorMessage);
      setProcessedImage('');
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
          <Sparkles className='w-6 text-[#FF4938]' />
          <h1 className='text-xl font-semibold'>AI Background Removal</h1>
        </div>

        <p className='mt-6 text-sm font-medium'>Upload Image</p>
        <input
          onChange={handleFileChange}
          accept='image/*'
          type='file'
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600'
          required
        />
        <p className='text-xs text-gray-500 font-light mt-1'>Supports jpeg, png and other image formats (Max 10MB)</p>
        
        {previewUrl && (
          <div className='mt-4'>
            <p className='text-sm font-medium mb-2'>Preview:</p>
            <img 
              src={previewUrl} 
              alt="Preview" 
              className='max-w-full max-h-60 object-contain rounded-lg border border-gray-200' 
            />
          </div>
        )}
        
        <button 
          type='submit'
          disabled={loading || !selectedFile}
          className={`w-full flex justify-center items-center gap-2 ${
            loading || !selectedFile
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-[#F6AB41] to-[#FF4938] cursor-pointer'
          } text-white px-4 py-2 mt-6 text-sm rounded-lg`}
        >
          <Eraser className='w-5' />
          {loading ? 'Processing...' : 'Remove Background'}
        </button>
      </form>

      {/* right col */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96'>
        <div className='flex items-center gap-3 mb-4'>
          <Eraser className='w-5 h-5 text-[#FF4938]' />
          <h1 className='text-xl font-semibold'>Processed Image</h1>
        </div>

        {processedImage ? (
          <div className='flex-1 flex justify-center items-center'>
            <img 
              src={processedImage} 
              alt="Processed Image" 
              className='max-w-full max-h-80 object-contain rounded-lg shadow-lg'
              onError={(e) => {
                console.error('Image failed to load:', processedImage);
                e.target.onerror = null;
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iMTIiIHk9IjEyIiBmb250LXNpemU9IjEyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBhbGlnbm1lbnQtYmFzZWxpbmU9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmaWxsPSIjYWFhYWFhIj5JbWFnZSBFcnJvcjwvdGV4dD48L3N2Zz4=';
                toast.error('Failed to load the processed image');
              }}
            />
          </div>
        ) : (
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
              <Eraser className='w-9 h-9' />
              <p>Upload an image and click on "Remove Background" to get started.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RemoveBackgorund;