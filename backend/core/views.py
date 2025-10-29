"""
Views para autenticação, CRUD e API.
"""
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import LoginView as DjangoLoginView
from django.contrib import messages
from django.core.paginator import Paginator
from django.http import JsonResponse
from django.db.models import Q
from decimal import Decimal

from .models import Product
from .forms import ProductForm, ProfileForm


class CustomLoginView(DjangoLoginView):
    """
    View de login customizada.
    """
    template_name = 'login.html'
    redirect_authenticated_user = True


def logout_view(request):
    """
    View de logout.
    """
    logout(request)
    messages.success(request, 'Logout realizado com sucesso!')
    return redirect('login')


@login_required
def profile_edit(request):
    """
    View para edição de perfil do usuário (demonstra CRUD fora do admin).
    """
    if request.method == 'POST':
        form = ProfileForm(request.POST, instance=request.user)
        if form.is_valid():
            form.save()
            messages.success(request, 'Perfil atualizado com sucesso!')
            return redirect('profile_edit')
    else:
        form = ProfileForm(instance=request.user)
    
    return render(request, 'profile_edit.html', {'form': form})


@login_required
def products_list(request):
    """
    Lista paginada de produtos com filtros.
    
    Filtros suportados:
    - q: busca por nome
    - category: filtro por categoria
    - min_price: preço mínimo
    - max_price: preço máximo
    """
    products = Product.objects.all()
    
    # Filtro de busca por nome
    q = request.GET.get('q', '').strip()
    if q:
        products = products.filter(
            Q(name__icontains=q) | Q(code__icontains=q)
        )
    
    # Filtro por categoria
    category = request.GET.get('category', '').strip()
    if category:
        products = products.filter(category=category)
    
    # Filtro por subcategoria
    subcategory = request.GET.get('subcategory', '').strip()
    if subcategory:
        products = products.filter(subcategory=subcategory)
    
    # Filtro por faixa de preço
    min_price = request.GET.get('min_price', '').strip()
    if min_price:
        try:
            products = products.filter(price__gte=Decimal(min_price))
        except:
            pass
    
    max_price = request.GET.get('max_price', '').strip()
    if max_price:
        try:
            products = products.filter(price__lte=Decimal(max_price))
        except:
            pass
    
    # Paginação (10 itens por página)
    paginator = Paginator(products, 10)
    page_number = request.GET.get('page', 1)
    page_obj = paginator.get_page(page_number)
    
    context = {
        'page_obj': page_obj,
        'products': page_obj.object_list,
        'filters': {
            'q': q,
            'category': category,
            'subcategory': subcategory,
            'min_price': min_price,
            'max_price': max_price,
        },
        'categories': Product.CATEGORIES,
    }
    
    return render(request, 'products_list.html', context)


@login_required
def product_detail(request, pk):
    """
    Detalhe de um produto.
    """
    product = get_object_or_404(Product, pk=pk)
    return render(request, 'product_detail.html', {'product': product})


@login_required
def api_products(request):
    """
    Endpoint JSON para produtos (usado pelo frontend).
    
    Suporta os mesmos filtros da listagem:
    - category: filtro por categoria
    - subcategory: filtro por subcategoria
    - q: busca por nome/código
    """
    products = Product.objects.all()
    
    # Aplicar filtros
    category = request.GET.get('category', '').strip()
    if category:
        products = products.filter(category=category)
    
    subcategory = request.GET.get('subcategory', '').strip()
    if subcategory:
        products = products.filter(subcategory=subcategory)
    
    q = request.GET.get('q', '').strip()
    if q:
        products = products.filter(
            Q(name__icontains=q) | Q(code__icontains=q)
        )
    
    # Serializar para JSON
    data = {
        'products': [
            {
                'id': p.id,
                'name': p.name,
                'code': p.code,
                'price': str(p.price),
                'category': p.category,
                'subcategory': p.subcategory,
                'stock': p.stock,
                'created_at': p.created_at.isoformat(),
            }
            for p in products
        ],
        'count': products.count()
    }
    
    return JsonResponse(data)


def api_categories(request):
    """
    Endpoint JSON para estrutura de categorias (usado pelo filtro cascata).
    """
    # Obter categorias únicas
    categories = Product.objects.values_list('category', flat=True).distinct()
    
    # Obter subcategorias por categoria
    category_data = []
    for cat in categories:
        subcategories = Product.objects.filter(
            category=cat
        ).values_list('subcategory', flat=True).distinct()
        
        # Obter nomes de produtos por subcategoria
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
    
    return JsonResponse({'categories': category_data})

