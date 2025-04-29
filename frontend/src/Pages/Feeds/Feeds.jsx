import React from 'react'
import Post from '../../Components/Post/Post'
import { useState, useEffect, useRef, useContext } from 'react'
import AuthContext from "../../Context/AuthProvider";
import InfiniteScroll from 'react-infinite-scroll-component';




export default function Feeds() {

  const addModalRef = useRef();
  const editModalRef = useRef();

  const { auth } = useContext(AuthContext);
  const loggedUserId = auth.user ? auth.user.id : null;

  const [addPostForm, setAddPostForm] = useState({
    title: "",
    body: "",
    image: null,
  });

  const [editPostForm, setEditPostForm] = useState({
    title: "",
    body: "",
    image: null,
  });

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}/posts?page=${page}&limit=10&sort=-createdAt`);
      const responseData = await response.json();
      const { posts } = responseData.data;
      console.log(responseData);
      console.log(posts);
      setPosts((prevPosts) => {
        const existingPostIds = new Set(prevPosts.map(post => post._id));
        const filteredNewPosts = posts.filter(post => !existingPostIds.has(post._id));
        return [...prevPosts, ...filteredNewPosts];
      });
      
      if(posts.length === 0){
        setHasMore(false);
      } else {
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  const titleAddOnChangeHandler = (e) => {
    setAddPostForm({ ...addPostForm, title: e.target.value });
  };

  const bodyAddOnChangeHandler = (e) => {
    setAddPostForm({ ...addPostForm, body: e.target.value });
  };

  const imageAddOnChangeHandler = (e) => {
    setAddPostForm({ ...addPostForm, image: e.target.files[0] });
  };
  
  const API_KEY = import.meta.env.VITE_API_KEY;

  const handleAddPost = async (e) => {
    e.preventDefault();
    addModalRef.current.close();
    try {
      let imgData;
      if(addPostForm.image){
        const formData = new FormData();
        formData.append("key", API_KEY);
        formData.append("image", addPostForm.image);
        const imgResponse = await fetch(`https://api.imgbb.com/1/upload?`, {
          method: "POST",
          body: formData
        })
        imgData = await imgResponse.json()
      }
      const imgUrl = addPostForm.image ? imgData.data.display_url : "";
      const postData = {
        title: addPostForm.title,
        body: addPostForm.body,
        image: imgUrl,
        userId: loggedUserId
      }
      if(addPostForm.title && addPostForm.body){
        const addPostResponse = await fetch("http://localhost:3000/posts", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${auth.accessToken}`
          },
          body: JSON.stringify(postData),
        })
        const newPost = await addPostResponse.json();
        newPost.user = auth.user;
        const newPosts = [newPost, ...posts ];
        setPosts(newPosts);
        setAddPostForm({ title: "", body: "", image: null });
      }
    } catch (error) {
      console.error("Error adding post:", error);
    }
  }

  const titleEditOnChangeHandler = (e) => {
    setEditPostForm({ ...editPostForm, title: e.target.value });
  };

  const bodyEditOnChangeHandler = (e) => {
    setEditPostForm({ ...editPostForm, body: e.target.value });
  };

  const imageEditOnChangeHandler = (e) => {
    setEditPostForm({ ...editPostForm, image: e.target.files[0] });
  };

  const handleEditPost = async (e) => {
    e.preventDefault();
    try {
      let imgData;
      if(editPostForm.image){
        const formData = new FormData();
        formData.append("key", API_KEY);
        formData.append("image", editPostForm.image);
        const imgResponse = await fetch(`https://api.imgbb.com/1/upload?`, {
          method: "POST",
          body: formData
        })
        imgData = await imgResponse.json()
      }
      const postId = editModalRef.current.getAttribute("data-id");
      const imgUrl = editPostForm.image ? imgData.data.display_url : "";

      const editData = {
        id: postId,
        title: editPostForm.title,
        body: editPostForm.body,
        image: imgUrl,
      }
      if(editPostForm.title && editPostForm.body) {
        const editPostResponse = await fetch(`http://localhost:3000/posts/${postId}`, {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${auth.accessToken}`
          },
          body: JSON.stringify(editData),
        })
        const newPost = await editPostResponse.json();
        newPost.user = auth.user;
        const newPosts = posts.map((post) => {
          if(post.id == postId){
            return newPost;
          } else {
            return post;
          }
        });
        setPosts(newPosts);
        setEditPostForm({ title: "", body: "", image: null });
        editModalRef.current.close();
      }
    } catch (error) {
      console.error("Error adding post:", error);
    }
    
  }

  const handleDeletePost = async (id) => {
    const deletePostResponse = await fetch(`http://localhost:3000/posts/${id}`, {
      method: "Delete",
      headers: {
        "Content-type": "application/json",
        "Authorization": `Bearer ${auth.accessToken}`
      },
    });
    const newPosts = posts.filter((post) => post.id !== id);
    setPosts(newPosts);
    console.log("Post deleted successfully");
  }

  return (
    <div className="px-20 md:px-40 xl:px-80 ">
        <InfiniteScroll
          dataLength={posts.length}
          next={fetchPosts}
          hasMore={hasMore}
          loader={
            <div className="flex justify-center items-center">
              <span className="loading loading-spinner text-primary"></span>
            </div>
          }
          endMessage={
            <div className="flex flex-col items-center justify-center py-16 space-y-4 animate-fadeIn">
              <p className="text-gray-500">You've reached the end. Thanks for scrolling! 🚀</p>
              <button className="btn btn-primary btn-sm animate-bounce" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                Back to Top
              </button>
            </div>
          }
          className='flex flex-col p-10 shadow-lg rounded'
        >
          {posts.map((post) => (
            <Post
              key={post._id}
              id={post.id}
              title={post.title}
              body={post.body}
              image={post.image}
              userId={post.user._id}
              username={post.user.username}
              editModalRef={editModalRef}
              editPostForm={editPostForm}
              setEditPostForm={setEditPostForm}
              handleDeletePost={handleDeletePost}
            />
          ))}
        </InfiniteScroll>
      {auth.user &&
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6 w-12 h-12 fixed bottom-10 right-10"
          onClick={() => addModalRef.current.showModal()}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      }


      {/* modal for adding posts */}

      <dialog ref={addModalRef} className="modal">
        <div className="modal-box">
          <h3 className="text-center">Add Post</h3>
          <form className="flex flex-col justify-start gap-2" onSubmit={handleAddPost}>
            <input
              type="text"
              placeholder="Title"
              className="input input-primary w-1/3"
              onChange={titleAddOnChangeHandler}
              value={addPostForm.title}
            />
            <textarea
              type="text"
              placeholder="Body"
              className="textarea textarea-primary w-full"
              onChange={bodyAddOnChangeHandler}
              value={addPostForm.body}
            ></textarea>
            <input
              type="file"
              accept="image/*"
              className="file-input file-input-sm file-input-ghost file-input-primary"
              onChange={imageAddOnChangeHandler}
              // value={addPostForm.image}
            />
            <div className="flex justify-between">
              <button
                type='button'
                className="btn w-24 btn-soft self-center"
                onClick={() => {
                  addModalRef.current.close();
                  setAddPostForm({ title: "", body: "", image: null });
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn w-24 btn-primary self-center"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      </dialog>





      {/* modal for editing posts */}
      <dialog ref={editModalRef} className="modal">
        <div className="modal-box">
          <h3 className="text-center">Edit Post</h3>
          <form className="flex flex-col justify-start gap-2" onSubmit={handleEditPost}>
            <input
              type="text"
              placeholder="Title"
              className="input input-primary w-1/3"
              onChange={titleEditOnChangeHandler}
              value={editPostForm.title}
            />
            <textarea
              type="text"
              placeholder="Body"
              className="textarea textarea-primary w-full"
              onChange={bodyEditOnChangeHandler}
              value={editPostForm.body}
            ></textarea>
            <input
              type="file"
              accept="image/*"
              name='image'
              className="file-input file-input-sm file-input-ghost file-input-primary"
              onChange={imageEditOnChangeHandler}
              // value={editPostForm.image}
            />
            <div className="flex justify-between">
              <button
                type='button'
                className="btn w-24 btn-soft self-center"
                onClick={() => editModalRef.current.close()}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn w-24 btn-primary self-center"
              >
                Edit
              </button>
            </div>
          </form>
        </div>
      </dialog>



















    </div>
  );
}