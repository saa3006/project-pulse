from django.contrib import admin
from .models import project, task

admin.site.register(project)
admin.site.register(task)