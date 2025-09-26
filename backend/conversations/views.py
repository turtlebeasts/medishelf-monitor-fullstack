# conversations/views.py
from django.contrib.auth import get_user_model
from rest_framework import viewsets, permissions, status
from rest_framework.exceptions import ValidationError, PermissionDenied
from rest_framework.response import Response
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer
from django.shortcuts import get_object_or_404

User = get_user_model()

class ConversationViewSet(viewsets.ModelViewSet):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Conversation.objects.filter(participants=self.request.user).order_by("-created")

    def create(self, request, *args, **kwargs):
        other_id = request.data.get("user")         # ⬅️ now expect "user", not "post"
        if not other_id:
            raise ValidationError({"user": "This field is required."})

        if str(other_id) == str(request.user.id):
            raise ValidationError({"user": "Cannot start a conversation with yourself."})

        try:
            other = User.objects.get(pk=other_id)
        except User.DoesNotExist:
            raise ValidationError({"user": "Invalid user id."})

        me = request.user
        convo = (Conversation.objects
                 .filter(participants=me)
                 .filter(participants=other)
                 .first())

        if not convo:
            convo = Conversation.objects.create()
            convo.participants.add(me, other)

        serializer = self.get_serializer(convo)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

# conversations/views.py

class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Message.objects.filter(conversation__participants=self.request.user)
        convo_id = self.request.query_params.get("conversation")
        if convo_id:
            qs = qs.filter(conversation_id=convo_id)
        return qs.select_related("sender", "conversation").order_by("timestamp")

    def perform_create(self, serializer):
        convo_id = self.request.data.get("conversation")
        if not convo_id:
            raise ValidationError({"conversation": "This field is required."})

        convo = get_object_or_404(Conversation, pk=convo_id)
        if not convo.participants.filter(id=self.request.user.id).exists():
            raise PermissionDenied("Not a participant.")

        serializer.save(sender=self.request.user, conversation=convo)
