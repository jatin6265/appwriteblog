import React, { useCallback, useEffect, useState } from 'react'
import { ID } from 'appwrite'
import { useForm } from 'react-hook-form'
import { Button, Input, Select, RTE, Loading } from '../index'
import { useDispatch, useSelector } from 'react-redux'
import { service as appwriteService } from '../../appwrite'
import { useNavigate } from 'react-router-dom'
import parse from "html-react-parser";


function PostForm({ post }) {
    const userData = useSelector((state) => state.userData)
    const [url, setUrl] = useState(null); // State to hold the resolved URL
    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            content: post?.content || JSON.stringify(""),
            status: post?.status || "active",
        },
    })
    const navigate = useNavigate();
    if (post) {
        const featuredImage = post.featuredImage
        useEffect(() => {
            // Resolve the promise and update the state
            const fetchImageUrl = async () => {
                try {
                    const resolvedUrl = await appwriteService.getFilePreview(featuredImage);
                    setUrl(resolvedUrl); // Set the resolved URL in state
                } catch (error) {
                    console.error("Error fetching image URL:", error);
                }
            };

            fetchImageUrl();
        }, [featuredImage, post]); // Re-run if `featuredImage` changes
    }


    const onSubmit = async (data) => {
        if (post) {

            const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;

            if (file) {
                const deletedFile = await appwriteService.deleteFile(post.featuredImage);
                console.log("deletedFile: ", deletedFile)
            }

            const dbPost = await appwriteService.updatePost(post.$id, {
                ...data,
                featuredImage: file ? file.$id : undefined,
            });

            if (dbPost) {
                navigate(`/post/${dbPost.$id}`);
            }
        } else {

            if (data.image[0] && userData) {
                try {
                    // Generate a unique identifier for the featured image
                    data.featuredImage = ID.unique();
            
                    // Create a post with user information
                    const dbPost = await appwriteService.createPost({ ...data, userId: userData.$id });
                    console.log("##########", dbPost);
            
                    if (dbPost) {
                        try {
                            // Upload the file
                            const uploadedFile = await appwriteService.uploadFile(data.image[0]);
                            console.log("uploadedFile", uploadedFile);
            
                            if (uploadedFile) {
                                const fileId = uploadedFile.$id; // Correctly accessing the uploaded file ID
                                data.featuredImage = fileId;
            
                                // Update the post with the uploaded image
                                try {
                                    const updatedPost = await appwriteService.updatePost(
                                        dbPost.$id, // Correctly accessing the post ID
                                        { ...dbPost, featuredImage: fileId }
                                    );
                                    console.log("updatedPost", updatedPost);
            
                                    if (updatedPost) {
                                        // Redirect to the post page
                                        navigate(`/post/${dbPost.$id}`);
                                    } else {
                                        console.error("Failed to update post. Cleaning up resources.");
                                        await appwriteService.deletePost(dbPost.$id);
                                        await appwriteService.deleteFile(fileId); // Delete the uploaded file
                                    }
                                } catch (error) {
                                    console.error("Error in updating post:", error.message);
            
                                    // Cleanup: delete the post and file in case of an update failure
                                    if (dbPost) {
                                        await appwriteService.deletePost(dbPost.$id);
                                    }
                                    if (uploadedFile) {
                                        await appwriteService.deleteFile(fileId);
                                    }
                                    alert(error.message);
                                }
                            } else {
                                console.error("File upload failed. Deleting the created post.");
                                await appwriteService.deletePost(dbPost.$id);
                                throw new Error("File upload failed. Post deleted.");
                            }
                        } catch (error) {
                            console.error("Error in uploading file or updating post:", error.message);
            
                            // Cleanup: delete the post if file upload fails
                            if (dbPost) {
                                await appwriteService.deletePost(dbPost.$id);
                            }
                            alert(error.message);
                        }
                    }
                } catch (error) {
                    console.error("Error in creating post:", error.message);
                    alert("Failed to create post. Please try again.");
                }
            } else {
                alert("No image or user data found. Please upload an image and try again.");
            }
            

        }
    };


    const slugTransform = useCallback(
        (value) => {
            if (value && typeof value === 'string') {
                return value.trim().toLowerCase()
                    .replace(/[^a-zA-Z0-9\s-]/g, '')
                    .replace(/\s+/g, '-');
            }
            return '';
        }, [] // 300ms debounce
    )

    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name == 'title') {
                setValue('slug', slugTransform(value.title),
                    { shouldValidate: true })
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [watch, slugTransform, setValue])

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">
                <Input
                    label="Title :"
                    name='title'
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                    name='slug'
                />
                <RTE label="Content :" name="content" control={control} defaultValue={JSON.parse(getValues("content"))} />
            </div>
            <div className="w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                    name='image'

                />
                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={url}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    );
}

export default PostForm