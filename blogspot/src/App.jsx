import { BrowserRouter, Routes, Route } from 'react-router'
import Navbar from './components/Navbar/Navbar'
import Profile from './pages/Profile/Profile'
import Home from './pages/Home/Home'
import NotFound from './pages/NotFound/NotFound'

function App() {
  return (
    <BrowserRouter>
      <Navbar/>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/home" element={<Home/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="*" element={<NotFound/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
