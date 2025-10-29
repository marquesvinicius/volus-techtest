"""
Middleware personalizado para tratamento de exceções.
"""
import logging
from django.http import HttpResponse
from django.shortcuts import render
from django.conf import settings

logger = logging.getLogger(__name__)


class ExceptionHandlerMiddleware:
    """
    Middleware para capturar exceções não tratadas e exibir página amigável.
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        response = self.get_response(request)
        return response
    
    def process_exception(self, request, exception):
        """
        Captura exceções e renderiza página de erro amigável.
        """
        # Log do erro para debugging
        logger.error(
            f'Exceção capturada: {type(exception).__name__}: {str(exception)}',
            exc_info=True,
            extra={'request': request}
        )
        
        # Em produção, mostrar página amigável
        if not settings.DEBUG:
            return render(request, '500.html', {
                'error_message': 'Ocorreu um erro inesperado. Por favor, tente novamente.'
            }, status=500)
        
        # Em desenvolvimento, deixar Django mostrar o erro detalhado
        return None

