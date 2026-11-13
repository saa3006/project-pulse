from django.shortcuts import render
from rest_framework import viewsets
from .models import project, task
from .serializers import ProjectSerializer, TaskSerializer
# Create your views here.

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = project.objects.all()
    serializer_class = ProjectSerializer

class TaskViewSet(viewsets.ModelViewSet):
    queryset = task.objects.all()
    serializer_class = TaskSerializer
