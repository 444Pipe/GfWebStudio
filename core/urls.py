from django.urls import path
from django.views.generic import TemplateView, RedirectView
from . import views

urlpatterns = [
    path('', views.index, name='home'),
    path('desarrollo-web.html', views.service_desarrollo_web, name='service_desarrollo_web'),
    path('desarrollo-aplicaciones.html', views.service_desarrollo_aplicaciones, name='service_desarrollo_aplicaciones'),
    path('mantenimiento-equipos.html', views.service_mantenimiento_equipos, name='service_mantenimiento_equipos'),
    # Servicios retirados: redirigir URLs viejas indexadas por Google
    path('diseno-grafico.html', RedirectView.as_view(pattern_name='home', permanent=True)),
    path('instalacion-camaras.html', RedirectView.as_view(pattern_name='home', permanent=True)),
    path('portafolio/', views.portfolio, name='portfolio'),
    path('contacto/', views.contact, name='contact'),
    path('robots.txt', TemplateView.as_view(template_name='robots.txt', content_type='text/plain'), name='robots'),
    path('sitemap.xml', TemplateView.as_view(template_name='sitemap.xml', content_type='application/xml'), name='sitemap'),
]
