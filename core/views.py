from django.shortcuts import render
from django.views.decorators.http import require_http_methods


def index(request):
    return render(request, 'index.html', {'title': 'Inicio - AF WEB STUDIO'})


def portfolio(request):
    items = [
        {'title': 'Proyecto A', 'img': '/static/img/placeholder-1.jpg'},
        {'title': 'Proyecto B', 'img': '/static/img/placeholder-2.jpg'},
        {'title': 'Proyecto C', 'img': '/static/img/placeholder-3.jpg'},
        {'title': 'Proyecto D', 'img': '/static/img/placeholder-4.jpg'},
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


def service_mantenimiento(request):
    context = {
        'title': 'Mantenimiento - AF WEB STUDIO',
    }
    return render(request, 'mantenimiento.html', context)


def service_instalacion_camaras(request):
    context = {
        'title': 'Instalación de Cámaras - AF WEB STUDIO',
    }
    return render(request, 'instalacion-camaras.html', context)
