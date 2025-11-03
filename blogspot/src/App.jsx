import { BrowserRouter, Routes, Route } from 'react-router'
import Navbar from './components/Navbar/Navbar'
import Users from './pages/Users/Users'
import Home from './pages/Home/Home'
import NotFound from './pages/NotFound/NotFound'
import UsersProfile from './pages/UsersProfile/UsersProfile'

function App() {
  return (
    <BrowserRouter>
      <Navbar/>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/home" element={<Home/>} />
          <Route path="/users" element={<Users/>} />
          <Route path="/users/:id" element={<UsersProfile/>} />
          <Route path="*" element={<NotFound/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
