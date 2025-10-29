"""
URLs do app core.
"""
from django.urls import path
from . import views

urlpatterns = [
    # Autenticação
    path('login/', views.CustomLoginView.as_view(), name='login'),
    path('logout/', views.logout_view, name='logout'),
    
    # Perfil de usuário
    path('profile/', views.profile_edit, name='profile_edit'),
    
    # Produtos
    path('', views.products_list, name='products_list'),
    path('products/', views.products_list, name='products_list'),
    path('products/<int:pk>/', views.product_detail, name='product_detail'),
    
    # API JSON
    path('api/products/', views.api_products, name='api_products'),
    path('api/categories/', views.api_categories, name='api_categories'),
]

