import React, { useEffect, useState } from 'react'
import { PostForm, Container, Loading } from '../components'
import { service as appwriteService } from '../appwrite'
import { useNavigate, useParams } from 'react-router-dom'

function EditPost() {
    const [loading,setLoading]=useState(true)
    const [post, setPost] = useState(null)
    const { slug } = useParams()
    const navigate = useNavigate()
    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug)
                .then((post) => {
                    // Log the post value to check what you're getting
                    if (post) {
                        setPost(post);
                    } else {
                        console.error("Post not found or invalid data received");
                    }
                })
                .catch((error) => {
                    console.error("Error fetching post:", error);
                    // Optionally, you can set some error state to notify the user
                }).finally(()=>setLoading(false));
        } else {
            navigate('/');
        }
    }, [slug, navigate, appwriteService, setPost]);
    

    return !loading?( post ? (
        <div className='py-8'>
            <Container>
                <PostForm post={post} />
            </Container>
        </div>
      ) : (<div>No post available.</div>)):(<Loading/>)
}

export default EditPost