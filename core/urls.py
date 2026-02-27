from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='home'),
    path('servicios/', views.services, name='services'),
    path('portafolio/', views.portfolio, name='portfolio'),
    path('contacto/', views.contact, name='contact'),
]
