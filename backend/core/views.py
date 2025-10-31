"""
Views da API REST com Django REST Framework.
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.db.models import Q
from collections import Counter

from .models import Product
from .serializers import (
    ProductSerializer,
    CategoryStructureSerializer,
    UserSerializer,
    UserUpdateSerializer,
    ChangePasswordSerializer,
)


class ProductViewSet(viewsets.ModelViewSet):
    """
    ViewSet para CRUD completo de produtos.
    
    Endpoints:
    - GET /api/products/ - listar produtos (com paginação e filtros)
    - POST /api/products/ - criar produto
    - GET /api/products/{id}/ - detalhe de um produto
    - PUT /api/products/{id}/ - atualizar produto
    - DELETE /api/products/{id}/ - deletar produto
    
    Filtros suportados:
    - q: busca por nome ou código
    - category: filtrar por categoria
    - subcategory: filtrar por subcategoria
    - ordering: ordenar por campo (ex: -created_at, price)
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ['name', 'code']
    ordering_fields = ['created_at', 'price', 'name', 'stock']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """
        Filtros customizados via query params.
        """
        queryset = super().get_queryset()
        
        # Filtro de busca por nome ou código
        q = self.request.query_params.get('q', None)
        if q:
            queryset = queryset.filter(
                Q(name__icontains=q) | Q(code__icontains=q)
            )
        
        # Filtro por categoria
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        
        # Filtro por subcategoria
        subcategory = self.request.query_params.get('subcategory', None)
        if subcategory:
            queryset = queryset.filter(subcategory=subcategory)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def by_category(self, request):
        """
        Endpoint extra: agregar produtos por categoria.
        GET /api/products/by_category/
        """
        products = self.get_queryset()
        category_counter = Counter(products.values_list('category', flat=True))
        
        data = [
            {
                'category': cat,
                'category_display': dict(Product.CATEGORIES).get(cat, cat),
                'count': count
            }
            for cat, count in category_counter.items()
        ]
        
        return Response(data)


class CategoryListAPIView(APIView):
    """
    Endpoint para estrutura de categorias (filtro cascata).
    
    GET /api/categories/
    Retorna estrutura hierárquica: Categoria → Subcategorias → Itens
    """
    permission_classes = [AllowAny]  # Público para facilitar uso
    
    def get(self, request):
        # Obter categorias únicas
        categories = Product.objects.values_list('category', flat=True).distinct()
        
        # Construir estrutura hierárquica
        category_data = []
        for cat in categories:
            # Obter subcategorias desta categoria
            subcategories = Product.objects.filter(
                category=cat
            ).values_list('subcategory', flat=True).distinct()
            
            # Obter produtos por subcategoria
            subcat_data = []
            for subcat in subcategories:
                if subcat:  # Ignorar vazios
                    products = Product.objects.filter(
                        category=cat,
                        subcategory=subcat
                    ).values_list('name', flat=True)
                    
                    subcat_data.append({
                        'name': subcat,
                        'items': list(products)
                    })
            
            category_data.append({
                'name': cat,
                'display_name': dict(Product.CATEGORIES).get(cat, cat),
                'subcategories': subcat_data
            })
        
        return Response({'categories': category_data})


class UserProfileAPIView(APIView):
    """
    Endpoint para gerenciar perfil do usuário autenticado.
    
    GET /api/auth/me/ - retorna dados do usuário
    PUT /api/auth/me/ - atualiza perfil
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
    def put(self, request):
        serializer = UserUpdateSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            # Retornar dados completos do usuário
            user_serializer = UserSerializer(request.user)
            return Response(user_serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_api(request):
    """
    Endpoint de login que retorna JWT tokens.
    
    POST /api/auth/login/
    Body: { "username": "...", "password": "..." }
    Response: { "access": "...", "refresh": "...", "user": {...} }
    """
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response(
            {'error': 'Username e password são obrigatórios'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = authenticate(username=username, password=password)
    
    if user is None:
        return Response(
            {'error': 'Credenciais inválidas'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    # Gerar tokens JWT
    refresh = RefreshToken.for_user(user)
    
    # Retornar tokens + dados do usuário
    user_serializer = UserSerializer(user)
    
    return Response({
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'user': user_serializer.data
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_api(request):
    """
    Endpoint de logout (invalida refresh token).
    
    POST /api/auth/logout/
    Body: { "refresh": "..." }
    """
    try:
        refresh_token = request.data.get('refresh')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        return Response({'message': 'Logout realizado com sucesso'})
    except Exception:
        return Response(
            {'error': 'Token inválido'},
            status=status.HTTP_400_BAD_REQUEST
        )


class ChangePasswordAPIView(APIView):
    """
    Endpoint para alterar a senha do usuário autenticado.
    
    POST /api/auth/change-password/
    Body: {
        "old_password": "...",
        "new_password": "...",
        "new_password_confirm": "..."
    }
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        user = request.user
        old_password = serializer.validated_data['old_password']
        new_password = serializer.validated_data['new_password']
        
        # Verificar se a senha antiga está correta
        if not user.check_password(old_password):
            return Response(
                {'old_password': 'Senha atual incorreta.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validar a nova senha (complexidade)
        try:
            validate_password(new_password, user)
        except Exception as e:
            return Response(
                {'new_password': list(e.messages)},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Alterar a senha
        user.set_password(new_password)
        user.save()
        
        return Response({'message': 'Senha alterada com sucesso.'}, status=status.HTTP_200_OK)
