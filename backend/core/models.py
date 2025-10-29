"""
Models do sistema - Produtos com validações personalizadas.
"""
from django.db import models
from django.core.exceptions import ValidationError


class Product(models.Model):
    """
    Modelo de Produto com validações personalizadas.
    
    O campo 'code' segue o padrão ABC-123 e possui validação checksum:
    a soma dos dígitos % 3 deve ser == 0 para ser válido (regra não óbvia).
    """
    
    CATEGORIES = [
        ('eletronicos', 'Eletrônicos'),
        ('livros', 'Livros'),
        ('moveis', 'Móveis'),
        ('roupas', 'Roupas'),
        ('alimentos', 'Alimentos'),
    ]
    
    name = models.CharField('Nome', max_length=200)
    code = models.CharField('Código', max_length=10, unique=True, 
                           help_text='Formato: ABC-123 (checksum: soma dígitos % 3 == 0)')
    price = models.DecimalField('Preço', max_digits=10, decimal_places=2)
    category = models.CharField('Categoria', max_length=100, choices=CATEGORIES)
    subcategory = models.CharField('Subcategoria', max_length=100, blank=True)
    stock = models.IntegerField('Estoque', default=0)
    created_at = models.DateTimeField('Criado em', auto_now_add=True)
    updated_at = models.DateTimeField('Atualizado em', auto_now=True)
    
    class Meta:
        verbose_name = 'Produto'
        verbose_name_plural = 'Produtos'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.code} - {self.name}"
    
    def clean(self):
        """
        Validações personalizadas do modelo.
        """
        super().clean()
        
        # Validação de preço > 0
        if self.price is not None and self.price <= 0:
            raise ValidationError({'price': 'O preço deve ser maior que zero.'})
        
        # Validação de estoque >= 0
        if self.stock < 0:
            raise ValidationError({'stock': 'O estoque não pode ser negativo.'})
        
        # Validação checksum do código
        if self.code:
            self._validate_code_checksum()
    
    def _validate_code_checksum(self):
        """
        Valida o checksum do código do produto.
        
        Regra não óbvia: soma dos dígitos % 3 == 0
        Exemplos válidos: ABC-120 (1+2+0=3, 3%3=0), XYZ-213 (2+1+3=6, 6%3=0)
        Exemplos inválidos: ABC-121 (1+2+1=4, 4%3=1), XYZ-100 (1+0+0=1, 1%3=1)
        """
        digits = [int(c) for c in self.code if c.isdigit()]
        if digits and sum(digits) % 3 != 0:
            raise ValidationError({
                'code': f'Código inválido (checksum incorreto). '
                       f'A soma dos dígitos deve ser divisível por 3. '
                       f'Soma atual: {sum(digits)}'
            })
