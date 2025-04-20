import { Routes, Route } from "react-router";
import './App.css'
import UserForm from './Components/UserForm/UserForm'
import Error from './Pages/Error/Error'
import Home from './Pages/Home/Home'
import Post from './Components/Post/Post'
import Feeds from "./Pages/Feeds/Feeds";
import Layout from './Components/Layout/Layout'

function App() {

  

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route index  element={<UserForm isRegister={true} />} />
          <Route path="/register"  element={<UserForm isRegister={true} />} />
          <Route path="/signin" element={<UserForm isRegister={false} />} />
        </Route>
        <Route element={<Layout/>} >
          <Route path="/feeds" element={<Feeds />} />
        </Route>
        <Route path='/*' element={<Error />}/>
      </Routes>
    </>
  )
}

export default App
