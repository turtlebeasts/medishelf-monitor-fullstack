from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from users.views import RegisterView
from medicines.views import MedicinePostViewSet
from conversations.views import ConversationViewSet, MessageViewSet
from ai.views import GenerateInstructionsView

router=DefaultRouter()
router.register(r"posts", MedicinePostViewSet, basename="posts")
router.register(r"conversations", ConversationViewSet, basename="conversations")
router.register(r"messages", MessageViewSet, basename="messages")

urlpatterns=[
  path("admin/", admin.site.urls),
  path("api/", include(router.urls)),
  path("api/auth/register/", RegisterView.as_view()),
  path("api/auth/token/", TokenObtainPairView.as_view()),
  path("api/auth/token/refresh/", TokenRefreshView.as_view()),
  path("api/posts/<int:post_id>/instructions/", GenerateInstructionsView.as_view()),
]
