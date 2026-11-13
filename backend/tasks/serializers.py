from rest_framework import serializers
from .models import project, task
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = project
        fields = '__all__'

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = task
        fields = '__all__'