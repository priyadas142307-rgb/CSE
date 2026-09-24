import json
import re

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import (
    Alumni,
    Blog,
    CommitteeAcademicYear,
    CommitteeMember,
    ContactMessage,
    Event,
    MemberProfile,
    Notice,
)


def build_image_url(request, image_field):
    if not image_field:
        return None
    return request.build_absolute_uri(image_field.url)

def is_valid_student_id(student_id):
    return bool(re.fullmatch(r'\d{3}-115-\d{3}', student_id))


def is_valid_batch(batch):
    return bool(re.fullmatch(r'\d+', batch))


def is_valid_username(username):
    starts_with_three_letters = bool(re.match(r'^[A-Za-z]{3,}', username))
    digit_count = len(re.findall(r'\d', username))
    return starts_with_three_letters and digit_count >= 2


def is_valid_password(password):
    if len(password) < 6:
        return False
    if not re.search(r'[A-Z]', password):
        return False
    if not re.search(r'\d', password):
        return False
    if not re.search(r'[^A-Za-z0-9]', password):
        return False
    return True


def admin_required_response(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Authentication required."}, status=401)
    if not request.user.is_staff:
        return JsonResponse({"error": "Admin access required."}, status=403)
    return None


def serialize_event(request, obj):
    return {
        "id": obj.id,
        "title": obj.title,
        "image": build_image_url(request, obj.image),
        "date": obj.date,
        "location": obj.location,
        "description": obj.description,
        "details": obj.details,
    }


def serialize_notice(request, obj):
    return {
        "id": obj.id,
        "title": obj.title,
        "image": build_image_url(request, obj.image),
        "date": obj.date,
        "description": obj.description,
        "details": obj.details,
    }


def serialize_committee_member(request, obj):
    return {
        "id": obj.id,
        "name": obj.name,
        "title": obj.title,
        "image": build_image_url(request, obj.image),
        "description": obj.description,
        "details": obj.details,
        "academic_year": obj.academic_year.year_label if obj.academic_year else "",
        "academic_year_id": obj.academic_year.id if obj.academic_year else None,
        "display_order": obj.display_order,
        "facebook_url": obj.facebook_url or "",
        "linkedin_url": obj.linkedin_url or "",
    }


def serialize_alumni(request, obj):
    return {
        "id": obj.id,
        "name": obj.name,
        "title": obj.title,
        "image": build_image_url(request, obj.image),
        "description": obj.description,
        "details": obj.details,
        "facebook_url": obj.facebook_url or "",
        "linkedin_url": obj.linkedin_url or "",
    }


def serialize_blog(request, obj):
    return {
        "id": obj.id,
        "title": obj.title,
        "image": build_image_url(request, obj.image),
        "date": obj.date,
        "description": obj.description,
        "details": obj.details,
    }


def serialize_logged_user(request, user):
    profile = getattr(user, 'member_profile', None)

    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "full_name": profile.full_name if profile else user.username,
        "student_id": profile.student_id if profile else "",
        "batch": profile.batch if profile else "",
        "image": build_image_url(request, profile.image) if profile and profile.image else None,
        "designation": profile.designation if profile else "",
        "year_label": profile.year_label if profile else "",
        "details": profile.details if profile else "",
        "facebook_url": profile.facebook_url if profile else "",
        "linkedin_url": profile.linkedin_url if profile else "",
        "is_staff": user.is_staff,
        "is_superuser": user.is_superuser,
    }

# =========================
# Public APIs
# =========================

def home_api(request):
    events = [serialize_event(request, obj) for obj in Event.objects.all().order_by('-id')[:3]]
    notices = [serialize_notice(request, obj) for obj in Notice.objects.all().order_by('-id')[:3]]
    alumni = [serialize_alumni(request, obj) for obj in Alumni.objects.all().order_by('-id')[:3]]
    blogs = [serialize_blog(request, obj) for obj in Blog.objects.all().order_by('-id')[:3]]

    current_year_label = "2025-26"
    current_year = CommitteeAcademicYear.objects.filter(year_label=current_year_label).first()

    if current_year:
        committee_queryset = CommitteeMember.objects.filter(
            academic_year=current_year
        ).order_by('display_order', 'id')[:3]
    else:
        committee_queryset = CommitteeMember.objects.none()

    committee = [serialize_committee_member(request, obj) for obj in committee_queryset]

    return JsonResponse({
        "events": events,
        "notices": notices,
        "committee": committee,
        "alumni": alumni,
        "blogs": blogs,
    })


def events_api(request):
    data = [serialize_event(request, obj) for obj in Event.objects.all().order_by('-id')]
    return JsonResponse(data, safe=False)


