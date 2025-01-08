import React, { useState, useEffect } from 'react'
import { service as appwriteService } from '../appwrite'
import { Container, PostCard } from '../components'
import { useSelector } from 'react-redux'
import { Loading } from '../components'
import { Query } from 'appwrite'

function AllPosts() {
    const authStatus = useSelector((state) => state.status)
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        appwriteService.getPosts([Query.equal("status", "active")]).then((posts) =>
            posts && setPosts(posts.documents)).finally(() => setLoading(false))
    }, [])
    if (!authStatus) {
        (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <div className="flex flex-wrap">
                        <div className="p-2 w-full">
                            <h1 className="text-2xl font-bold hover:text-gray-500">
                                Login to read posts
                            </h1>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }

    return !loading ? (authStatus && posts.length > 0 ?
        (<div className='w-full py-8'>
            <Container>
                <div className='flex flex-wrap'>
                    {posts.map((post) => (
                        <div key={post.$id} className='p-2 w-1/4'>
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>
            </Container>
        </div>) : (<div className="flex items-center justify-center min-h-96">
            <p className="text-5xl   font-bold text-gray-500">No Post</p>
        </div>

        )
    ) : (<Loading />)
}

export default AllPosts