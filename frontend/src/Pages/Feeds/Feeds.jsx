import React from 'react'
import Post from '../../Components/Post/Post'
import { useState, useEffect, useRef } from 'react'




export default function Feeds() {

  const addModalRef = useRef();
  const editModalRef = useRef();


  const [posts, setPosts] = useState([]);

  const [addPostForm, setAddPostForm] = useState({
    title: "",
    body: "",
    image: "",
  });

  useEffect(() => {
    (async () => {
      const fetchedPosts = await fetch("http://localhost:3000/posts");
      const posts = await fetchedPosts.json();
      setPosts(posts.reverse());
    })();

  }, []);

  const titleOnChangeHandler = (e) => {
    setAddPostForm({ ...addPostForm, title: e.target.value });
  };

  const bodyOnChangeHandler = (e) => {
    setAddPostForm({ ...addPostForm, body: e.target.value });
  };

  const imageOnChangeHandler = (e) => {
    console.log(e.target.files);
    console.log(e.target.files[0]);
    // setAddPostForm({ ...addPostForm, image: e.target.files[0] });
  };

  const handleAddPost = async (e) => {
    e.preventDefault();
    const postData = {
      title: addPostForm.title,
      body: addPostForm.body,
      image: addPostForm.image,
    }
    try {
      const addPostResponse = await fetch("http://localhost:3000/posts", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(postData),
      })
      const newPost = await addPostResponse.json();
      const newPosts = [newPost, ...posts ];
      setPosts(newPosts);
      setAddPostForm({ title: "", body: "", image: null });
      addModalRef.current.close();
    } catch (error) {
      console.error("Error adding post:", error);
    }
    
  }

  return (
    <div className="flex flex-col items-center justify-center w-3/5">
      <div>
        {posts.map((post) => (
          <Post
            key={post.id}
            id={post.id}
            userId={post.userId}
            title={post.title}
            body={post.body}
            image={post.image}
            editModalRef={editModalRef}
          />
        ))}
      </div>
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
          onClick={() => addModalRef.current.showModal()}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      </div>


      {/* modal for adding posts */}

      <dialog ref={addModalRef} className="modal">
        <div className="modal-box">
          <h3 className="text-center">Add Post</h3>
          <form method="dialog" className="flex flex-col justify-start gap-2" onSubmit={handleAddPost}>
            <input
              type="text"
              placeholder="Title"
              className="input input-primary w-1/3"
              onChange={titleOnChangeHandler}
              value={addPostForm.title}
            />
            <textarea
              type="text"
              placeholder="Body"
              className="textarea textarea-primary w-full"
              onChange={bodyOnChangeHandler}
              value={addPostForm.body}
            ></textarea>
            <input
              type="file"
              accept="image/*"
              className="file-input file-input-sm file-input-ghost file-input-primary"
              onChange={imageOnChangeHandler}
              value={addPostForm.image}
            />
            <div className="flex justify-between">
              <button
                className="btn w-24 btn-soft self-center"
                onClick={() => addModalRef.current.close()}
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
          <h3 className="text-center">Add Post</h3>
          <form method="dialog" className="flex flex-col justify-start gap-2" onSubmit={handleAddPost}>
            <input
              type="text"
              placeholder="Title"
              className="input input-primary w-1/3"
              onChange={titleOnChangeHandler}
              value={addPostForm.title}
            />
            <textarea
              type="text"
              placeholder="Body"
              className="textarea textarea-primary w-full"
              onChange={bodyOnChangeHandler}
              value={addPostForm.body}
            ></textarea>
            <input
              type="file"
              accept="image/*"
              className="file-input file-input-sm file-input-ghost file-input-primary"
              onChange={imageOnChangeHandler}
              value={addPostForm.image}
            />
            <div className="flex justify-between">
              <button
                className="btn w-24 btn-soft self-center"
                onClick={() => editModalRef.current.close()}
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



















    </div>
  );
}