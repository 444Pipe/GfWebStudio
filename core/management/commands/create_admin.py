"""
Crea (o actualiza) el usuario administrador de AF Web Studio.

Uso local (PowerShell o bash):
    python manage.py create_admin

Lee credenciales por defecto de las variables de entorno; si no existen,
usa los valores definidos abajo. Esto evita commitear contraseñas en repos.

Variables de entorno (recomendado en producción):
    AFWEB_ADMIN_USER=afweb
    AFWEB_ADMIN_EMAIL=afwebstudioo@gmail.com
    AFWEB_ADMIN_PASSWORD=<una-contraseña-fuerte>
"""

import os
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model


class Command(BaseCommand):
    help = 'Crea (o actualiza) el usuario administrador de AF Web Studio.'

    def handle(self, *args, **options):
        User = get_user_model()

        username = os.environ.get('AFWEB_ADMIN_USER', 'afweb')
        email = os.environ.get('AFWEB_ADMIN_EMAIL', 'afwebstudioo@gmail.com')
        password = os.environ.get('AFWEB_ADMIN_PASSWORD', 'juanypipe123')

        user, created = User.objects.get_or_create(
            username=username,
            defaults={'email': email, 'is_staff': True, 'is_superuser': True},
        )
        # Siempre nos aseguramos de que sea staff/superuser y que la contraseña esté al día
        user.email = email
        user.is_staff = True
        user.is_superuser = True
        user.set_password(password)
        user.save()

        if created:
            self.stdout.write(self.style.SUCCESS(
                f'[OK] Usuario admin "{username}" creado.'
            ))
        else:
            self.stdout.write(self.style.SUCCESS(
                f'[OK] Usuario admin "{username}" actualizado.'
            ))

        self.stdout.write(self.style.WARNING(
            '[!] Recuerda: usa una contrasena fuerte y cambiala desde el admin '
            'despues del primer login si estas usando la contrasena por defecto.'
        ))
