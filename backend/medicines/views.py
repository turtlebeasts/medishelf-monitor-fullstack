from rest_framework import viewsets, permissions
from .models import MedicinePost
from .serializers import MedicinePostSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
import openai, os
import requests

class MedicinePostViewSet(viewsets.ModelViewSet):
    queryset = MedicinePost.objects.all().order_by("-created")
    serializer_class = MedicinePostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    search_fields = ["name", "description"]
    filterset_fields = ["expiry_date", "author"]
    ordering_fields = ["created", "price", "expiry_date"]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    # 👇 New endpoint: /api/posts/mine/
    @action(detail=False, methods=["get"], permission_classes=[permissions.IsAuthenticated])
    def mine(self, request):
        posts = MedicinePost.objects.filter(author=request.user).order_by("-created")
        serializer = self.get_serializer(posts, many=True)
        return Response(serializer.data)

        # 👇 New endpoint: /api/posts/<id>/instructions/
    @action(detail=True, methods=["get"], permission_classes=[permissions.IsAuthenticated])
    def instructions(self, request, pk=None):
        post = self.get_object()
        prompt = f"Provide clear and safe usage instructions for the medicine '{post.name}', just 2 to 3 points is enough. If there's no medicine with that name, then just say that 'that looks like a sample medicine' and write a sample description that looks funny."

        try:
            api_key = os.getenv("GEMINI_API_KEY")
            if not api_key:
                return Response({"error": "Gemini API key not set"}, status=500)

            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
            resp = requests.post(url, json={"contents": [{"parts": [{"text": prompt}]}]})
            data = resp.json()

            if "candidates" in data and len(data["candidates"]) > 0:
                text = data["candidates"][0]["content"]["parts"][0]["text"]
                return Response({"instructions": text})
            else:
                return Response({"error": "No response from Gemini", "raw": data}, status=500)

        except Exception as e:
            print("Gemini error:", e)
            return Response({"error": str(e)}, status=500)

