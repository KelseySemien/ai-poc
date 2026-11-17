from django.contrib import admin
from django.urls import path
from api.views import ask_ai

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/ask/', ask_ai),
]