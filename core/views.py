from django.shortcuts import render
from django.views.decorators.http import require_http_methods


def index(request):
    return render(request, 'index.html', {'title': 'Inicio - AF WEB STUDIO'})


def portfolio(request):
    items = [
        {
            'title': 'JJ Autos Villavicencio',
            'category': 'Concesionario · Compra y venta de vehículos',
            'url': 'https://www.jjautosvillavicencio.com',
            'display_url': 'jjautosvillavicencio.com',
            'gradient': 'linear-gradient(135deg, #0051ff 0%, #00d4ff 100%)',
            'initials': 'JJ',
        },
        {
            'title': 'Area 30 Barber Club',
            'category': 'Barbería premium · Reservas online',
            'url': 'https://www.area30barberclub.com',
            'display_url': 'area30barberclub.com',
            'gradient': 'linear-gradient(135deg, #111111 0%, #2d2d2d 60%, #D4AF37 100%)',
            'initials': 'A30',
        },
        {
            'title': 'Club El Meta',
            'category': 'Club social y deportivo',
            'url': 'https://www.clubelmeta.co',
            'display_url': 'clubelmeta.co',
            'gradient': 'linear-gradient(135deg, #0b6b3a 0%, #34d399 60%, #aaff8a 100%)',
            'initials': 'CM',
        },
    ]
    return render(request, 'portfolio.html', {'items': items, 'title': 'Portafolio - AF WEB STUDIO'})


@require_http_methods(['GET', 'POST'])
def contact(request):
    sent = False
    if request.method == 'POST':
        name = request.POST.get('name', '').strip()
        email = request.POST.get('email', '').strip()
        message = request.POST.get('message', '').strip()
        if name and email and message:
            sent = True
    return render(request, 'contact.html', {'sent': sent, 'title': 'Contacto - AF WEB STUDIO'})


def service_desarrollo_web(request):
    context = {
        'title': 'Desarrollo Web - AF WEB STUDIO',
    }
    return render(request, 'desarrollo-web.html', context)


def service_diseno_grafico(request):
    context = {
        'title': 'Diseño Gráfico - AF WEB STUDIO',
    }
    return render(request, 'diseno-grafico.html', context)


def service_instalacion_camaras(request):
    context = {
        'title': 'Instalación de Cámaras - AF WEB STUDIO',
    }
    return render(request, 'instalacion-camaras.html', context)
