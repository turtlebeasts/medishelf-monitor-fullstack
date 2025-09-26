from rest_framework import viewsets, permissions, status
from .models import MedicinePost
from .serializers import MedicinePostSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
import openai, os
from google import genai
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


    @action(detail=True, methods=["get"], permission_classes=[permissions.IsAuthenticated])
    def instructions(self, request, pk=None):
        post = self.get_object()

        # Non-medical, safety-friendly prompt
        prompt = (
            f"Write 2–3 short, high-level, non-medical tips for safely handling a product named "
            f"“{post.name}”. No dosage/treatment advice. Focus on label reading, storage, expiry checks. "
            f"If it seems fictional, say it looks like a sample product and add a playful generic note. "
            f"End with: 'This is general information, not medical advice.'"
        )

        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            return Response({"error": "GEMINI_API_KEY not set"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        try:
            client = genai.Client(api_key=api_key)
            resp = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
            )
            text = (resp.text or "").strip()
            if not text:
                return Response({"error": "empty_text", "raw": getattr(resp, "to_dict", lambda: {})()}, status=502)
            return Response({"instructions": text})
        except Exception as e:
            # Surfaces safety/quota/billing/model errors in one place
            return Response({"error": "genai_error", "detail": str(e)}, status=502)