from django.db import models; from django.contrib.auth.models import User
from medicines.models import MedicinePost

class Conversation(models.Model):
    post = models.ForeignKey(MedicinePost, on_delete=models.CASCADE, related_name="conversations")
    participants = models.ManyToManyField(User, related_name="conversations")
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Conversation on {self.post.name}"

class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="messages")
    text = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender.username}: {self.text[:20]}"
