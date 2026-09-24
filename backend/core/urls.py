from django.urls import path
from .views import (
    home_api,
    events_api,
    event_detail_api,
    notices_api,
    notice_detail_api,
    committee_api,
    committee_years_api,
    alumni_api,
    blogs_api,
    blog_detail_api,
    contact_api,
    register_api,
    login_api,
    logout_api,
    current_user_api,

    admin_dashboard_api,
    admin_users_api,

    admin_create_event_api,
    admin_update_event_api,
    admin_delete_event_api,

    admin_create_notice_api,
    admin_update_notice_api,
    admin_delete_notice_api,

    admin_create_blog_api,
    admin_update_blog_api,
    admin_delete_blog_api,

    admin_create_alumni_api,
    admin_update_alumni_api,
    admin_delete_alumni_api,

    admin_create_committee_year_api,
    admin_delete_committee_year_api,

    admin_create_committee_member_api,
    admin_update_committee_member_api,
    admin_delete_committee_member_api,

    submit_event_api,
    submit_notice_api,
    submit_blog_api,
    submit_alumni_api,

    admin_pending_submissions_api,

    admin_approve_event_submission_api,
    admin_reject_event_submission_api,

    admin_approve_notice_submission_api,
    admin_reject_notice_submission_api,

    admin_approve_blog_submission_api,
    admin_reject_blog_submission_api,

    admin_approve_alumni_submission_api,
    admin_reject_alumni_submission_api,

    update_profile_api,
    change_password_api,

    alumni_detail_api,
    committee_member_detail_api,
)

urlpatterns = [
    path('home/', home_api, name='home_api'),
    path('events/', events_api, name='events_api'),
    path('events/<int:item_id>/', event_detail_api, name='event_detail_api'),
    path('notices/', notices_api, name='notices_api'),
    path('notices/<int:item_id>/', notice_detail_api, name='notice_detail_api'),
    path('committee/', committee_api, name='committee_api'),
    path('committee-years/', committee_years_api, name='committee_years_api'),
    path('alumni/', alumni_api, name='alumni_api'),
    path('blogs/', blogs_api, name='blogs_api'),
    path('blogs/<int:item_id>/', blog_detail_api, name='blog_detail_api'),
    path('contact/', contact_api, name='contact_api'),

    path('auth/register/', register_api, name='register_api'),
    path('auth/login/', login_api, name='login_api'),
    path('auth/logout/', logout_api, name='logout_api'),
    path('auth/me/', current_user_api, name='current_user_api'),

    path('admin/dashboard/', admin_dashboard_api, name='admin_dashboard_api'),
    path('admin/users/', admin_users_api, name='admin_users_api'),

    path('admin/events/create/', admin_create_event_api, name='admin_create_event_api'),
    path('admin/events/<int:item_id>/update/', admin_update_event_api, name='admin_update_event_api'),
    path('admin/events/<int:item_id>/delete/', admin_delete_event_api, name='admin_delete_event_api'),

    path('admin/notices/create/', admin_create_notice_api, name='admin_create_notice_api'),
    path('admin/notices/<int:item_id>/update/', admin_update_notice_api, name='admin_update_notice_api'),
    path('admin/notices/<int:item_id>/delete/', admin_delete_notice_api, name='admin_delete_notice_api'),

    path('admin/blogs/create/', admin_create_blog_api, name='admin_create_blog_api'),
    path('admin/blogs/<int:item_id>/update/', admin_update_blog_api, name='admin_update_blog_api'),
    path('admin/blogs/<int:item_id>/delete/', admin_delete_blog_api, name='admin_delete_blog_api'),

    path('admin/alumni/create/', admin_create_alumni_api, name='admin_create_alumni_api'),
    path('admin/alumni/<int:item_id>/update/', admin_update_alumni_api, name='admin_update_alumni_api'),
    path('admin/alumni/<int:item_id>/delete/', admin_delete_alumni_api, name='admin_delete_alumni_api'),

    path('admin/committee-years/create/', admin_create_committee_year_api, name='admin_create_committee_year_api'),
    path('admin/committee-years/<int:item_id>/delete/', admin_delete_committee_year_api, name='admin_delete_committee_year_api'),

    path('admin/committee-members/create/', admin_create_committee_member_api, name='admin_create_committee_member_api'),
    path('admin/committee-members/<int:item_id>/update/', admin_update_committee_member_api, name='admin_update_committee_member_api'),
    path('admin/committee-members/<int:item_id>/delete/', admin_delete_committee_member_api, name='admin_delete_committee_member_api'),

    path('submit/event/', submit_event_api, name='submit_event_api'),
    path('submit/notice/', submit_notice_api, name='submit_notice_api'),
    path('submit/blog/', submit_blog_api, name='submit_blog_api'),
    path('submit/alumni/', submit_alumni_api, name='submit_alumni_api'),

    path('alumni/<int:pk>/', alumni_detail_api, name='alumni_detail_api'),
    path('committee/<int:pk>/', committee_member_detail_api, name='committee_member_detail_api'),

    path('admin/pending-submissions/', admin_pending_submissions_api, name='admin_pending_submissions_api'),

    path('admin/pending-submissions/events/<int:item_id>/approve/', admin_approve_event_submission_api, name='admin_approve_event_submission_api'),
    path('admin/pending-submissions/events/<int:item_id>/reject/', admin_reject_event_submission_api, name='admin_reject_event_submission_api'),

    path('admin/pending-submissions/notices/<int:item_id>/approve/', admin_approve_notice_submission_api, name='admin_approve_notice_submission_api'),
    path('admin/pending-submissions/notices/<int:item_id>/reject/', admin_reject_notice_submission_api, name='admin_reject_notice_submission_api'),

    path('admin/pending-submissions/blogs/<int:item_id>/approve/', admin_approve_blog_submission_api, name='admin_approve_blog_submission_api'),
    path('admin/pending-submissions/blogs/<int:item_id>/reject/', admin_reject_blog_submission_api, name='admin_reject_blog_submission_api'),

    path('admin/pending-submissions/alumni/<int:item_id>/approve/', admin_approve_alumni_submission_api, name='admin_approve_alumni_submission_api'),
    path('admin/pending-submissions/alumni/<int:item_id>/reject/', admin_reject_alumni_submission_api, name='admin_reject_alumni_submission_api'),

    path('auth/update-profile/', update_profile_api, name='update_profile_api'),
    path('auth/change-password/', change_password_api, name='change_password_api'),
]