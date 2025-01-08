import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container, Loading } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
    const [url, setUrl] = useState(null); // State to hold the resolved URL
    const [loading, setLoading] = useState(true)
    const [post, setPost] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.userData);

    const isAuthor = post && userData ? post.userId === userData.$id : false;
    useEffect(() => {
        // Resolve the promise and update the state
        const fetchImageUrl = async () => {
            try {
                const resolvedUrl = await appwriteService.getFilePreview(post.featuredImage);
                setUrl(resolvedUrl); // Set the resolved URL in state
            } catch (error) {
                console.error("Error fetching image URL:", error);
            }
        };

        fetchImageUrl();
    }, [post]);// Re-run if `featuredImage` changes
    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post){ 
                    appwriteService.use
                    setPost(post) 
                }
                else navigate("/");
            }).catch((error) => { console.log(error.messgae) }).finally(() => setLoading(false));
        } else navigate("/");
    }, [slug, navigate]);


    const deletePost = () => {
         appwriteService.deletePost(post.$id).then((status) => {
            console.log(status)
            if (status) {
                appwriteService.deleteFile(post.featuredImage);
                navigate("/");
            }
        });
    };

    return !loading ? (post ? (
        <div className="py-8">
            <Container>
                <div className="w-full flex flex-col items-center justify-center mb-4 relative border border-gray-300 rounded-xl p-4 shadow-lg bg-white">
                    <img
                        src={url}
                        alt={post.title}
                        className="rounded-xl max-w-full max-h-96 object-cover"
                    />

                    {isAuthor && (
                        <div className="absolute right-6 top-6 flex space-x-3">
                            <Link to={`/edit-post/${post.$id}`}>
                                <Button bgColor="bg-green-500" className="text-white px-4 py-2 rounded-lg">
                                    Edit
                                </Button>
                            </Link>
                            <Button
                                bgColor="bg-red-500"
                                className="text-white px-4 py-2 rounded-lg"
                                onClick={deletePost}
                            >
                                Delete
                            </Button>
                        </div>
                    )}
                </div>
                <div className="w-full mb-6 text-center">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{post.title}</h1>
                    <p className="text-gray-500 italic">Posted on {post.$updatedAt}</p>
                </div>
                <div className="browser-css p-4 bg-gray-50 rounded-lg shadow-inner">
                    {parse(JSON.parse(post.content))}
                </div>
            </Container>
        </div>

    ) : null) : (<Loading />)
}