"""
URLs da API REST.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

# Router para ViewSets (CRUD automático)
router = DefaultRouter()
router.register(r'products', views.ProductViewSet, basename='product')

urlpatterns = [
    # Autenticação JWT
    path('api/auth/login/', views.login_api, name='api_login'),
    path('api/auth/logout/', views.logout_api, name='api_logout'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/me/', views.UserProfileAPIView.as_view(), name='user_profile'),
    
    # Categorias (filtro cascata)
    path('api/categories/', views.CategoryListAPIView.as_view(), name='api_categories'),
    
    # Produtos (ViewSet com router)
    path('api/', include(router.urls)),
]
