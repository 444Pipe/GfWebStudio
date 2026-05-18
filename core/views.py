from django.shortcuts import render
from django.views.decorators.http import require_http_methods
from django.core.cache import cache
from django.core.validators import EmailValidator
from django.core.exceptions import ValidationError

from .models import Cotizacion


# --- Helpers ---
def _client_ip(request):
    """Devuelve la IP real respetando X-Forwarded-For (Railway/Heroku)."""
    xff = request.META.get('HTTP_X_FORWARDED_FOR', '')
    if xff:
        return xff.split(',')[0].strip()
    return request.META.get('REMOTE_ADDR', '')


def index(request):
    return render(request, 'index.html', {'title': 'Inicio - AF WEB STUDIO'})


def portfolio(request):
    items = [
        {
            'title': 'JJ Autos Villavicencio',
            'category': 'Concesionario · Compra y venta de vehículos',
            'url': 'https://www.jjautosvillavicencio.com',
            'display_url': 'jjautosvillavicencio.com',
            'gradient': 'linear-gradient(135deg, #000000 0%, #1a1a1a 60%, #2d2d2d 100%)',
            'logo': 'portafolio/jjautos.png',
            'logo_invert': True,
        },
        {
            'title': 'Area 30 Barber Club',
            'category': 'Barbería premium · Reservas online',
            'url': 'https://www.area30barberclub.com',
            'display_url': 'area30barberclub.com',
            'gradient': 'linear-gradient(135deg, #fef3c7 0%, #fbd576 55%, #d4a13a 100%)',
            'logo': 'portafolio/area30.png',
        },
        {
            'title': 'Club El Meta',
            'category': 'Club social y deportivo',
            'url': 'https://www.clubelmeta.co',
            'display_url': 'clubelmeta.co',
            'gradient': 'linear-gradient(135deg, #0b2d5c 0%, #0051ff 60%, #4da3ff 100%)',
            'logo': 'portafolio/clubelmeta.png',
        },
    ]
    return render(request, 'portfolio.html', {'items': items, 'title': 'Portafolio - AF WEB STUDIO'})


@require_http_methods(['GET', 'POST'])
def contact(request):
    sent = False
    error = None

    if request.method == 'POST':
        # --- 1) Honeypot anti-bot: si "website" trae valor, es un bot ---
        if request.POST.get('website', '').strip():
            # Simulamos éxito para no avisarle al bot
            return render(request, 'contact.html', {
                'sent': True, 'title': 'Contacto - AF WEB STUDIO'
            })

        # --- 2) Rate limit por IP: 5 envíos cada 10 minutos ---
        ip = _client_ip(request)
        if ip:
            cache_key = f'cot_rl:{ip}'
            count = cache.get(cache_key, 0)
            if count >= 5:
                error = 'Has enviado demasiadas solicitudes. Intenta de nuevo en unos minutos.'
                return render(request, 'contact.html', {
                    'sent': False, 'error': error, 'title': 'Contacto - AF WEB STUDIO'
                })
            cache.set(cache_key, count + 1, timeout=600)  # 10 min

        # --- 3) Sanitización y validación ---
        nombre = (request.POST.get('name', '') or '').strip()[:120]
        email = (request.POST.get('email', '') or '').strip()[:200]
        telefono = (request.POST.get('phone', '') or '').strip()[:40]
        mensaje = (request.POST.get('message', '') or '').strip()[:5000]

        if not (nombre and email and mensaje):
            error = 'Por favor completa nombre, correo y mensaje.'
        else:
            try:
                EmailValidator()(email)
            except ValidationError:
                error = 'El correo electrónico no es válido.'

        if not error:
            # --- 4) Persistir cotización ---
            Cotizacion.objects.create(
                nombre=nombre,
                email=email,
                telefono=telefono,
                mensaje=mensaje,
                ip=ip or None,
                user_agent=request.META.get('HTTP_USER_AGENT', '')[:400],
                referer=request.META.get('HTTP_REFERER', '')[:500],
            )
            sent = True

    return render(request, 'contact.html', {
        'sent': sent,
        'error': error,
        'title': 'Contacto - AF WEB STUDIO',
    })


def service_desarrollo_web(request):
    return render(request, 'desarrollo-web.html', {'title': 'Desarrollo Web - AF WEB STUDIO'})


def service_diseno_grafico(request):
    return render(request, 'diseno-grafico.html', {'title': 'Diseño Gráfico - AF WEB STUDIO'})


def service_instalacion_camaras(request):
    return render(request, 'instalacion-camaras.html', {'title': 'Instalación de Cámaras - AF WEB STUDIO'})
