from rest_framework import serializers
from .models import Conversation, Message
from users.serializers import UserPublicSerializer  # assuming you have this

class MessageSerializer(serializers.ModelSerializer):
    sender = UserPublicSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ["id", "conversation", "sender", "text", "timestamp"]


class ConversationSerializer(serializers.ModelSerializer):
    participants = UserPublicSerializer(many=True, read_only=True)
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Conversation
        fields = ["id", "post", "participants", "created", "messages"]
        read_only_fields = ["created"]