def event_detail_api(request, item_id):
    try:
        obj = Event.objects.get(id=item_id)
        return JsonResponse(serialize_event(request, obj))
    except Event.DoesNotExist:
        return JsonResponse({"error": "Event not found"}, status=404)


def notices_api(request):
    data = [serialize_notice(request, obj) for obj in Notice.objects.all().order_by('-id')]
    return JsonResponse(data, safe=False)


def notice_detail_api(request, item_id):
    try:
        obj = Notice.objects.get(id=item_id)
        return JsonResponse(serialize_notice(request, obj))
    except Notice.DoesNotExist:
        return JsonResponse({"error": "Notice not found"}, status=404)


def committee_years_api(request):
    years = CommitteeAcademicYear.objects.all()
    data = [
        {
            "id": year.id,
            "year_label": year.year_label,
            "sort_order": year.sort_order,
        }
        for year in years
    ]
    return JsonResponse(data, safe=False)


def committee_api(request):
    selected_year = request.GET.get('year')
    years = CommitteeAcademicYear.objects.all()

    if selected_year:
        try:
            year_obj = years.get(year_label=selected_year)
        except CommitteeAcademicYear.DoesNotExist:
            return JsonResponse({
                "selected_year": None,
                "years": [],
                "featured_member": None,
                "members": [],
            })
    else:
        year_obj = years.first()

    if not year_obj:
        return JsonResponse({
            "selected_year": None,
            "years": [],
            "featured_member": None,
            "members": [],
        })

    members = CommitteeMember.objects.filter(academic_year=year_obj).order_by('display_order', 'id')

    serialized_members = [serialize_committee_member(request, obj) for obj in members]
    featured_member = serialized_members[0] if serialized_members else None
    remaining_members = serialized_members[1:] if len(serialized_members) > 1 else []

    return JsonResponse({
        "selected_year": year_obj.year_label,
        "years": [
            {
                "id": year.id,
                "year_label": year.year_label,
                "sort_order": year.sort_order,
            }
            for year in years
        ],
        "featured_member": featured_member,
        "members": remaining_members,
    })


def alumni_api(request):
    data = [serialize_alumni(request, obj) for obj in Alumni.objects.all().order_by('-id')]
    return JsonResponse(data, safe=False)


def blogs_api(request):
    data = [serialize_blog(request, obj) for obj in Blog.objects.all().order_by('-id')]
    return JsonResponse(data, safe=False)


def blog_detail_api(request, item_id):
    try:
        obj = Blog.objects.get(id=item_id)
        return JsonResponse(serialize_blog(request, obj))
    except Blog.DoesNotExist:
        return JsonResponse({"error": "Blog not found"}, status=404)


@csrf_exempt
def contact_api(request):
    if request.method != 'POST':
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    try:
        data = json.loads(request.body)

        contact = ContactMessage.objects.create(
            full_name=data.get('full_name', '').strip(),
            email=data.get('email', '').strip(),
            subject=data.get('subject', '').strip(),
            message=data.get('message', '').strip(),
        )

        return JsonResponse({
            "message": "Message sent successfully",
            "id": contact.id,
        }, status=201)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)
    

def alumni_detail_api(request, pk):
    try:
        item = Alumni.objects.get(pk=pk)
        return JsonResponse({
            "id": item.id,
            "name": item.name,
            "title": item.title,
            "description": item.description,
            "details": item.details,
            "image": build_image_url(request, item.image),
            "facebook_url": item.facebook_url or "",
            "linkedin_url": item.linkedin_url or "",
        })
    except Alumni.DoesNotExist:
        return JsonResponse({"error": "Alumni not found"}, status=404)


def committee_member_detail_api(request, pk):
    try:
        item = CommitteeMember.objects.get(pk=pk)
        return JsonResponse({
            "id": item.id,
            "name": item.name,
            "title": item.title,
            "description": item.description,
            "details": item.details,
            "image": build_image_url(request, item.image),
            "facebook_url": item.facebook_url or "",
            "linkedin_url": item.linkedin_url or "",
        })
    except CommitteeMember.DoesNotExist:
        return JsonResponse({"error": "Committee member not found"}, status=404)


# =========================
# Auth APIs
# =========================

