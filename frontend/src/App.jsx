import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'

import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Events from './pages/Events'
import EventDetails from './pages/EventDetails'
import Notices from './pages/Notices'
import NoticeDetails from './pages/NoticeDetails'
import Committee from './pages/Committee'
import Alumni from './pages/Alumni'
import AlumniDetails from './pages/AlumniDetails'
import CommitteeMemberDetails from './pages/CommitteeMemberDetails'
import Blog from './pages/Blog'
import BlogDetails from './pages/BlogDetails'
import Login from './pages/Login'
import Profile from './pages/Profile'
import EditProfile from './pages/EditProfile'
import ChangePassword from './pages/ChangePassword'

import SubmitEvent from './pages/submissions/SubmitEvent'
import SubmitNotice from './pages/submissions/SubmitNotice'
import SubmitBlog from './pages/submissions/SubmitBlog'
import SubmitAlumni from './pages/submissions/SubmitAlumni'

import AdminRoute from './admin/AdminRoute'
import AdminLayout from './admin/AdminLayout'
import Dashboard from './admin/Dashboard'
import ManageEvents from './admin/ManageEvents'
import EventForm from './admin/EventForm'
import ManageNotices from './admin/ManageNotices'
import NoticeForm from './admin/NoticeForm'
import ManageBlogs from './admin/ManageBlogs'
import BlogForm from './admin/BlogForm'
import ManageAlumni from './admin/ManageAlumni'
import AlumniForm from './admin/AlumniForm'
import ManageCommittee from './admin/ManageCommittee'
import CommitteeForm from './admin/CommitteeForm'
import ManageUsers from './admin/ManageUsers'
import ManageSubmissions from './admin/ManageSubmissions'

function App() {
  return (
    <div className="app-shell">
      <ScrollToTop />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />

        <Route path="/notices" element={<Notices />} />
        <Route path="/notices/:id" element={<NoticeDetails />} />

        <Route path="/committee" element={<Committee />} />
        <Route path="/committee/:id" element={<CommitteeMemberDetails />} />

        <Route path="/alumni" element={<Alumni />} />
        <Route path="/alumni/:id" element={<AlumniDetails />} />

        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetails />} />

        <Route path="/login" element={<Login />} />

        <Route path="/submit/event" element={<SubmitEvent />} />
        <Route path="/submit/notice" element={<SubmitNotice />} />
        <Route path="/submit/blog" element={<SubmitBlog />} />
        <Route path="/submit/alumni" element={<SubmitAlumni />} />

        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/profile/change-password" element={<ChangePassword />} />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Dashboard />} />

          <Route path="events" element={<ManageEvents />} />
          <Route path="events/add" element={<EventForm />} />
          <Route path="events/edit/:id" element={<EventForm />} />

          <Route path="notices" element={<ManageNotices />} />
          <Route path="notices/add" element={<NoticeForm />} />
          <Route path="notices/edit/:id" element={<NoticeForm />} />

          <Route path="blogs" element={<ManageBlogs />} />
          <Route path="blogs/add" element={<BlogForm />} />
          <Route path="blogs/edit/:id" element={<BlogForm />} />

          <Route path="alumni" element={<ManageAlumni />} />
          <Route path="alumni/add" element={<AlumniForm />} />
          <Route path="alumni/edit/:id" element={<AlumniForm />} />

          <Route path="committee" element={<ManageCommittee />} />
          <Route path="committee/add" element={<CommitteeForm />} />
          <Route path="committee/edit/:id" element={<CommitteeForm />} />

          <Route path="submissions" element={<ManageSubmissions />} />
          <Route path="users" element={<ManageUsers />} />
        </Route>
      </Routes>

      <Footer />
    </div>
  )
}

export default App