from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.http import urlencode
from .models import Cotizacion


@admin.register(Cotizacion)
class CotizacionAdmin(admin.ModelAdmin):
    list_display = (
        'nombre',
        'email',
        'telefono_link',
        'estado_badge',
        'creada_en',
        'mensaje_corto',
    )
    list_filter = ('estado', 'creada_en')
    search_fields = ('nombre', 'email', 'telefono', 'mensaje')
    date_hierarchy = 'creada_en'
    readonly_fields = (
        'creada_en',
        'actualizada_en',
        'ip',
        'user_agent',
        'referer',
        'whatsapp_link',
        'mailto_link',
    )
    list_per_page = 30
    ordering = ('-creada_en',)
    list_editable = ()  # Mantener estado editable solo en detalle
    actions = ['marcar_leida', 'marcar_contactada', 'marcar_spam']

    fieldsets = (
        ('Datos del contacto', {
            'fields': ('nombre', 'email', 'telefono', 'mensaje'),
        }),
        ('Acciones rápidas', {
            'fields': ('whatsapp_link', 'mailto_link'),
        }),
        ('Seguimiento', {
            'fields': ('estado', 'notas_internas'),
        }),
        ('Metadatos técnicos', {
            'classes': ('collapse',),
            'fields': ('ip', 'user_agent', 'referer', 'creada_en', 'actualizada_en'),
        }),
    )

    # --- Columnas decoradas ---
    @admin.display(description='Estado', ordering='estado')
    def estado_badge(self, obj):
        colors = {
            Cotizacion.ESTADO_NUEVA: '#0d6efd',
            Cotizacion.ESTADO_LEIDA: '#6c757d',
            Cotizacion.ESTADO_CONTACTADA: '#f59e0b',
            Cotizacion.ESTADO_GANADA: '#16a34a',
            Cotizacion.ESTADO_PERDIDA: '#dc3545',
            Cotizacion.ESTADO_SPAM: '#111',
        }
        color = colors.get(obj.estado, '#666')
        return format_html(
            '<span style="background:{};color:#fff;padding:2px 10px;border-radius:999px;'
            'font-size:.78rem;font-weight:600;">{}</span>',
            color, obj.get_estado_display()
        )

    @admin.display(description='Teléfono')
    def telefono_link(self, obj):
        if not obj.telefono:
            return '—'
        clean = ''.join(ch for ch in obj.telefono if ch.isdigit() or ch == '+')
        return format_html('<a href="tel:{}">{}</a>', clean, obj.telefono)

    @admin.display(description='Mensaje')
    def mensaje_corto(self, obj):
        if not obj.mensaje:
            return ''
        text = obj.mensaje.strip()
        return (text[:80] + '…') if len(text) > 80 else text

    @admin.display(description='Abrir en WhatsApp')
    def whatsapp_link(self, obj):
        if not obj.telefono:
            return '— (sin teléfono)'
        digits = ''.join(ch for ch in obj.telefono if ch.isdigit())
        if digits.startswith('57') is False and len(digits) == 10:
            digits = '57' + digits
        text = urlencode({
            'text': f'Hola {obj.nombre}, somos AF Web Studio. Recibimos tu solicitud de cotización y queremos ayudarte.'
        })
        return format_html(
            '<a href="https://wa.me/{}?{}" target="_blank" rel="noopener" '
            'style="background:#25D366;color:#fff;padding:6px 14px;border-radius:6px;'
            'text-decoration:none;font-weight:600;">Abrir WhatsApp</a>',
            digits, text
        )

    @admin.display(description='Responder por email')
    def mailto_link(self, obj):
        subject = urlencode({
            'subject': 'Tu cotización con AF Web Studio',
            'body': f'Hola {obj.nombre},\n\nGracias por contactarnos. Sobre tu mensaje:\n\n> {obj.mensaje}\n\n'
        })
        return format_html(
            '<a href="mailto:{}?{}" '
            'style="background:#0d6efd;color:#fff;padding:6px 14px;border-radius:6px;'
            'text-decoration:none;font-weight:600;">Abrir correo</a>',
            obj.email, subject
        )

    # --- Acciones bulk ---
    @admin.action(description='Marcar como leídas')
    def marcar_leida(self, request, queryset):
        n = queryset.update(estado=Cotizacion.ESTADO_LEIDA)
        self.message_user(request, f'{n} cotización(es) marcadas como leídas.')

    @admin.action(description='Marcar como contactadas')
    def marcar_contactada(self, request, queryset):
        n = queryset.update(estado=Cotizacion.ESTADO_CONTACTADA)
        self.message_user(request, f'{n} cotización(es) marcadas como contactadas.')

    @admin.action(description='Marcar como spam')
    def marcar_spam(self, request, queryset):
        n = queryset.update(estado=Cotizacion.ESTADO_SPAM)
        self.message_user(request, f'{n} cotización(es) marcadas como spam.')


# Personalización del header del admin
admin.site.site_header = 'AF Web Studio — Panel de administración'
admin.site.site_title = 'AF Web Studio'
admin.site.index_title = 'Panel de control'
