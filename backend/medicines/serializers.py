from rest_framework import serializers
from .models import MedicinePost
from users.serializers import UserPublicSerializer

class MedicinePostSerializer(serializers.ModelSerializer):
    author = UserPublicSerializer(read_only=True)
    class Meta: model = MedicinePost; fields = "__all__"; read_only_fields = ["author","created","instructions"]
