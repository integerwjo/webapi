from django.urls import path
from chat.views import me

urlpatterns = [
    path('me/', me),
]
