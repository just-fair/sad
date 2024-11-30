from django.contrib import admin
from driverMonitoring.models import Employee, Driver, Taxi, Dispatch, Contribution, OfficeStaff


# Register your models here.
admin.site.register(Employee)
admin.site.register(Driver)
admin.site.register(Taxi)
admin.site.register(Dispatch)
admin.site.register(Contribution)
admin.site.register(OfficeStaff)
