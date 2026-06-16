import './App.css'
import Home from './pages/home/Home'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/login/Login'
import SignUp from './pages/signup/SignUp'
import ForgotPassword from './pages/login/ForgotPassword'
import Weather from './pages/weather/weather'
import { Toaster } from "react-hot-toast"
import { useAuthContext } from './context/AuthContext'
import Report from "./pages/report_generation/Report"
// import About from './pages/components/About'
import DiseaseRecognition from './pages/detect/DiseaseRecognition'
import Fertilize from './pages/Fertilizer/fertilizer'
import History from './pages/History/history'
import Profile from './pages/profile/Profile'

function App() {
  const { authUser } = useAuthContext();
  return (
    <>
      <div className="min-h-screen">
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={authUser ? <Navigate to="/" /> : <Login />} />
          <Route path="/signup" element={authUser ? <Navigate to="/" /> : <SignUp />} />
          <Route path="/forgot-password" element={authUser ? <Navigate to="/" /> : <ForgotPassword />} />

          {/* Feature Routes */}
          <Route path="/" element={authUser ? <Home /> : <Navigate to="/login" />} />
          <Route path="/report" element={authUser ? <Report /> : <Navigate to="/login" />} />
          <Route path='/detect' element={authUser ? <DiseaseRecognition /> : <Navigate to="/login" />} />
          <Route path='/weather' element={authUser ? <Weather /> : <Navigate to="/login" />} />
          <Route path='/fertilizer' element={authUser ? <Fertilize /> : <Navigate to="/login" />} />
          <Route path='/history' element={authUser ? <History /> : <Navigate to="/login" />} />
          <Route path='/profile' element={authUser ? <Profile /> : <Navigate to="/login" />} />
        </Routes>
        <Toaster />
      </div>
    </>
  )
}

export default App
