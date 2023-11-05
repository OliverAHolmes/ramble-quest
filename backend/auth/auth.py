import os
import requests
from cachetools import cached, TTLCache
from dotenv import load_dotenv
from auth.JWTBearer import JWKS

load_dotenv()  # Automatically load environment variables from a '.env' file.
cache = TTLCache(maxsize=1, ttl=21600)


@cached(cache)
def get_jwks():
    """Get JWKS data with caching."""
    response = requests.get(
        f"https://cognito-idp.{os.environ.get('REGION_NAME')}.amazonaws.com/"
        f"{os.environ.get('COGNITO_POOL_ID')}/.well-known/jwks.json",
        timeout=5,
    )
    return JWKS.parse_obj(response.json())


# auth = JWTBearer(get_jwks())


# async def get_current_user(
#     credentials: JWTAuthorizationCredentials = Depends(auth),
# ) -> str:
#     try:
#         return credentials.claims["username"]
#     except KeyError:
#         HTTPException(status_code=HTTP_403_FORBIDDEN, detail="Username missing")
