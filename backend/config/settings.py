from pathlib import Path
import os
import dj_database_url

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-key-change-in-production")
DEBUG = os.environ.get("DEBUG", "True").lower() in ("true", "1", "yes")

raw_allowed_hosts = os.environ.get("ALLOWED_HOSTS", "127.0.0.1,localhost")
ALLOWED_HOSTS = [host.strip() for host in raw_allowed_hosts.split(",") if host.strip()]

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'core',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

DATABASES = {
    'default': dj_database_url.config(
        default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}",
        conn_max_age=600,
        conn_health_checks=True,
    )
}

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Dhaka'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

CORS_ALLOW_CREDENTIALS = True
raw_cors = os.environ.get(
    "CORS_ALLOWED_ORIGINS",
    "http://127.0.0.1:5173,http://localhost:5173,http://127.0.0.1:4173,http://localhost:4173"
)
CORS_ALLOWED_ORIGINS = [origin.strip() for origin in raw_cors.split(",") if origin.strip()]

raw_csrf = os.environ.get(
    "CSRF_TRUSTED_ORIGINS",
    "http://127.0.0.1:5173,http://localhost:5173,http://127.0.0.1:4173,http://localhost:4173"
)
CSRF_TRUSTED_ORIGINS = [origin.strip() for origin in raw_csrf.split(",") if origin.strip()]

SESSION_COOKIE_NAME = "sessionid"
SESSION_COOKIE_SAMESITE = os.environ.get("SESSION_COOKIE_SAMESITE", "Lax" if DEBUG else "None")
SESSION_COOKIE_SECURE = os.environ.get("SESSION_COOKIE_SECURE", "False" if DEBUG else "True").lower() in ("true", "1", "yes")

CSRF_COOKIE_SAMESITE = os.environ.get("CSRF_COOKIE_SAMESITE", "Lax" if DEBUG else "None")
CSRF_COOKIE_SECURE = os.environ.get("CSRF_COOKIE_SECURE", "False" if DEBUG else "True").lower() in ("true", "1", "yes")

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

WHITENOISE_MANIFEST_STRICT = False

STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedStaticFilesStorage",
    },
}