import './App.css'
import Home from './pages/home/Home'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/login/Login'
import SignUp from './pages/signup/SignUp'
import Weather from './pages/weather/weather'
import { Toaster } from "react-hot-toast"
import { useAuthContext } from './context/AuthContext'
import Report from "./pages/report_generation/Report"
// import About from './pages/components/About'
import DiseaseRecognition from './pages/detect/DiseaseRecognition'
import Fertilize from './pages/Fertilizer/fertilizer'
import History from './pages/History/history'

function App() {
  const { authUser } = useAuthContext();
  return (
    <>
      <div className="min-h-screen">
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={authUser ? <Navigate to="/" /> : <Login />} />
          <Route path="/signup" element={authUser ? <Navigate to="/" /> : <SignUp />} />

          {/* Feature Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/report" element={<Report />} />
          <Route path='/detect' element={<DiseaseRecognition />} />
          <Route path='/weather' element={<Weather />} />
          <Route path='/fertilizer' element={<Fertilize />} />
          <Route path='/history' element={<History />} />
        </Routes>
        <Toaster />
      </div>
    </>
  )
}

export default App
