# conversations/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Conversation, Message

User = get_user_model()

class UserMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email")

class ConversationSerializer(serializers.ModelSerializer):
    participants = UserMiniSerializer(many=True, read_only=True)

    class Meta:
        model = Conversation
        fields = ("id", "participants", "created")

class MessageSerializer(serializers.ModelSerializer):
    sender = UserMiniSerializer(read_only=True)
    class Meta:
        model = Message
        fields = ("id", "conversation", "sender", "text", "timestamp")
