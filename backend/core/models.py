from django.db import models


class Event(models.Model):
    title = models.CharField(max_length=200)
    image = models.ImageField(upload_to='events/', blank=True, null=True)
    date = models.CharField(max_length=100)
    location = models.CharField(max_length=200)
    description = models.TextField()
    details = models.TextField()

    def __str__(self):
        return self.title


class Notice(models.Model):
    title = models.CharField(max_length=200)
    image = models.ImageField(upload_to='notices/', blank=True, null=True)
    date = models.CharField(max_length=100)
    description = models.TextField()
    details = models.TextField(blank=True)

    def __str__(self):
        return self.title

class CommitteeAcademicYear(models.Model):
    year_label = models.CharField(max_length=20, unique=True)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['-sort_order', '-id']

    def __str__(self):
        return self.year_label


class CommitteeMember(models.Model):
    academic_year = models.ForeignKey(
        CommitteeAcademicYear,
        on_delete=models.CASCADE,
        related_name='members',
        null=True,
        blank=True
    )
    name = models.CharField(max_length=150)
    title = models.CharField(max_length=150)
    image = models.ImageField(upload_to='committee/', blank=True, null=True)
    description = models.TextField()
    details = models.TextField(blank=True)
    display_order = models.PositiveIntegerField(default=0)
    facebook_url = models.URLField(blank=True, null=True)
    linkedin_url = models.URLField(blank=True, null=True)

    class Meta:
        ordering = ['display_order', 'id']

    def __str__(self):
        if self.academic_year:
            return f"{self.name} - {self.academic_year.year_label}"
        return f"{self.name} - No Academic Year"


class Alumni(models.Model):
    name = models.CharField(max_length=150)
    title = models.CharField(max_length=150)
    image = models.ImageField(upload_to='alumni/', blank=True, null=True)
    description = models.TextField()
    details = models.TextField(blank=True)
    facebook_url = models.URLField(blank=True, null=True)
    linkedin_url = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.name


class Blog(models.Model):
    title = models.CharField(max_length=200)
    image = models.ImageField(upload_to='blogs/', blank=True, null=True)
    date = models.CharField(max_length=100)
    description = models.TextField()
    details = models.TextField()

    def __str__(self):
        return self.title


class ContactMessage(models.Model):
    full_name = models.CharField(max_length=150)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.subject
    

from django.db import models
from django.contrib.auth.models import User


class MemberProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='member_profile')
    full_name = models.CharField(max_length=150)
    student_id = models.CharField(max_length=50, unique=True)
    batch = models.CharField(max_length=50)
    image = models.ImageField(upload_to='member_profiles/', blank=True, null=True)
    designation = models.CharField(max_length=120)
    year_label = models.CharField(max_length=20)
    details = models.TextField(blank=True)
    facebook_url = models.URLField(blank=True, null=True)
    linkedin_url = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.full_name

from django.db import models
from django.contrib.auth.models import User

# Existing models above...


class PendingEventSubmission(models.Model):
    submitted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    title = models.CharField(max_length=200)
    image = models.ImageField(upload_to='pending/events/', blank=True, null=True)
    date = models.CharField(max_length=100)
    location = models.CharField(max_length=200)
    description = models.TextField()
    details = models.TextField()
    status = models.CharField(max_length=20, default='pending')  # pending, approved, rejected
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Pending Event - {self.title}"


class PendingNoticeSubmission(models.Model):
    submitted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    title = models.CharField(max_length=200)
    image = models.ImageField(upload_to='pending/notices/', blank=True, null=True)
    date = models.CharField(max_length=100)
    description = models.TextField()
    details = models.TextField(blank=True)
    status = models.CharField(max_length=20, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Pending Notice - {self.title}"


class PendingBlogSubmission(models.Model):
    submitted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    title = models.CharField(max_length=200)
    image = models.ImageField(upload_to='pending/blogs/', blank=True, null=True)
    date = models.CharField(max_length=100)
    description = models.TextField()
    details = models.TextField()
    status = models.CharField(max_length=20, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Pending Blog - {self.title}"


class PendingAlumniSubmission(models.Model):
    submitted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    name = models.CharField(max_length=150)
    title = models.CharField(max_length=150)
    image = models.ImageField(upload_to='pending/alumni/', blank=True, null=True)
    description = models.TextField()
    details = models.TextField(blank=True)
    status = models.CharField(max_length=20, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    facebook_url = models.URLField(blank=True, null=True)
    linkedin_url = models.URLField(blank=True, null=True)

    def __str__(self):
        return f"Pending Alumni - {self.name}"