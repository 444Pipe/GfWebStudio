from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='home'),
    path('desarrollo-web.html', views.service_desarrollo_web, name='service_desarrollo_web'),
    path('diseno-grafico.html', views.service_diseno_grafico, name='service_diseno_grafico'),
    path('mantenimiento.html', views.service_mantenimiento, name='service_mantenimiento'),
    path('instalacion-camaras.html', views.service_instalacion_camaras, name='service_instalacion_camaras'),
    path('portafolio/', views.portfolio, name='portfolio'),
    path('contacto/', views.contact, name='contact'),
]
