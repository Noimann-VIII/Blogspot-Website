import { BrowserRouter, Routes, Route } from 'react-router'
import Navbar from './components/Navbar/Navbar'
import Profile from './pages/Profile/Profile'
import Home from './pages/Home/Home'
import NotFound from './pages/NotFound/NotFound'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Post from './pages/Post/Post'

function App() {
  return (
    <BrowserRouter>
      <Navbar/>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/home" element={<Home/>} />
          <Route path="/post" element={<Post/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="*" element={<NotFound/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App