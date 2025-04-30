import { Routes, Route } from "react-router";
import './App.css'
import UserForm from './Components/UserForm/UserForm'
import Error from './Pages/Error/Error'
import Home from './Pages/Home/Home'
import Post from './Components/Post/Post'
import Feeds from "./Pages/Feeds/Feeds";
import Layout from './Components/Layout/Layout'
import Profile from './Pages/Profile/Profile'

function App() {

  

  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Feeds />} />
          <Route path="/home/profile" element={<Profile />} />
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
