from django.shortcuts import render
from django.views.decorators.http import require_http_methods


def index(request):
    return render(request, 'index.html', {'title': 'Inicio - GF WEB STUDIO'})


def services(request):
    services_list = [
        {'title': 'Desarrollo web', 'desc': 'Soluciones web modernas y responsivas.'},
        {'title': 'Diseño gráfico', 'desc': 'Branding, piezas y material visual.'},
        {'title': 'Mantenimiento de equipos', 'desc': 'Soporte y mantenimiento técnico.'},
    ]
    return render(request, 'services.html', {'services': services_list, 'title': 'Servicios - GF WEB STUDIO'})


def portfolio(request):
    items = [
        {'title': 'Proyecto A', 'img': '/static/img/placeholder-1.jpg'},
        {'title': 'Proyecto B', 'img': '/static/img/placeholder-2.jpg'},
        {'title': 'Proyecto C', 'img': '/static/img/placeholder-3.jpg'},
        {'title': 'Proyecto D', 'img': '/static/img/placeholder-4.jpg'},
    ]
    return render(request, 'portfolio.html', {'items': items, 'title': 'Portafolio - GF WEB STUDIO'})


@require_http_methods(['GET', 'POST'])
def contact(request):
    sent = False
    if request.method == 'POST':
        name = request.POST.get('name', '').strip()
        email = request.POST.get('email', '').strip()
        message = request.POST.get('message', '').strip()
        if name and email and message:
            sent = True
    return render(request, 'contact.html', {'sent': sent, 'title': 'Contacto - GF WEB STUDIO'})
