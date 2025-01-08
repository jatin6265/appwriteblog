import React, { useEffect, useState } from 'react'
import { service as appwriteService } from '../appwrite'
import { Container, Loading, PostCard } from '../components'
import { useSelector } from 'react-redux'

function Home() {
    const [loading, setLoading] = useState(true)

    const authStatus = useSelector((state) => state.status)

    const [posts, setPosts] = useState([])

    useEffect(() => {
        appwriteService.getPosts([]).then((posts) =>
            posts && setPosts(posts.documents)).catch(() => { }).finally(() => setLoading(false))
    }, [posts])


    if (!authStatus) {
        return <div className="w-full py-8 mt-4 text-center">
            <Container>
                <div className="flex items-center justify-center min-h-96">
                    <p className="text-5xl   font-bold text-gray-500">Login to View Posts!</p>
                </div>
            </Container>
        </div>
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

export default Home