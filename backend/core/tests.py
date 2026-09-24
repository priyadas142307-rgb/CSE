from django.test import TestCase, Client
from django.contrib.auth.models import User
from core.models import (
    Event, Notice, Blog, Alumni, CommitteeAcademicYear,
    CommitteeMember, MemberProfile, ContactMessage
)
from core.views import (
    is_valid_student_id, is_valid_batch, is_valid_username, is_valid_password
)
import json


class ValidationTests(TestCase):
    def test_student_id_validation(self):
        self.assertTrue(is_valid_student_id("123-115-456"))
        self.assertFalse(is_valid_student_id("12-115-456"))
        self.assertFalse(is_valid_student_id("123-114-456"))
        self.assertFalse(is_valid_student_id("abcdef"))

    def test_batch_validation(self):
        self.assertTrue(is_valid_batch("58"))
        self.assertTrue(is_valid_batch("60"))
        self.assertFalse(is_valid_batch("58th"))
        self.assertFalse(is_valid_batch("abc"))

    def test_username_validation(self):
        self.assertTrue(is_valid_username("abc12"))
        self.assertTrue(is_valid_username("priya14"))
        self.assertFalse(is_valid_username("ab12"))  # Needs at least 3 letters
        self.assertFalse(is_valid_username("abc1"))   # Needs at least 2 digits

    def test_password_validation(self):
        self.assertTrue(is_valid_password("Password@123"))
        self.assertFalse(is_valid_password("pass"))         # Too short
        self.assertFalse(is_valid_password("password123"))  # No uppercase & special
        self.assertFalse(is_valid_password("Password123"))  # No special char


class PublicApiTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.year = CommitteeAcademicYear.objects.create(year_label="2025-26", sort_order=1)
        self.event = Event.objects.create(
            title="Tech Fest 2026",
            date="2026-10-15",
            location="Auditorium",
            description="Annual tech fest",
            details="Detailed description here"
        )
        self.notice = Notice.objects.create(
            title="Society Registration Notice",
            date="2026-09-01",
            description="Notice for new registrations",
            details="Details for registrations"
        )
        self.blog = Blog.objects.create(
            title="AI Revolution",
            date="2026-09-20",
            description="Blog on AI",
            details="Full blog article"
        )
        self.alumni = Alumni.objects.create(
            name="Rahim Ahmed",
            title="Software Engineer at Google",
            description="Alumni profile",
            details="Details about Rahim"
        )

    def test_home_api(self):
        response = self.client.get('/api/home/')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn('events', data)
        self.assertIn('notices', data)
        self.assertIn('committee', data)
        self.assertIn('alumni', data)
        self.assertIn('blogs', data)
        self.assertEqual(len(data['events']), 1)
        self.assertEqual(data['events'][0]['title'], "Tech Fest 2026")

    def test_events_api(self):
        response = self.client.get('/api/events/')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['title'], "Tech Fest 2026")

    def test_event_detail_api(self):
        response = self.client.get(f'/api/events/{self.event.id}/')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['title'], "Tech Fest 2026")

    def test_event_detail_not_found(self):
        response = self.client.get('/api/events/9999/')
        self.assertEqual(response.status_code, 404)

    def test_contact_api(self):
        payload = {
            "full_name": "Test User",
            "email": "test@example.com",
            "subject": "Inquiry",
            "message": "Hello Society Team"
        }
        response = self.client.post(
            '/api/contact/',
            data=json.dumps(payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(ContactMessage.objects.count(), 1)


class AuthAndAdminTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.regular_user = User.objects.create_user(
            username="member01",
            email="member01@example.com",
            password="Password@123"
        )
        self.admin_user = User.objects.create_superuser(
            username="admin01",
            email="admin01@example.com",
            password="Password@123"
        )

    def test_login_successful(self):
        response = self.client.post(
            '/api/auth/login/',
            data=json.dumps({
                "username": "member01",
                "password": "Password@123"
            }),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['user']['username'], "member01")

    def test_admin_dashboard_unauthorized(self):
        response = self.client.get('/api/admin/dashboard/')
        self.assertEqual(response.status_code, 401)

    def test_admin_dashboard_forbidden_for_regular_member(self):
        self.client.force_login(self.regular_user)
        response = self.client.get('/api/admin/dashboard/')
        self.assertEqual(response.status_code, 403)

    def test_admin_dashboard_allowed_for_superuser(self):
        self.client.force_login(self.admin_user)
        response = self.client.get('/api/admin/dashboard/')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn('events', data)
        self.assertIn('users', data)
