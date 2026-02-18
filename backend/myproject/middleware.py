from rest_framework_simplejwt.authentication import JWTAuthentication
from django.core.exceptions import PermissionDenied
from rest_framework import exceptions

class SingleSessionMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # We handle this in a custom backend or decorator for DRF
        # because middleware runs before DRF authentication.
        return self.get_response(request)

class SecureJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        auth_result = super().authenticate(request)
        if auth_result is None:
            return None
        
        user, token = auth_result
        
        # Concurrent Session Control: Check if token JTI matches stored JTI
        if user.current_token_jti and token['jti'] != user.current_token_jti:
            raise exceptions.AuthenticationFailed("New login detected. This session is invalidated.")
        
        return user, token
