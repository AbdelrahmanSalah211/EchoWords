import React from 'react'
import AuthContext from "../../Context/AuthProvider";
import { useContext, useRef, useEffect } from "react";


export default function Post({
  id,
  title,
  body,
  image,
  userId,
  username,
  editModalRef,
  setEditPostForm,
  handleDeletePost
}) {
  const { auth } = useContext(AuthContext);

  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        dropdownRef.current.open = false;
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const loggedUserId = auth.user ? auth.user.id : null;

  const modalOpenHandler = () => {
    setEditPostForm({
      title: title,
      body: body,
      image: image,
    });
    editModalRef.current.setAttribute("data-id", id);
    editModalRef.current.showModal();
  }

  return (
    <div className="border-b-2 border-gray-200 py-5">
        <div className="flex justify-between items-center mb-2">
          {/* self justify start title and body */}
          <h2 className="card-title">{title}</h2>
          {loggedUserId === userId && (
            <details className="dropdown" ref={dropdownRef}>
              <summary className="btn bg-transparent hover:bg-transparent border-none shadow-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                  />
                </svg>
              </summary>
              <ul className="menu dropdown-content bg-base-100 rounded-box z-1 p-2 shadow-sm">
                <li>
                  <button
                    className="justify-between"
                    onClick={modalOpenHandler}
                  >
                    Edit
                  </button>
                </li>
                <li>
                  <button
                    className="justify-between"
                    onClick={() => handleDeletePost(id)}
                  >
                    Delete
                  </button>
                </li>
              </ul>
            </details>
          )}
        </div>
        <p className="text-sm text-gray-500">Posted by {username}</p>
        <p>{body}</p>
      {image && (
        <figure>
          <img  className='w-[20vw]' src={image} alt="image" />
        </figure>
      )}
    </div>
  );
}
