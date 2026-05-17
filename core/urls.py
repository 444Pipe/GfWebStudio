from django.urls import path
from django.views.generic import TemplateView
from . import views

urlpatterns = [
    path('', views.index, name='home'),
    path('desarrollo-web.html', views.service_desarrollo_web, name='service_desarrollo_web'),
    path('diseno-grafico.html', views.service_diseno_grafico, name='service_diseno_grafico'),
    path('instalacion-camaras.html', views.service_instalacion_camaras, name='service_instalacion_camaras'),
    path('portafolio/', views.portfolio, name='portfolio'),
    path('contacto/', views.contact, name='contact'),
    path('robots.txt', TemplateView.as_view(template_name='robots.txt', content_type='text/plain'), name='robots'),
    path('sitemap.xml', TemplateView.as_view(template_name='sitemap.xml', content_type='application/xml'), name='sitemap'),
]