@csrf_exempt
def register_api(request):
    if request.method != 'POST':
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    try:
        full_name = request.POST.get('full_name', '').strip()
        student_id = request.POST.get('student_id', '').strip()
        batch = request.POST.get('batch', '').strip()
        designation = request.POST.get('designation', '').strip()
        year_label = request.POST.get('year_label', '').strip()
        details = request.POST.get('details', '').strip()
        username = request.POST.get('username', '').strip()
        email = request.POST.get('email', '').strip()
        password = request.POST.get('password', '').strip()
        image = request.FILES.get('image')
        facebook_url = request.POST.get('facebook_url', '').strip()
        linkedin_url = request.POST.get('linkedin_url', '').strip()

        if not all([full_name, student_id, batch, designation, year_label, username, email, password]):
            return JsonResponse({"error": "All required fields must be filled."}, status=400)

        if not is_valid_student_id(student_id):
            return JsonResponse({
                "error": "Student ID must be in this format: 123-115-456"
            }, status=400)

        if not is_valid_batch(batch):
            return JsonResponse({
                "error": "Batch must contain numbers only. Example: 58"
            }, status=400)

        if not is_valid_username(username):
            return JsonResponse({
                "error": "Username must start with at least 3 letters and contain at least 2 numbers. Example: abc12"
            }, status=400)

        if not is_valid_password(password):
            return JsonResponse({
                "error": "Password must be at least 6 characters and include 1 uppercase letter, 1 number, and 1 special character."
            }, status=400)

        if User.objects.filter(username=username).exists():
            return JsonResponse({"error": "Username already exists. Please choose another one."}, status=400)

        if User.objects.filter(email=email).exists():
            return JsonResponse({"error": "Email already exists."}, status=400)

        if MemberProfile.objects.filter(student_id=student_id).exists():
            return JsonResponse({"error": "Student ID already exists."}, status=400)

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
        )

        user.is_staff = False
        user.save()

        MemberProfile.objects.create(
            user=user,
            full_name=full_name,
            student_id=student_id,
            batch=batch,
            image=image,
            designation=designation,
            year_label=year_label,
            details=details,
            facebook_url=facebook_url,
            linkedin_url=linkedin_url,
        )

        return JsonResponse({
            "message": "Account created successfully. You can now log in."
        }, status=201)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@csrf_exempt
