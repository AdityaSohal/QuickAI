/* This code snippet is a React component named `RemoveObject` that allows users to upload an image,
describe an object to remove from the image, and then processes the image to remove the specified
object using AI. Here's a breakdown of what the code does: */
import { Scissors, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

// Configure Axios defaults
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
axios.defaults.withCredentials = true; // Ensure credentials are included

const RemoveObject = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [object, setObject] = useState('');
  const [loading, setLoading] = useState(false);
  const [processedImage, setProcessedImage] = useState('');
  const { getToken } = useAuth();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('File size should be less than 10MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error('Please select an image file');
      return;
    }

    if (!object.trim()) {
      toast.error('Please describe the object to remove');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('object', object.trim());

      const token = await getToken();
      const { data } = await axios.post(
        '/api/ai/remove-object',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (data.success) {
        console.log('Processed Image URL:', data.content);
        setProcessedImage(data.content);
        toast.success('Object removed successfully!');
      } else {
        toast.error(data.message || 'Failed to remove object');
      }
    } catch (error) {
      console.error('Error removing object:', error);
      const errorMessage =
        error.response?.data?.message || 'Failed to remove object. Please try again later.';
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
          <Sparkles className='w-6 text-[#4A7AFF]' />
          <h1 className='text-xl font-semibold'>AI Object Removal</h1>
        </div>

        <p className='mt-6 text-sm font-medium'>Describe Object Name To Remove</p>
        <textarea
          rows={4}
          onChange={(e) => setObject(e.target.value)}
          value={object}
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300'
          placeholder='e.g., watch or spoon, Only single object name'
          required
        />

        <p className='mt-4 text-sm font-medium'>Upload Image</p>
        <input
          onChange={handleFileChange}
          accept='image/*'
          type='file'
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600'
          required
        />
        <p className='text-xs text-gray-500 font-light mt-1'>Supports jpeg, png and other image formats (Max 10MB)</p>

        <button
          type='submit'
          disabled={loading || !selectedFile || !object.trim()}
          className={`w-full flex justify-center items-center gap-2 ${
            loading || !selectedFile || !object.trim()
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-[#417DF6] to-[#8E37EB] cursor-pointer'
          } text-white px-4 py-2 mt-6 text-sm rounded-lg`}
        >
          <Scissors className='w-5' />
          {loading ? 'Processing...' : 'Remove Object'}
        </button>
      </form>

      {/* right col */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96'>
        <div className='flex items-center gap-3 mb-4'>
          <Scissors className='w-5 h-5 text-[#4A7AFF]' />
          <h1 className='text-xl font-semibold'>Processed Image</h1>
        </div>

        {processedImage ? (
          <div className='flex-1 flex justify-center items-center'>
            <img
              src={processedImage}
              alt="Processed Image"
              className='max-w-full max-h-80 object-contain rounded-lg shadow-lg'
            />
          </div>
        ) : (
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
              <Scissors className='w-9 h-9' />
              <p>Upload an image and click on "Remove Object" to get started.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RemoveObject;