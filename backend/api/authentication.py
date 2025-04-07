from rest_framework.authentication import BaseAuthentication
from rest_framework import exceptions
from django.contrib.auth.models import User
from firebase_admin import auth as firebase_auth
from .models import UserProfile

class FirebaseAuthentication(BaseAuthentication):
    def authenticate(self, request):
        # Retrieve the Firebase token from the request (Authorization header or wherever it might be)
        id_token = self._get_token_from_request(request)
        print(id_token)
        if not id_token:
            return None  # No token, so no authentication

        # Verify the token
        try:
            decoded_token = firebase_auth.verify_id_token(id_token)
        except Exception:
            raise exceptions.AuthenticationFailed("Invalid Firebase token.")

        # Find or create the Django user
        uid = decoded_token["uid"]
        email = decoded_token.get("email", "")
        display_name = decoded_token.get("name") or email.split("@")[0] or "Unknown"

        user, created = User.objects.get_or_create(username=uid, defaults={"email": email, "first_name": display_name})
        if not created:
            # Optionally update email or name if needed
            pass

        # Ensure a UserProfile exists
        UserProfile.objects.get_or_create(user=user, defaults={"profile_name": display_name, "email": email})

        # Return (user, None) to indicate successful auth
        return (user, None)

    def _get_token_from_request(self, request):
        # Example: If you have a Bearer token in Authorization header
        auth_header = request.META.get("HTTP_AUTHORIZATION", "")
        if auth_header.startswith("Bearer "):
            return auth_header.split(" ")[1]
        return None
