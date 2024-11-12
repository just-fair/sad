from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


class Employee(models.Model):

    class RoleChoices(models.TextChoices):
        DRIVER = 'driver', 'Driver'
        OFFICE_STAFF = 'office staff', 'Office Staff'


    class GenderChoice(models.TextChoices):
        MALE = 'M', 'Male'
        FEMALE = 'F', 'Female'


    employee_id = models.CharField(max_length=10 ,primary_key=True, editable=False)
    last_name = models.CharField(max_length=100)
    first_name = models.CharField(max_length=100)
    middle_name = models.CharField(max_length=100)
    gender = models.CharField(max_length=1, choices=GenderChoice.choices, blank=True, default=GenderChoice.MALE)
    contact_number = models.CharField(max_length=13, blank=True, null=True)
    is_active = models.BooleanField(blank=False, null=False, default=True)
    role = models.CharField(max_length=20, choices=RoleChoices.choices, null=False, blank=False, default=RoleChoices.DRIVER)
    image = models.URLField(default="", blank=True, null=False)
    date_started = models.DateField(auto_now_add=True)
    birthday = models.DateField(blank=False, null=True)
    user= models.OneToOneField(User, on_delete=models.SET_NULL, null=True, blank= True, default=None)

    def __str__(self):
        return f"Employee ID: {str(self.employee_id)}, Last Name: {self.last_name}"
    
    def save(self, *args, **kwargs):
        if not self.employee_id:
            lastEmployee = Employee.objects.order_by("employee_id").last()

            if lastEmployee:
                lastNumber = int(lastEmployee.employee_id.split('-')[1])
                newId = f"EMP-{lastNumber+1:04d}"
            else:
                newId = "EMP-0001"
                
            self.employee_id=newId

        super().save(*args, **kwargs)




class Driver(models.Model):
    
    class DriverTypes(models.TextChoices):
        DAILY = "daily"
        ALTERNATE = "alternate"

    driver_id = models.AutoField(primary_key=True)
    license_number = models.CharField(unique=True, max_length=50)
    type_of_driver = models.CharField(max_length=100, choices=DriverTypes.choices)
    taxi = models.ForeignKey('Taxi', models.DO_NOTHING, blank=True, null=True, related_name="drivers")
    employee = models.OneToOneField('Employee', models.CASCADE, blank=False, null=False, unique=True)
    pondo = models.IntegerField(blank=False, null=False)

    def __str__(self):
        return f"Driver ID: {str(self.driver_id)}, Type of Driver: {self.type_of_driver}"

class OfficeStaff(models.Model):

    class OfficeRoleChoices(models.TextChoices):
        ADMIN = "admin", "Admin"
        DISPATCHER = 'dispatcher', "Dispatcher"
        MEKANIKO = "mekaniko", "Mekaniko"
        LIAISON = "liaison", "Liaison"


    office_staff_id = models.AutoField(primary_key=True)
    office_role = models.CharField(choices=OfficeRoleChoices.choices, null=False, blank=False)
    employee = models.OneToOneField("Employee", on_delete=models.CASCADE)

    def __str__(self):
        return f"Employee ID: {self.employee}"


class Taxi(models.Model):
    brand = models.CharField(max_length=50)
    model = models.CharField(max_length=100)
    release_year = models.DateField()
    plate_number = models.CharField( max_length=10)
    service_status = models.CharField(max_length=20, blank=False, null=False)
    day_of_coding = models.CharField(max_length=10, blank=False, null=False)
    taxi_id = models.AutoField(primary_key=True)

    def __str__(self):
        return f"Taxi ID: {str(self.taxi_id)}, Plate Number: {str(self.plate_number)}"



class Boundary(models.Model):
    boundary_id = models.AutoField(primary_key=True)
    driver = models.ForeignKey('Driver', models.DO_NOTHING, blank=False, null=False)
    amount = models.IntegerField()
    date = models.DateField()



class Contribution(models.Model):
    contribution_id = models.AutoField(primary_key=True)
    sss = models.IntegerField(blank=False, null=False)
    pag_ibig = models.IntegerField(blank=False, null=False)
    philhealth = models.IntegerField(blank=False, null=False)
    total = models.IntegerField(blank=False, null=False)
    employee = models.ForeignKey('Employee', models.DO_NOTHING, blank=False, null=False)





