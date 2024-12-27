import './App.css'
import Home from './pages/home/Home'
import {Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/login/Login'
import SignUp from './pages/signup/SignUp'
import {Toaster} from "react-hot-toast"
import { useAuthContext } from './context/AuthContext'
import Report from "./pages/report_generation/Report"
import About from './pages/components/About'
function App() {
  const {authUser}=useAuthContext();
  return (
    <>
    <div >
        <Routes>
        
        <Route path="/login" element= {authUser?<Navigate to="/"/>:<Login/>}/>
        <Route path="/signup" element= {authUser?<Navigate to="/"/>:<SignUp/>}/>
        
        </Routes> 
        <Toaster/>

    </div>
  <div >
  <Routes>
  <Route path="/" element= {authUser?<Home/>:<Navigate to="/login"/>}/>
  <Route path="/report" element= {authUser?<Report/>:<Navigate to="/login"/>}/>
  <Route path='/about' element={authUser?<About/>:<Navigate to="/login"/>} />
   
  </Routes> 
  <Toaster/>
  </div>
  </>
  )
}

export default App
