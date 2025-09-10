from django.db.models import Q
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, ValidationError
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer
from medicines.models import MedicinePost

class ConversationViewSet(viewsets.ModelViewSet):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Conversation.objects.filter(participants=self.request.user).order_by("-created")

    def create(self, request, *args, **kwargs):
        post_id = request.data.get("post")
        if not post_id:
            raise ValidationError({"post": "This field is required."})

        try:
            post = MedicinePost.objects.get(pk=post_id)
        except MedicinePost.DoesNotExist:
            raise ValidationError({"post": "Invalid post id."})

        user = request.user
        other = post.author

        # Try to find existing convo between these two users for this post
        convo = Conversation.objects.filter(post=post, participants=user).filter(participants=other).first()

        if not convo:
            convo = Conversation.objects.create(post=post)
            convo.participants.add(user, other)

        serializer = self.get_serializer(convo)
        return Response(serializer.data, status=status.HTTP_201_CREATED)




class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Message.objects.filter(conversation__participants=self.request.user).order_by("timestamp")

    def perform_create(self, serializer):
        convo_id = self.request.data.get("conversation")
        if not convo_id:
            raise ValidationError({"conversation": "This field is required."})

        try:
            convo = Conversation.objects.get(pk=convo_id)
        except Conversation.DoesNotExist:
            raise ValidationError({"conversation": "Invalid conversation id."})

        if not convo.participants.filter(id=self.request.user.id).exists():
            raise PermissionDenied("Not a participant.")

        serializer.save(sender=self.request.user, conversation=convo)
