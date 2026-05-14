import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from './components/layout/Layout'
import HomePage from './pages/Home/HomePage'
import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage'
import CoursesPage from './pages/Course/CoursesPage'
import CourseDetailPage from './pages/Course/CourseDetailPage'
import LearningPage from './pages/Learning/LearningPage'
import ProgressPage from './pages/Progress/ProgressPage'
import CommunityPage from './pages/Community/CommunityPage'
import ProfilePage from './pages/Profile/ProfilePage'
import { initDB } from './data/database'

function App() {
  useEffect(() => {
    initDB()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="courses/:id" element={<CourseDetailPage />} />
          <Route path="progress" element={<ProgressPage />} />
          <Route path="community" element={<CommunityPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        <Route path="/learn/:module" element={<LearningPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
