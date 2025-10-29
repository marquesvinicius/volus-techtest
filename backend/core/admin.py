"""
Configuração do Django Admin para o app core.
"""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    """
    Admin customizado para Product com filtros e buscas.
    """
    list_display = ('code', 'name', 'category', 'subcategory', 'price', 'stock', 'created_at')
    list_filter = ('category', 'subcategory', 'created_at')
    search_fields = ('name', 'code', 'category', 'subcategory')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Informações Básicas', {
            'fields': ('name', 'code')
        }),
        ('Classificação', {
            'fields': ('category', 'subcategory')
        }),
        ('Precificação e Estoque', {
            'fields': ('price', 'stock')
        }),
        ('Metadados', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


# User já está registrado por padrão, mas podemos customizar se necessário
# admin.site.unregister(User)
# admin.site.register(User, BaseUserAdmin)

