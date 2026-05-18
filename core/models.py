from django.db import models


class Cotizacion(models.Model):
    """Solicitud de cotización enviada desde el formulario de contacto."""

    ESTADO_NUEVA = 'nueva'
    ESTADO_LEIDA = 'leida'
    ESTADO_CONTACTADA = 'contactada'
    ESTADO_GANADA = 'ganada'
    ESTADO_PERDIDA = 'perdida'
    ESTADO_SPAM = 'spam'

    ESTADO_CHOICES = [
        (ESTADO_NUEVA, 'Nueva'),
        (ESTADO_LEIDA, 'Leída'),
        (ESTADO_CONTACTADA, 'Contactada'),
        (ESTADO_GANADA, 'Ganada'),
        (ESTADO_PERDIDA, 'Perdida'),
        (ESTADO_SPAM, 'Spam'),
    ]

    nombre = models.CharField(max_length=120)
    email = models.EmailField()
    telefono = models.CharField(max_length=40, blank=True)
    mensaje = models.TextField()

    estado = models.CharField(
        max_length=20,
        choices=ESTADO_CHOICES,
        default=ESTADO_NUEVA,
        db_index=True,
    )
    notas_internas = models.TextField(
        blank=True,
        help_text='Notas privadas (no visibles para el cliente).'
    )

    ip = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.CharField(max_length=400, blank=True)
    referer = models.URLField(max_length=500, blank=True)

    creada_en = models.DateTimeField(auto_now_add=True, db_index=True)
    actualizada_en = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Cotización'
        verbose_name_plural = 'Cotizaciones'
        ordering = ['-creada_en']

    def __str__(self):
        return f'{self.nombre} — {self.email} ({self.get_estado_display()})'
