import { Routes, Route } from "react-router";
import './App.css'
import UserForm from './Components/UserForm/UserForm'
import Error from './Pages/Error/Error'
import Home from './Pages/Home/Home'
import Feeds from "./Pages/Feeds/Feeds";
import Layout from './Components/Layout/Layout'
import Profile from './Pages/Profile/Profile'
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import { ToastContainer } from "react-toastify";

function App() {

  

  return (
    <>
      <ToastContainer position="top-center" hideProgressBar={true} autoClose={1000} />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Feeds />} />
          <Route path="/home/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
            } />
        </Route>
        <Route path="/home" element={<Home />} >
          <Route path="/home/register"  element={<UserForm isRegister={true} />} />
          <Route path="/home/signin" element={<UserForm isRegister={false} />} />
        </Route>
        <Route path='/*' element={<Error />}/>
      </Routes>
    </>
  )
}

export default App
