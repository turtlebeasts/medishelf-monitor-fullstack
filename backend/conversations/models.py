# conversations/models.py
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Conversation(models.Model):
    participants = models.ManyToManyField(User, related_name="conversations")
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        names = ", ".join(self.participants.values_list("username", flat=True))
        return f"Conversation between {names}"

class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="messages")
    text = models.TextField()  # your view uses "content"—either change frontend to send "text", or rename this field.
    timestamp = models.DateTimeField(auto_now_add=True)
