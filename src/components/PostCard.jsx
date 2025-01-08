import React,{useState,useEffect} from 'react'

import { Link } from 'react-router-dom'
import { service } from '../appwrite'

function PostCard({$id,title,featuredImage}) {
  const [url, setUrl] = useState(null); // State to hold the resolved URL
  useEffect(() => {
    // Resolve the promise and update the state
    const fetchImageUrl = async () => {
      try {
        const resolvedUrl = await service.getFilePreview(featuredImage);
        setUrl(resolvedUrl); // Set the resolved URL in state
      } catch (error) {
        console.error("Error fetching image URL:", error);
      }
    };

    fetchImageUrl();
  }, [featuredImage]); // Re-run if `featuredImage` changes
 
  return (
    <Link to={`/post/${$id}`}>
        <div className='w-full bg-gray-100 rounded-xl p-4 '>
            <div className='w-full justify-center mb-4'>
                <img 
                src={url} 
                alt={title}
                className='rounded-xl' />
                <div></div>
            </div>
            <h2
            className='text-xl font-bold'
            >{title}</h2>
        </div>
    </Link>
  )
}

export default PostCard