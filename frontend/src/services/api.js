const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

async function handleResponse(response) {
  let data = null

  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    throw new Error(data?.error || data?.message || `Request failed: ${response.status}`)
  }

  return data
}

export async function registerMember(payload) {
  const formData = new FormData()

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      formData.append(key, value)
    }
  })

  const response = await fetch(`${API_BASE_URL}/api/auth/register/`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  })

  return handleResponse(response)
}

export async function loginMember(payload) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    cache: 'no-store',
    body: JSON.stringify(payload),
  })

  return handleResponse(response)
}

export async function logoutMember() {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({}),
  })

  return handleResponse(response)
}

export async function getCurrentUser() {
  const response = await fetch(`${API_BASE_URL}/api/auth/me/`, {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return handleResponse(response)
}

export async function getHomeData() {
  const response = await fetch(`${API_BASE_URL}/api/home/`);
  return handleResponse(response);
}

export async function getEvents() {
  const response = await fetch(`${API_BASE_URL}/api/events/`);
  return handleResponse(response);
}

export async function getEventDetails(id) {
  const response = await fetch(`${API_BASE_URL}/api/events/${id}/`);
  return handleResponse(response);
}

export async function getNotices() {
  const response = await fetch(`${API_BASE_URL}/api/notices/`);
  return handleResponse(response);
}

export async function getNoticeDetails(id) {
  const response = await fetch(`${API_BASE_URL}/api/notices/${id}/`);
  return handleResponse(response);
}

export async function getCommittee(year = '') {
  const query = year ? `?year=${encodeURIComponent(year)}` : ''
  const response = await fetch(`${API_BASE_URL}/api/committee/${query}`)
  return handleResponse(response)
}

export async function getCommitteeYears() {
  const response = await fetch(`${API_BASE_URL}/api/committee-years/`)
  return handleResponse(response)
}

export async function getAlumni() {
  const response = await fetch(`${API_BASE_URL}/api/alumni/`);
  return handleResponse(response);
}

export async function getBlogs() {
  const response = await fetch(`${API_BASE_URL}/api/blogs/`);
  return handleResponse(response);
}

export async function getBlogDetails(id) {
  const response = await fetch(`${API_BASE_URL}/api/blogs/${id}/`);
  return handleResponse(response);
}

export async function sendContactMessage(payload) {
  const response = await fetch(`${API_BASE_URL}/api/contact/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
}

// =========================
// Admin helpers
// =========================

export async function getAdminDashboard() {
  const response = await fetch(`${API_BASE_URL}/api/admin/dashboard/`, {
    credentials: 'include',
  })
  return handleResponse(response)
}

export async function getAdminUsers() {
  const response = await fetch(`${API_BASE_URL}/api/admin/users/`, {
    credentials: 'include',
  })
  return handleResponse(response)
}

// =========================
// Admin Events
// =========================

export async function createEvent(payload) {
  const formData = new FormData()
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      formData.append(key, value)
    }
  })

  const response = await fetch(`${API_BASE_URL}/api/admin/events/create/`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  })

  return handleResponse(response)
}

export async function updateEvent(id, payload) {
  const formData = new FormData()
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      formData.append(key, value)
    }
  })

  const response = await fetch(`${API_BASE_URL}/api/admin/events/${id}/update/`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  })

  return handleResponse(response)
}

export async function deleteEvent(id) {
  const response = await fetch(`${API_BASE_URL}/api/admin/events/${id}/delete/`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  })

  return handleResponse(response)
}

// =========================
// Admin Notices
// =========================

export async function createNotice(payload) {
  const formData = new FormData()
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      formData.append(key, value)
    }
  })

  const response = await fetch(`${API_BASE_URL}/api/admin/notices/create/`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  })

  return handleResponse(response)
}

export async function updateNotice(id, payload) {
  const formData = new FormData()
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      formData.append(key, value)
    }
  })

  const response = await fetch(`${API_BASE_URL}/api/admin/notices/${id}/update/`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  })

  return handleResponse(response)
}

export async function deleteNotice(id) {
  const response = await fetch(`${API_BASE_URL}/api/admin/notices/${id}/delete/`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  })

  return handleResponse(response)
}

// =========================
// Admin Blogs
// =========================

export async function createBlog(payload) {
  const formData = new FormData()
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      formData.append(key, value)
    }
  })

  const response = await fetch(`${API_BASE_URL}/api/admin/blogs/create/`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  })

  return handleResponse(response)
}

export async function updateBlog(id, payload) {
  const formData = new FormData()
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      formData.append(key, value)
    }
  })

  const response = await fetch(`${API_BASE_URL}/api/admin/blogs/${id}/update/`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  })

  return handleResponse(response)
}

export async function deleteBlog(id) {
  const response = await fetch(`${API_BASE_URL}/api/admin/blogs/${id}/delete/`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  })

  return handleResponse(response)
}

// =========================
// Admin Alumni
// =========================

export async function createAlumni(payload) {
  const formData = new FormData()
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      formData.append(key, value)
    }
  })

  const response = await fetch(`${API_BASE_URL}/api/admin/alumni/create/`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  })

  return handleResponse(response)
}

export async function getAlumniDetails(id) {
  const response = await fetch(`${API_BASE_URL}/api/alumni/${id}/`, {
    credentials: 'include',
  })
  return handleResponse(response)
}

export async function getCommitteeMemberDetails(id) {
  const response = await fetch(`${API_BASE_URL}/api/committee/${id}/`, {
    credentials: 'include',
  })
  return handleResponse(response)
}

export async function updateAlumni(id, payload) {
  const formData = new FormData()
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      formData.append(key, value)
    }
  })

  const response = await fetch(`${API_BASE_URL}/api/admin/alumni/${id}/update/`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  })

  return handleResponse(response)
}

export async function deleteAlumni(id) {
  const response = await fetch(`${API_BASE_URL}/api/admin/alumni/${id}/delete/`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  })

  return handleResponse(response)
}

// =========================
// Admin Committee
// =========================

export async function createCommitteeYear(payload) {
  const formData = new FormData()
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      formData.append(key, value)
    }
  })

  const response = await fetch(`${API_BASE_URL}/api/admin/committee-years/create/`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  })

  return handleResponse(response)
}

export async function deleteCommitteeYear(id) {
  const response = await fetch(`${API_BASE_URL}/api/admin/committee-years/${id}/delete/`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  })

  return handleResponse(response)
}

export async function createCommitteeMember(payload) {
  const formData = new FormData()
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      formData.append(key, value)
    }
  })

  const response = await fetch(`${API_BASE_URL}/api/admin/committee-members/create/`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  })

  return handleResponse(response)
}

export async function updateCommitteeMember(id, payload) {
  const formData = new FormData()
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      formData.append(key, value)
    }
  })

  const response = await fetch(`${API_BASE_URL}/api/admin/committee-members/${id}/update/`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  })

  return handleResponse(response)
}

export async function deleteCommitteeMember(id) {
  const response = await fetch(`${API_BASE_URL}/api/admin/committee-members/${id}/delete/`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  })

  return handleResponse(response)
}
export async function submitEvent(payload) {
  const formData = new FormData()
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') formData.append(key, value)
  })

  const response = await fetch(`${API_BASE_URL}/api/submit/event/`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  })
  return handleResponse(response)
}

export async function submitNotice(payload) {
  const formData = new FormData()
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') formData.append(key, value)
  })

  const response = await fetch(`${API_BASE_URL}/api/submit/notice/`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  })
  return handleResponse(response)
}

export async function submitBlog(payload) {
  const formData = new FormData()
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') formData.append(key, value)
  })

  const response = await fetch(`${API_BASE_URL}/api/submit/blog/`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  })
  return handleResponse(response)
}

export async function submitAlumni(payload) {
  const formData = new FormData()
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') formData.append(key, value)
  })

  const response = await fetch(`${API_BASE_URL}/api/submit/alumni/`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  })
  return handleResponse(response)
}

export async function getPendingSubmissions() {
  const response = await fetch(`${API_BASE_URL}/api/admin/pending-submissions/`, {
    credentials: 'include',
  })
  return handleResponse(response)
}

export async function approvePending(type, id) {
  const response = await fetch(`${API_BASE_URL}/api/admin/pending-submissions/${type}/${id}/approve/`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  })
  return handleResponse(response)
}

export async function rejectPending(type, id) {
  const response = await fetch(`${API_BASE_URL}/api/admin/pending-submissions/${type}/${id}/reject/`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  })
  return handleResponse(response)
}

export async function updateProfile(payload) {
  const formData = new FormData()

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      formData.append(key, value)
    }
  })

  const response = await fetch(`${API_BASE_URL}/api/auth/update-profile/`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  })

  return handleResponse(response)
}

export async function changePassword(payload) {
  const response = await fetch(`${API_BASE_URL}/api/auth/change-password/`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  return handleResponse(response)
}