from rest_framework import serializers
from django.contrib.auth.models import User

class UserPublicSerializer(serializers.ModelSerializer):
    class Meta: model = User; fields = ["id","username","email"]

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email"),
            password=validated_data["password"]
        )
