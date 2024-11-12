from django.contrib import admin
from driverMonitoring.models import Employee, Driver, Taxi, Boundary, Contribution, OfficeStaff


# Register your models here.
admin.site.register(Employee)
admin.site.register(Driver)
admin.site.register(Taxi)
admin.site.register(Boundary)
admin.site.register(Contribution)
admin.site.register(OfficeStaff)
