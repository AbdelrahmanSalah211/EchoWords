import React, { useContext } from 'react'
import AuthContext from '../Context/AuthProvider';
import { Navigate } from 'react-router'

export default function ProtectedRoute({ children }) {
  const { auth, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <span className="loading loading-spinner text-primary"></span>
    </div>;
  }

  if (!auth?.token) {
    return <Navigate to="/home/signin" replace={true} />
  }
  return children
}
