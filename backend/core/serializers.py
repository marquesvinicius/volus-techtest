"""
Serializers para a API REST.
"""
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    """
    Serializer completo para o modelo Product.
    """
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'code',
            'price',
            'category',
            'category_display',
            'subcategory',
            'stock',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def validate(self, data):
        """
        Validação adicional do serializer.
        """
        # Chama o clean() do model para validar checksum, price, stock
        instance = Product(**data)
        instance.clean()
        return data


class CategoryStructureSerializer(serializers.Serializer):
    """
    Serializer para estrutura de categorias (filtro cascata).
    Não usa model, apenas estrutura de dados.
    """
    name = serializers.CharField()
    display_name = serializers.CharField()
    subcategories = serializers.ListField(
        child=serializers.DictField()
    )


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer para perfil de usuário.
    """
    full_name = serializers.SerializerMethodField()
    is_admin = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'full_name',
            'is_admin',
            'is_active',
            'date_joined',
        ]
        read_only_fields = ['id', 'username', 'date_joined', 'is_active']
    
    def get_full_name(self, obj):
        """
        Retorna nome completo do usuário.
        """
        if obj.first_name and obj.last_name:
            return f"{obj.first_name} {obj.last_name}"
        return obj.username
    
    def get_is_admin(self, obj):
        """
        Verifica se usuário é administrador.
        """
        return obj.is_superuser or obj.is_staff


class UserUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer para atualização de perfil (campos editáveis).
    """
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email']


class ChangePasswordSerializer(serializers.Serializer):
    """
    Serializer para alteração de senha.
    """
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True, min_length=8)
    new_password_confirm = serializers.CharField(required=True, write_only=True)
    
    def validate(self, attrs):
        """
        Valida se as novas senhas coincidem.
        """
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError({
                'new_password_confirm': 'As senhas não coincidem.'
            })
        return attrs