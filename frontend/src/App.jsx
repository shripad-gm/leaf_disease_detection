import './App.css'
import Home from './pages/home/Home'
import {Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/login/Login'
import SignUp from './pages/signup/SignUp'
import Weather from './pages/weather/weather'
import {Toaster} from "react-hot-toast"
import { useAuthContext } from './context/AuthContext'
import Report from "./pages/report_generation/Report"
// import About from './pages/components/About'
import DiseaseRecognition from './pages/detect/DiseaseRecognition'
import Fertilize from './pages/Fertilizer/fertilizer'

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
  {/* authUser?<Home/>:<Navigate to="/login"/> */}
  {/* authUser?<Report/>:<Navigate to="/login"/> */}
  {/* authUser?<About/>:<Navigate to="/login"/> */}
  {/* authUser?<DiseaseRecognition/>:<Navigate to="/login"/> */}
  {/* authUser?<Weather/>:<Navigate to="/login"/> */}
  <Route path="/" element= {<Home/>}/>
  <Route path="/report" element= {<Report/>}/>
  {/* <Route path='/about' element={<About/>} /> */}
  <Route path='/detect' element={<DiseaseRecognition/>} />
  <Route path='/weather' element={<Weather/>} />
  <Route path='/fertilizer' element={<Fertilize/>} />
   
  </Routes> 
  <Toaster/>
  </div>
  </>
  )
}

export default App
