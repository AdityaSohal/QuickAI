import React, { useEffect, useState } from 'react'
import { Gem, Sparkle } from 'lucide-react'
import { Protect } from '@clerk/clerk-react'
import CreationItems from '../components/CreationItems'
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

// Set base URL
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Dashboard = () => {
  const [creations, setCreations] = useState([])
  const [loading, setLoading] = useState(false)
  const { getToken } = useAuth();

  const getDashboardData = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      
      // Get all user creations (both public and private)
      const { data } = await axios.get('/api/user/get-all-user-creations', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setCreations(data.creations);
      } else {
        console.error('Failed to fetch creations:', data.message);
        setCreations([]);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setCreations([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <div className='h-full overflow-y-scroll p-6'>
        <div className='flex justify-start gap-4 flex-wrap'>
          {/*total creations card*/}
          <div className='flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200'>
            <div className='text-slate-600'>
              <p className='text-sm'>Total Creations</p>
              <h2 className='text-xl font-semibold'>
                {loading ? '...' : creations.length}
              </h2>
            </div>
            <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-[#3588F2] to-[#0BB0D7] text-white flex justify-center items-center'>
              <Sparkle className='w-5 text-white'/>
            </div>
          </div>
          {/*active plan card*/}
          <div className='flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200'>
            <div className='text-slate-600'>
              <p className='text-sm'>Active Plan</p>
              <h2 className='text-xl font-semibold'>
                <Protect plan='premium' fallback="Free">Premium</Protect>
              </h2>
            </div>
            <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF61C5] to-[#9E53EE] text-white flex justify-center items-center'>
              <Gem className='w-5 text-white'/>
            </div>
          </div>
        </div>
        <div className='space-y-3'>
          <p className='mt-6 mb-4'>All Your Creations</p>
          {loading ? (
            <div className='text-center text-gray-400 py-10'>Loading creations...</div>
          ) : creations.length === 0 ? (
            <div className='text-center text-gray-400 py-10'>No creations yet. Start creating!</div>
          ) : (
            <div className='space-y-4'>
              {creations.map((item) => (
                <div key={item.id} className='bg-white rounded-lg border border-gray-200 p-4'>
                  <div className='flex items-center justify-between mb-2'>
                    <div className='flex items-center gap-2'>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        item.type === 'article' ? 'bg-blue-100 text-blue-700' :
                        item.type === 'blog-title' ? 'bg-purple-100 text-purple-700' :
                        item.type === 'image' ? 'bg-green-100 text-green-700' :
                        item.type === 'resume-review' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {item.type === 'article' ? '📝 Article' :
                         item.type === 'blog-title' ? '🏷️ Blog Title' :
                         item.type === 'image' ? '🖼️ Image' :
                         item.type === 'resume-review' ? '📄 Resume Review' :
                         item.type}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        item.publish ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {item.publish ? '🌐 Public' : '🔒 Private'}
                      </span>
                    </div>
                    <span className='text-xs text-gray-500'>
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className='mb-2'>
                    <p className='text-sm font-medium text-gray-700'>Prompt:</p>
                    <p className='text-sm text-gray-600'>{item.prompt}</p>
                  </div>
                  
                  {item.type === 'image' ? (
                    <div className='flex justify-center'>
                      <img 
                        src={item.content} 
                        alt="Generated content" 
                        className='max-w-full max-h-48 rounded-lg object-contain'
                      />
                    </div>
                  ) : (
                    <div>
                      <p className='text-sm font-medium text-gray-700'>Content:</p>
                      <p className='text-sm text-gray-600 max-h-32 overflow-y-auto'>
                        {item.content}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
    </div>
  )
}

export default Dashboard