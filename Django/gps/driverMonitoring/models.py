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
    pondo = models.IntegerField(blank=False, null=False, default=0)

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

    class TravelTypes(models.TextChoices):
        DAILY = "daily"
        ALTERNATE = "alternate"

    class DaysOfWeek(models.TextChoices):
        MONDAY= 'monday'
        TUESDAY= 'tuesday'
        WEDNESDAY= 'wednesday'
        THURSDAY= 'thursday'
        FRIDAY='friday'
        

    class Condition(models.TextChoices):
        PARKED = "parked"
        REPAIRING = "repairing"
        CODING = 'coding'    
        DEPLOYED = "deployed"


    brand = models.CharField(max_length=50)
    model = models.CharField(max_length=100)
    release_year = models.DateField()
    plate_number = models.CharField( max_length=10, unique=True)
    condition = models.CharField(max_length=20, choices=Condition.choices, default=Condition.PARKED)
    day_of_coding = models.CharField(max_length=10, choices=DaysOfWeek.choices, default=DaysOfWeek.MONDAY)
    taxi_id = models.AutoField(primary_key=True)
    travel_type = models.CharField(max_length=50, choices=TravelTypes.choices, default=TravelTypes.DAILY)
    target_boundary=models.IntegerField(default=1000)

    def __str__(self):
        return f"Taxi ID: {str(self.taxi_id)}, Plate Number: {str(self.plate_number)}"



class Dispatch(models.Model):
    

    class StatusChoices(models.TextChoices):
        GOOD="good"
        NEEDMAINTENANCE="need maintenance"
        
    class ParkedOrDispatchChoices(models.TextChoices):
        PARK="park"
        DISPATCH="dispatch"
        

    dispatch_id = models.AutoField(primary_key=True)
    park_or_dispatch=models.CharField(max_length=20, choices=ParkedOrDispatchChoices.choices, blank=False, null=False);
    driver = models.ForeignKey('Driver', models.DO_NOTHING, blank=False, null=False)
    taxi = models.ForeignKey('Taxi', models.DO_NOTHING, blank=False, null=False)
    status = models.CharField(choices=StatusChoices.choices, default=StatusChoices.GOOD)
    boundary = models.IntegerField()
    gas=models.DecimalField(max_digits=10, decimal_places=2)
    date_and_time = models.DateTimeField()
    image = models.URLField(default="", null=True)
    is_short = models.BooleanField(default=False)
    gas_deficit = models.DecimalField(default=0, max_digits=10, decimal_places=2)



class Contribution(models.Model):
    contribution_id = models.AutoField(primary_key=True)
    sss = models.IntegerField(blank=False, null=False)
    pag_ibig = models.IntegerField(blank=False, null=False)
    philhealth = models.IntegerField(blank=False, null=False)
    total = models.IntegerField(blank=False, null=False)
    employee = models.ForeignKey('Employee', models.DO_NOTHING, blank=False, null=False)





