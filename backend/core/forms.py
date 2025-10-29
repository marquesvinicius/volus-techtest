"""
Formulários com validações personalizadas.
"""
from django import forms
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from .models import Product


class ProductForm(forms.ModelForm):
    """
    Formulário de Product com validações personalizadas.
    
    Validações não óbvias:
    - Checksum do código (soma dígitos % 3 == 0)
    - Preço > 0
    - Estoque >= 0
    """
    
    class Meta:
        model = Product
        fields = ['name', 'code', 'category', 'subcategory', 'price', 'stock']
        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Nome do produto'
            }),
            'code': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'ABC-123',
                'maxlength': '10'
            }),
            'category': forms.Select(attrs={
                'class': 'form-control'
            }),
            'subcategory': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Subcategoria'
            }),
            'price': forms.NumberInput(attrs={
                'class': 'form-control',
                'step': '0.01',
                'min': '0.01'
            }),
            'stock': forms.NumberInput(attrs={
                'class': 'form-control',
                'min': '0'
            }),
        }
    
    def clean_code(self):
        """
        Validação checksum do código.
        Regra não óbvia: soma dos dígitos % 3 == 0
        """
        code = self.cleaned_data.get('code')
        if not code:
            raise ValidationError('O código é obrigatório.')
        
        # Validação do checksum
        digits = [int(c) for c in code if c.isdigit()]
        if not digits:
            raise ValidationError('O código deve conter pelo menos um dígito.')
        
        if sum(digits) % 3 != 0:
            raise ValidationError(
                f'Código inválido (checksum incorreto). '
                f'A soma dos dígitos deve ser divisível por 3. '
                f'Soma atual: {sum(digits)}'
            )
        
        return code
    
    def clean_price(self):
        """
        Validação de preço positivo.
        """
        price = self.cleaned_data.get('price')
        if price is not None and price <= 0:
            raise ValidationError('O preço deve ser maior que zero.')
        return price
    
    def clean_stock(self):
        """
        Validação de estoque não negativo.
        """
        stock = self.cleaned_data.get('stock')
        if stock is not None and stock < 0:
            raise ValidationError('O estoque não pode ser negativo.')
        return stock


class ProfileForm(forms.ModelForm):
    """
    Formulário para edição de perfil de usuário.
    """
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email']
        widgets = {
            'first_name': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Nome'
            }),
            'last_name': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Sobrenome'
            }),
            'email': forms.EmailInput(attrs={
                'class': 'form-control',
                'placeholder': 'email@example.com'
            }),
        }
    
    def clean_email(self):
        """
        Validar email único (exceto para o próprio usuário).
        """
        email = self.cleaned_data.get('email')
        if email:
            # Verificar se existe outro usuário com este email
            existing = User.objects.filter(email=email).exclude(pk=self.instance.pk)
            if existing.exists():
                raise ValidationError('Este email já está em uso por outro usuário.')
        return email