def login_api(request):
    if request.method != 'POST':
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    try:
        data = json.loads(request.body)
        username = data.get('username', '').strip()
        password = data.get('password', '').strip()

        user = authenticate(request, username=username, password=password)

        if user is None:
            return JsonResponse({"error": "Invalid username or password."}, status=401)

        login(request, user)
        request.session.save()

        return JsonResponse({
            "message": "Login successful.",
            "user": serialize_logged_user(request, user)
        }, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@csrf_exempt
def logout_api(request):
    if request.method != 'POST':
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    logout(request)
    return JsonResponse({"message": "Logged out successfully."}, status=200)


def current_user_api(request):
    if not request.user.is_authenticated:
        return JsonResponse({"authenticated": False}, status=200)

    return JsonResponse({
        "authenticated": True,
        "user": serialize_logged_user(request, request.user)
    }, status=200)


# =========================
# Admin Dashboard APIs
# =========================

def admin_dashboard_api(request):
    denied = admin_required_response(request)
    if denied:
        return denied

    return JsonResponse({
        "events": Event.objects.count(),
        "notices": Notice.objects.count(),
        "blogs": Blog.objects.count(),
        "alumni": Alumni.objects.count(),
        "committee_members": CommitteeMember.objects.count(),
        "committee_years": CommitteeAcademicYear.objects.count(),
        "users": User.objects.count(),
    })


def admin_users_api(request):
    denied = admin_required_response(request)
    if denied:
        return denied

    users = User.objects.all().order_by('-id')
    data = [serialize_logged_user(request, user) for user in users]
    return JsonResponse(data, safe=False)


# =========================
# Admin Event CRUD
# =========================

@csrf_exempt
def admin_create_event_api(request):
    denied = admin_required_response(request)
    if denied:
        return denied

    if request.method != 'POST':
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    try:
        event = Event.objects.create(
            title=request.POST.get('title', '').strip(),
            image=request.FILES.get('image'),
            date=request.POST.get('date', '').strip(),
            location=request.POST.get('location', '').strip(),
            description=request.POST.get('description', '').strip(),
            details=request.POST.get('details', '').strip(),
        )
        return JsonResponse({
            "message": "Event created successfully.",
            "item": serialize_event(request, event),
        }, status=201)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@csrf_exempt
def admin_update_event_api(request, item_id):
    denied = admin_required_response(request)
    if denied:
        return denied

    if request.method != 'POST':
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    try:
        event = Event.objects.get(id=item_id)

        event.title = request.POST.get('title', event.title).strip()
        event.date = request.POST.get('date', event.date).strip()
        event.location = request.POST.get('location', event.location).strip()
        event.description = request.POST.get('description', event.description).strip()
        event.details = request.POST.get('details', event.details).strip()

        image = request.FILES.get('image')
        if image:
            event.image = image

        event.save()

        return JsonResponse({
            "message": "Event updated successfully.",
            "item": serialize_event(request, event),
        })
    except Event.DoesNotExist:
        return JsonResponse({"error": "Event not found."}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@csrf_exempt
def admin_delete_event_api(request, item_id):
    denied = admin_required_response(request)
    if denied:
        return denied

    if request.method != 'POST':
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    try:
        event = Event.objects.get(id=item_id)
        event.delete()
        return JsonResponse({"message": "Event deleted successfully."})
    except Event.DoesNotExist:
        return JsonResponse({"error": "Event not found."}, status=404)


# =========================
# Admin Notice CRUD
# =========================

@csrf_exempt
def admin_create_notice_api(request):
    denied = admin_required_response(request)
    if denied:
        return denied

    if request.method != 'POST':
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    try:
        notice = Notice.objects.create(
            title=request.POST.get('title', '').strip(),
            image=request.FILES.get('image'),
            date=request.POST.get('date', '').strip(),
            description=request.POST.get('description', '').strip(),
            details=request.POST.get('details', '').strip(),
        )
        return JsonResponse({
            "message": "Notice created successfully.",
            "item": serialize_notice(request, notice),
        }, status=201)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@csrf_exempt
def admin_update_notice_api(request, item_id):
    denied = admin_required_response(request)
    if denied:
        return denied

    if request.method != 'POST':
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    try:
        notice = Notice.objects.get(id=item_id)

        notice.title = request.POST.get('title', notice.title).strip()
        notice.date = request.POST.get('date', notice.date).strip()
        notice.description = request.POST.get('description', notice.description).strip()
        notice.details = request.POST.get('details', notice.details).strip()

        image = request.FILES.get('image')
        if image:
            notice.image = image

        notice.save()

        return JsonResponse({
            "message": "Notice updated successfully.",
            "item": serialize_notice(request, notice),
        })
    except Notice.DoesNotExist:
        return JsonResponse({"error": "Notice not found."}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@csrf_exempt
def admin_delete_notice_api(request, item_id):
    denied = admin_required_response(request)
    if denied:
        return denied

    if request.method != 'POST':
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    try:
        notice = Notice.objects.get(id=item_id)
        notice.delete()
        return JsonResponse({"message": "Notice deleted successfully."})
    except Notice.DoesNotExist:
        return JsonResponse({"error": "Notice not found."}, status=404)


# =========================
# Admin Blog CRUD
# =========================

@csrf_exempt
def admin_create_blog_api(request):
    denied = admin_required_response(request)
    if denied:
        return denied

    if request.method != 'POST':
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    try:
        blog = Blog.objects.create(
            title=request.POST.get('title', '').strip(),
            image=request.FILES.get('image'),
            date=request.POST.get('date', '').strip(),
            description=request.POST.get('description', '').strip(),
            details=request.POST.get('details', '').strip(),
        )
        return JsonResponse({
            "message": "Blog created successfully.",
            "item": serialize_blog(request, blog),
        }, status=201)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@csrf_exempt
def admin_update_blog_api(request, item_id):
    denied = admin_required_response(request)
    if denied:
        return denied

    if request.method != 'POST':
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    try:
        blog = Blog.objects.get(id=item_id)

        blog.title = request.POST.get('title', blog.title).strip()
        blog.date = request.POST.get('date', blog.date).strip()
        blog.description = request.POST.get('description', blog.description).strip()
        blog.details = request.POST.get('details', blog.details).strip()

        image = request.FILES.get('image')
        if image:
            blog.image = image

        blog.save()

        return JsonResponse({
            "message": "Blog updated successfully.",
            "item": serialize_blog(request, blog),
        })
    except Blog.DoesNotExist:
        return JsonResponse({"error": "Blog not found."}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@csrf_exempt
def admin_delete_blog_api(request, item_id):
    denied = admin_required_response(request)
    if denied:
        return denied

    if request.method != 'POST':
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    try:
        blog = Blog.objects.get(id=item_id)
        blog.delete()
        return JsonResponse({"message": "Blog deleted successfully."})
    except Blog.DoesNotExist:
        return JsonResponse({"error": "Blog not found."}, status=404)


# =========================
# Admin Alumni CRUD
# =========================

@csrf_exempt
def admin_create_alumni_api(request):
    denied = admin_required_response(request)
    if denied:
        return denied

    if request.method != 'POST':
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    try:
        alumni = Alumni.objects.create(
            name=request.POST.get('name', '').strip(),
            title=request.POST.get('title', '').strip(),
            image=request.FILES.get('image'),
            description=request.POST.get('description', '').strip(),
            details=request.POST.get('details', '').strip(),
            facebook_url=request.POST.get('facebook_url', '').strip(),
            linkedin_url=request.POST.get('linkedin_url', '').strip(),
        )
        return JsonResponse({
            "message": "Alumni created successfully.",
            "item": serialize_alumni(request, alumni),
        }, status=201)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@csrf_exempt
def admin_update_alumni_api(request, item_id):
    denied = admin_required_response(request)
    if denied:
        return denied

    if request.method != 'POST':
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    try:
        alumni = Alumni.objects.get(id=item_id)

        alumni.name = request.POST.get('name', alumni.name).strip()
        alumni.title = request.POST.get('title', alumni.title).strip()
        alumni.description = request.POST.get('description', alumni.description).strip()
        alumni.details = request.POST.get('details', alumni.details).strip()
        alumni.facebook_url = request.POST.get('facebook_url', alumni.facebook_url).strip()
        alumni.linkedin_url = request.POST.get('linkedin_url', alumni.linkedin_url).strip()

        image = request.FILES.get('image')
        if image:
            alumni.image = image

        alumni.save()

        return JsonResponse({
            "message": "Alumni updated successfully.",
            "item": serialize_alumni(request, alumni),
        })
    except Alumni.DoesNotExist:
        return JsonResponse({"error": "Alumni not found."}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@csrf_exempt
def admin_delete_alumni_api(request, item_id):
    denied = admin_required_response(request)
    if denied:
        return denied

    if request.method != 'POST':
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    try:
        alumni = Alumni.objects.get(id=item_id)
        alumni.delete()
        return JsonResponse({"message": "Alumni deleted successfully."})
    except Alumni.DoesNotExist:
        return JsonResponse({"error": "Alumni not found."}, status=404)


# =========================
# Admin Committee Year CRUD
# =========================

@csrf_exempt
def admin_create_committee_year_api(request):
    denied = admin_required_response(request)
    if denied:
        return denied

    if request.method != 'POST':
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    try:
        year_label = request.POST.get('year_label', '').strip()
        sort_order = request.POST.get('sort_order', '0').strip() or '0'

        if not year_label:
            return JsonResponse({"error": "Year label is required."}, status=400)

        if CommitteeAcademicYear.objects.filter(year_label=year_label).exists():
            return JsonResponse({"error": "This academic year already exists."}, status=400)

        year = CommitteeAcademicYear.objects.create(
            year_label=year_label,
            sort_order=int(sort_order),
        )

        return JsonResponse({
            "message": "Committee year created successfully.",
            "item": {
                "id": year.id,
                "year_label": year.year_label,
                "sort_order": year.sort_order,
            }
        }, status=201)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@csrf_exempt
def admin_delete_committee_year_api(request, item_id):
    denied = admin_required_response(request)
    if denied:
        return denied

    if request.method != 'POST':
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    try:
        year = CommitteeAcademicYear.objects.get(id=item_id)
        year.delete()
        return JsonResponse({"message": "Committee year deleted successfully."})
    except CommitteeAcademicYear.DoesNotExist:
        return JsonResponse({"error": "Committee year not found."}, status=404)


# =========================
# Admin Committee Member CRUD
# =========================

@csrf_exempt
def admin_create_committee_member_api(request):
    denied = admin_required_response(request)
    if denied:
        return denied

    if request.method != 'POST':
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    try:
        academic_year_id = request.POST.get('academic_year_id', '').strip()
        if not academic_year_id:
            return JsonResponse({"error": "Academic year is required."}, status=400)

        academic_year = CommitteeAcademicYear.objects.get(id=academic_year_id)

        member = CommitteeMember.objects.create(
            academic_year=academic_year,
            name=request.POST.get('name', '').strip(),
            title=request.POST.get('title', '').strip(),
            image=request.FILES.get('image'),
            description=request.POST.get('description', '').strip(),
            details=request.POST.get('details', '').strip(),
            display_order=int(request.POST.get('display_order', '0').strip() or '0'),
            facebook_url=request.POST.get('facebook_url', '').strip(),
            linkedin_url=request.POST.get('linkedin_url', '').strip(),
        )

        return JsonResponse({
            "message": "Committee member created successfully.",
            "item": serialize_committee_member(request, member),
        }, status=201)
    except CommitteeAcademicYear.DoesNotExist:
        return JsonResponse({"error": "Academic year not found."}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@csrf_exempt
def admin_update_committee_member_api(request, item_id):
    denied = admin_required_response(request)
    if denied:
        return denied

    if request.method != 'POST':
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    try:
        member = CommitteeMember.objects.get(id=item_id)

        academic_year_id = request.POST.get('academic_year_id', '').strip()
        if academic_year_id:
            member.academic_year = CommitteeAcademicYear.objects.get(id=academic_year_id)

        member.name = request.POST.get('name', member.name).strip()
        member.title = request.POST.get('title', member.title).strip()
        member.description = request.POST.get('description', member.description).strip()
        member.details = request.POST.get('details', member.details).strip()
        member.display_order = int(request.POST.get('display_order', str(member.display_order)).strip() or '0')
        member.facebook_url = request.POST.get('facebook_url', member.facebook_url).strip()
        member.linkedin_url = request.POST.get('linkedin_url', member.linkedin_url).strip()

        image = request.FILES.get('image')
        if image:
            member.image = image

        member.save()

        return JsonResponse({
            "message": "Committee member updated successfully.",
            "item": serialize_committee_member(request, member),
        })
    except CommitteeMember.DoesNotExist:
        return JsonResponse({"error": "Committee member not found."}, status=404)
    except CommitteeAcademicYear.DoesNotExist:
        return JsonResponse({"error": "Academic year not found."}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@csrf_exempt
def admin_delete_committee_member_api(request, item_id):
    denied = admin_required_response(request)
    if denied:
        return denied

    if request.method != 'POST':
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    try:
        member = CommitteeMember.objects.get(id=item_id)
        member.delete()
        return JsonResponse({"message": "Committee member deleted successfully."})
    except CommitteeMember.DoesNotExist:
        return JsonResponse({"error": "Committee member not found."}, status=404)
    
from .models import (
    PendingEventSubmission,
    PendingNoticeSubmission,
    PendingBlogSubmission,
    PendingAlumniSubmission,
)

def serialize_pending_event(request, obj):
    return {
        "id": obj.id,
        "title": obj.title,
        "image": build_image_url(request, obj.image),
        "date": obj.date,
        "location": obj.location,
        "description": obj.description,
        "details": obj.details,
        "status": obj.status,
        "submitted_by": obj.submitted_by.username if obj.submitted_by else "",
        "created_at": obj.created_at.isoformat(),
        "type": "event",
    }


def serialize_pending_notice(request, obj):
    return {
        "id": obj.id,
        "title": obj.title,
        "image": build_image_url(request, obj.image),
        "date": obj.date,
        "description": obj.description,
        "details": obj.details,
        "status": obj.status,
        "submitted_by": obj.submitted_by.username if obj.submitted_by else "",
        "created_at": obj.created_at.isoformat(),
        "type": "notice",
    }


def serialize_pending_blog(request, obj):
    return {
        "id": obj.id,
        "title": obj.title,
        "image": build_image_url(request, obj.image),
        "date": obj.date,
        "description": obj.description,
        "details": obj.details,
        "status": obj.status,
        "submitted_by": obj.submitted_by.username if obj.submitted_by else "",
        "created_at": obj.created_at.isoformat(),
        "type": "blog",
    }


def serialize_pending_alumni(request, obj):
    return {
        "id": obj.id,
        "name": obj.name,
        "title": obj.title,
        "image": build_image_url(request, obj.image),
        "description": obj.description,
        "details": obj.details,
        "facebook_url": obj.facebook_url or "",
        "linkedin_url": obj.linkedin_url or "",
        "status": obj.status,
        "submitted_by": obj.submitted_by.username if obj.submitted_by else "",
        "created_at": obj.created_at.isoformat(),
        "type": "alumni",
    }


@csrf_exempt
def submit_event_api(request):
    if request.method != 'POST':
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    if not request.user.is_authenticated:
        return JsonResponse({"error": "Login required."}, status=401)

    try:
        item = PendingEventSubmission.objects.create(
            submitted_by=request.user,
            title=request.POST.get('title', '').strip(),
            image=request.FILES.get('image'),
            date=request.POST.get('date', '').strip(),
            location=request.POST.get('location', '').strip(),
            description=request.POST.get('description', '').strip(),
            details=request.POST.get('details', '').strip(),
        )
        return JsonResponse({"message": "Event submitted for admin approval.", "item": serialize_pending_event(request, item)}, status=201)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@csrf_exempt
def submit_notice_api(request):
    if request.method != 'POST':
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    if not request.user.is_authenticated:
        return JsonResponse({"error": "Login required."}, status=401)

    try:
        item = PendingNoticeSubmission.objects.create(
            submitted_by=request.user,
            title=request.POST.get('title', '').strip(),
            image=request.FILES.get('image'),
            date=request.POST.get('date', '').strip(),
            description=request.POST.get('description', '').strip(),
            details=request.POST.get('details', '').strip(),
        )
        return JsonResponse({"message": "Notice submitted for admin approval.", "item": serialize_pending_notice(request, item)}, status=201)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@csrf_exempt
def submit_blog_api(request):
    if request.method != 'POST':
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    if not request.user.is_authenticated:
        return JsonResponse({"error": "Login required."}, status=401)

    try:
        item = PendingBlogSubmission.objects.create(
            submitted_by=request.user,
            title=request.POST.get('title', '').strip(),
            image=request.FILES.get('image'),
            date=request.POST.get('date', '').strip(),
            description=request.POST.get('description', '').strip(),
            details=request.POST.get('details', '').strip(),
        )
        return JsonResponse({"message": "Blog submitted for admin approval.", "item": serialize_pending_blog(request, item)}, status=201)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@csrf_exempt
def submit_alumni_api(request):
    if request.method != 'POST':
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    if not request.user.is_authenticated:
        return JsonResponse({"error": "Login required."}, status=401)

    try:
        item = PendingAlumniSubmission.objects.create(
            submitted_by=request.user,
            name=request.POST.get('name', '').strip(),
            title=request.POST.get('title', '').strip(),
            image=request.FILES.get('image'),
            description=request.POST.get('description', '').strip(),
            details=request.POST.get('details', '').strip(),
            facebook_url=request.POST.get('facebook_url', '').strip(),
            linkedin_url=request.POST.get('linkedin_url', '').strip(),
        )
        return JsonResponse({
            "message": "Alumni entry submitted for admin approval.",
            "item": serialize_pending_alumni(request, item)
        }, status=201)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


def admin_pending_submissions_api(request):
    denied = admin_required_response(request)
    if denied:
        return denied

    events = [serialize_pending_event(request, obj) for obj in PendingEventSubmission.objects.filter(status='pending').order_by('-id')]
    notices = [serialize_pending_notice(request, obj) for obj in PendingNoticeSubmission.objects.filter(status='pending').order_by('-id')]
    blogs = [serialize_pending_blog(request, obj) for obj in PendingBlogSubmission.objects.filter(status='pending').order_by('-id')]
    alumni = [serialize_pending_alumni(request, obj) for obj in PendingAlumniSubmission.objects.filter(status='pending').order_by('-id')]

    return JsonResponse({
        "events": events,
        "notices": notices,
        "blogs": blogs,
        "alumni": alumni,
    })


@csrf_exempt
def admin_approve_event_submission_api(request, item_id):
    denied = admin_required_response(request)
    if denied:
        return denied

    if request.method != 'POST':
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    try:
        pending = PendingEventSubmission.objects.get(id=item_id, status='pending')

        Event.objects.create(
            title=pending.title,
            image=pending.image,
            date=pending.date,
            location=pending.location,
            description=pending.description,
            details=pending.details,
        )

        pending.status = 'approved'
        pending.save()

        return JsonResponse({"message": "Event approved successfully."})
    except PendingEventSubmission.DoesNotExist:
        return JsonResponse({"error": "Pending event not found."}, status=404)


@csrf_exempt
def admin_reject_event_submission_api(request, item_id):
    denied = admin_required_response(request)
    if denied:
        return denied

    if request.method != 'POST':
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    try:
        pending = PendingEventSubmission.objects.get(id=item_id, status='pending')
        pending.status = 'rejected'
        pending.save()
        return JsonResponse({"message": "Event submission rejected."})
    except PendingEventSubmission.DoesNotExist:
        return JsonResponse({"error": "Pending event not found."}, status=404)


@csrf_exempt
def admin_approve_notice_submission_api(request, item_id):
    denied = admin_required_response(request)
    if denied:
        return denied

    if request.method != 'POST':
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    try:
        pending = PendingNoticeSubmission.objects.get(id=item_id, status='pending')

        Notice.objects.create(
            title=pending.title,
            image=pending.image,
            date=pending.date,
            description=pending.description,
            details=pending.details,
        )

        pending.status = 'approved'
        pending.save()

        return JsonResponse({"message": "Notice approved successfully."})
    except PendingNoticeSubmission.DoesNotExist:
        return JsonResponse({"error": "Pending notice not found."}, status=404)


@csrf_exempt
def admin_reject_notice_submission_api(request, item_id):
    denied = admin_required_response(request)
    if denied:
        return denied

    if request.method != 'POST':
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    try:
        pending = PendingNoticeSubmission.objects.get(id=item_id, status='pending')
        pending.status = 'rejected'
        pending.save()
        return JsonResponse({"message": "Notice submission rejected."})
    except PendingNoticeSubmission.DoesNotExist:
        return JsonResponse({"error": "Pending notice not found."}, status=404)


@csrf_exempt
def admin_approve_blog_submission_api(request, item_id):
    denied = admin_required_response(request)
    if denied:
        return denied

    if request.method != 'POST':
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    try:
        pending = PendingBlogSubmission.objects.get(id=item_id, status='pending')

        Blog.objects.create(
            title=pending.title,
            image=pending.image,
            date=pending.date,
            description=pending.description,
            details=pending.details,
        )

        pending.status = 'approved'
        pending.save()

        return JsonResponse({"message": "Blog approved successfully."})
    except PendingBlogSubmission.DoesNotExist:
        return JsonResponse({"error": "Pending blog not found."}, status=404)


@csrf_exempt
def admin_reject_blog_submission_api(request, item_id):
    denied = admin_required_response(request)
    if denied:
        return denied

    if request.method != 'POST':
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    try:
        pending = PendingBlogSubmission.objects.get(id=item_id, status='pending')
        pending.status = 'rejected'
        pending.save()
        return JsonResponse({"message": "Blog submission rejected."})
    except PendingBlogSubmission.DoesNotExist:
        return JsonResponse({"error": "Pending blog not found."}, status=404)


@csrf_exempt
def admin_approve_alumni_submission_api(request, item_id):
    denied = admin_required_response(request)
    if denied:
        return denied

    if request.method != 'POST':
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    try:
        pending = PendingAlumniSubmission.objects.get(id=item_id, status='pending')

        Alumni.objects.create(
            name=pending.name,
            title=pending.title,
            image=pending.image,
            description=pending.description,
            details=pending.details,
            facebook_url=pending.facebook_url,
            linkedin_url=pending.linkedin_url,
        )

        pending.status = 'approved'
        pending.save()

        return JsonResponse({"message": "Alumni submission approved successfully."})
    except PendingAlumniSubmission.DoesNotExist:
        return JsonResponse({"error": "Pending alumni item not found."}, status=404)


@csrf_exempt
def admin_reject_alumni_submission_api(request, item_id):
    denied = admin_required_response(request)
    if denied:
        return denied

    if request.method != 'POST':
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    try:
        pending = PendingAlumniSubmission.objects.get(id=item_id, status='pending')
        pending.status = 'rejected'
        pending.save()
        return JsonResponse({"message": "Alumni submission rejected."})
    except PendingAlumniSubmission.DoesNotExist:
        return JsonResponse({"error": "Pending alumni item not found."}, status=404)

from django.contrib.auth.decorators import login_required


@csrf_exempt
def update_profile_api(request):
    if request.method != 'POST':
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    if not request.user.is_authenticated:
        return JsonResponse({"error": "Login required."}, status=401)

    try:
        profile = request.user.member_profile

        full_name = request.POST.get('full_name', profile.full_name).strip()
        student_id = request.POST.get('student_id', profile.student_id).strip()
        batch = request.POST.get('batch', profile.batch).strip()
        designation = request.POST.get('designation', profile.designation).strip()
        year_label = request.POST.get('year_label', profile.year_label).strip()
        details = request.POST.get('details', profile.details).strip()
        facebook_url = request.POST.get('facebook_url', profile.facebook_url or '').strip()
        linkedin_url = request.POST.get('linkedin_url', profile.linkedin_url or '').strip()

        if not is_valid_student_id(student_id):
            return JsonResponse({
                "error": "Student ID must be in this format: 123-115-456"
            }, status=400)

        if not is_valid_batch(batch):
            return JsonResponse({
                "error": "Batch must contain numbers only. Example: 58"
            }, status=400)

        existing_profile = MemberProfile.objects.filter(student_id=student_id).exclude(user=request.user).first()
        if existing_profile:
            return JsonResponse({
                "error": "Student ID already exists."
            }, status=400)

        profile.full_name = full_name
        profile.student_id = student_id
        profile.batch = batch
        profile.designation = designation
        profile.year_label = year_label
        profile.details = details
        profile.facebook_url = facebook_url
        profile.linkedin_url = linkedin_url

        image = request.FILES.get('image')
        if image:
            profile.image = image

        profile.save()

        return JsonResponse({
            "message": "Profile updated successfully.",
            "user": serialize_logged_user(request, request.user)
        }, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@csrf_exempt
def change_password_api(request):
    if request.method != 'POST':
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    if not request.user.is_authenticated:
        return JsonResponse({"error": "Login required."}, status=401)

    try:
        data = json.loads(request.body)

        current_password = data.get('current_password', '').strip()
        new_password = data.get('new_password', '').strip()
        confirm_password = data.get('confirm_password', '').strip()

        if not request.user.check_password(current_password):
            return JsonResponse({"error": "Current password is incorrect."}, status=400)

        if new_password != confirm_password:
            return JsonResponse({"error": "New password and confirm password do not match."}, status=400)

        if not is_valid_password(new_password):
            return JsonResponse({
                "error": "New password must be at least 6 characters and include 1 uppercase letter, 1 number, and 1 special character."
            }, status=400)

        request.user.set_password(new_password)
        request.user.save()

        login(request, request.user)

        return JsonResponse({"message": "Password changed successfully."}, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)