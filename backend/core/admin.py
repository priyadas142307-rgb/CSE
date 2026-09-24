from django.contrib import admin
from .models import Event, Notice, CommitteeMember, Alumni, Blog, ContactMessage, CommitteeAcademicYear, MemberProfile, PendingEventSubmission,PendingNoticeSubmission,PendingBlogSubmission,PendingAlumniSubmission


admin.site.register(PendingEventSubmission)
admin.site.register(PendingNoticeSubmission)
admin.site.register(PendingBlogSubmission)
admin.site.register(PendingAlumniSubmission)
admin.site.register(Event)
admin.site.register(Notice)

@admin.register(CommitteeAcademicYear)
class CommitteeAcademicYearAdmin(admin.ModelAdmin):
    list_display = ('year_label', 'sort_order')
    search_fields = ('year_label',)
    ordering = ('-sort_order', '-id')


@admin.register(CommitteeMember)
class CommitteeMemberAdmin(admin.ModelAdmin):
    list_display = ('name', 'title', 'academic_year', 'display_order')
    list_filter = ('academic_year',)
    search_fields = ('name', 'title', 'academic_year__year_label')
    ordering = ('display_order', 'id')

admin.site.register(Alumni)
admin.site.register(Blog)
admin.site.register(ContactMessage)
admin.site.register(MemberProfile)