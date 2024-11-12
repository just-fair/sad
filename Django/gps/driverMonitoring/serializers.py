from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers, exceptions
from .models import Employee, Driver, Taxi, Boundary, Contribution, OfficeStaff
from django.contrib.auth.models import User, Group, Permission
from django.core.exceptions import ValidationError





class UserSerializer(serializers.ModelSerializer):
    employee = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model=User
        fields = ["id", "username", "email", "password", "first_name", "last_name", "employee"]


    def create(self, validated_data):
        employee_id = self.initial_data.pop("employee")
        
        try:
            employee = Employee.objects.get(pk=employee_id)
            if employee.first_name != validated_data.get("first_name") or employee.last_name != validated_data.get("last_name"):
                raise serializers.ValidationError("Credentials do not match")

            password = validated_data.pop("password")
            user = User(**validated_data)
            user.set_password(password)
            user.save()

            setattr(employee, "user", user)
            employee.save()
            
            role = employee.role
            if role == "office staff" and employee.officestaff.office_role == OfficeStaff.OfficeRoleChoices.ADMIN:
                print("DUMAAN DITO")
                admin_group, created = Group.objects.get_or_create(name="Admin")
                if created:
                    employee_permissions = Permission.objects.filter(codename__in=["add_employee", "change_employee", "delete_employee", "view_employee"])
                    driver_permissions = Permission.objects.filter(codename__in=["add_driver", "change_driver", "delete_driver", "view_driver"])
                    officestaff_permissions = Permission.objects.filter(codename__in=["add_officestaff", "change_officestaff", "officestaff", "view_officestaff"])
                    taxi_permissions = Permission.objects.filter(codename__in=["add_taxi", "change_taxi", "delete_taxi", "view_taxi"])
                    user_permissions = Permission.objects.filter(codename__in=["add_user", "change_user", "delete_user", "view_user"])
                    contribution_permissions = Permission.objects.filter(codename__in=["add_contribution", "change_contribution", "delete_contribution", "view_contribution"])
                    boundary_permissions = Permission.objects.filter(codename__in=["add_boundary", "change_boundary", "delete_boundary", "view_boundary"])
                    logentry_permissions = Permission.objects.filter(codename__in=["add_logentry","view_logentry"])


                    all_permissions = list(employee_permissions) + list(driver_permissions) + list(officestaff_permissions) + list(taxi_permissions) + list(user_permissions) + list(contribution_permissions) + list(boundary_permissions) + list(logentry_permissions)
                    admin_group.permissions.set(all_permissions)


                    user.groups.add(admin_group)
            elif role == "driver":
                driver_group, created = Group.objects.get_or_create(name="Driver")
                if created:
                    permissions = Permission.objects.filter(codename__in=["view_employee", "view_driver", "view_taxi", "view_user", "view_contribution", "view_boundary"])
                    driver_group.permissions.set(permissions)
                    user.groups.add(driver_group)
            else:
                raise serializers.ValidationError("Invalid role specified")

            return user
                   
        except Employee.DoesNotExist:
            raise serializers.ValidationError("Employee id does not exist")
        

    def get_employee(self, object):
        if hasattr(object, "employee") and object.employee is not None:
            return object.employee.employee_id
        return None

    def __str__(self):
        return f"Username: {self.username}"
        

class CustomTokenPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        if(self.user.is_superuser):
            data["is_superuser"]=self.user.is_superuser
            return data

        employee = self.user.employee;
        data["user_data"]=EmployeeSerializer(employee).data
        return data


class EmployeeSerializer(serializers.ModelSerializer):
    fk = serializers.SerializerMethodField(read_only=True)
    # automatic hahanapin nya yung get_driver_id na function

    class Meta:
        model=Employee
        fields='__all__'

    def get_fk(self, object):
        
        if object.role == Employee.RoleChoices.OFFICE_STAFF:
            if hasattr(object, "officestaff") and object.officestaff is not None:
                return object.officestaff.office_staff_id

        if hasattr(object, 'driver') and object.driver is not None:
            return object.driver.driver_id
        
        return None

    

    def __str__(self):
        return self.last_name
    
class OfficeStaffSerializer(serializers.ModelSerializer):
    employee = EmployeeSerializer()  # Use EmployeeSerializer for nested employee data

    class Meta:
        model = OfficeStaff
        fields = '__all__'  # All fields including nested employee data

    def update(self, instance, validated_data):
        # Get employee data from the request
        employee_data = validated_data.pop('employee', None)

        # Update office staff fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # If employee data is provided, handle the update or creation of the employee
        if employee_data:
            # If employee_id is provided, update the existing employee
            employee, created = Employee.objects.update_or_create(
                employee_id=employee_data.get('employee_id'),  # Match based on employee_id
                defaults=employee_data  # Update fields
            )
            # Set the updated/created employee to office staff
            instance.employee = employee
            instance.save()

        return instance

    def create(self, validated_data):
        # Get employee data from the request
        employee_data = validated_data.pop('employee', None)

        if not employee_data:
            raise serializers.ValidationError("Employee data is required.")

        # Create the Employee first
        employee = Employee.objects.create(**employee_data)

        # Create OfficeStaff object and associate with the created employee
        office_staff = OfficeStaff.objects.create(employee=employee, **validated_data)

        return office_staff
    

class EmployeeLimitedDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model=Employee
        fields=["employee_id", "last_name", "first_name", "middle_name", "is_active", "role", "image"]


class TaxiSerializer(serializers.ModelSerializer):
    drivers = serializers.SerializerMethodField()

    class Meta:
        model=Taxi
        fields='__all__'

    def get_drivers(self, object):
        drivers = object.drivers.all()
        driver_ids = []
        drivers = list(drivers)

        for driver in drivers:
            driver_ids.append(driver.driver_id)

        return driver_ids
        

class DriverLimitedDetailsSerializer(serializers.ModelSerializer):
    employee = EmployeeLimitedDetailsSerializer(read_only=True)
    taxi = TaxiSerializer(read_only=True)

    class Meta:
        model=Driver
        fields=["driver_id", "employee", "taxi"]


class DriverSerializer(serializers.ModelSerializer):
    employee = EmployeeSerializer()
    taxi = TaxiSerializer()

    class Meta:
        model=Driver
        fields='__all__'

    def validate(self, data):
        taxi_id = self.initial_data.get("taxi").get("taxi_id")
        drivers = Driver.objects.filter(taxi=taxi_id)
        if data.get("type_of_driver") == Driver.DriverTypes.ALTERNATE:
            if drivers.exists():
                if drivers.count() == 1:
                    if drivers[0].type_of_driver == Driver.DriverTypes.ALTERNATE:
                        return data 
                    else:
                        raise ValidationError("Taxi has currenly assigned to a daily driver")
                else:
                    raise ValidationError("Taxi has currenly assigned to 2 alternate drivers")
            else:
                return data
        else:
            if drivers.exists():
                return data
            else:
                raise ValidationError("Taxi is currently assigned to a driver")



    def create(self, validated_data):
        employee_data = validated_data.pop("employee", None)
        employee = None
        
        if employee_data is not None:
            employee_id = self.initial_data.get("employee").get("employee_id")
            print(f"EMPLOYEE DATA : {employee_id}")
            try:
                employee = Employee.objects.get(employee_id=employee_id)
                setattr(employee, "driver", self.initial_data.get("driver_id"))
                employee.save()
            except Employee.DoesNotExist:
                employee = Employee.objects.create(**employee_data)


        taxi_data = validated_data.pop("taxi", None)
        taxi=None
        
        if taxi_data is not None:
            taxi_id = self.initial_data.get("taxi").get("taxi_id")
            try:
                taxi = Taxi.objects.get(pk=taxi_id)
                setattr(taxi, "driver", validated_data.get("driver"))
                taxi.save()
            except Taxi.DoesNotExist:
                taxi = Taxi.objects.create(**taxi_data)
                # raise serializers.ValidationError("Gumagawa ng bagong TAXI")
            

        driver = Driver.objects.create(employee = employee, taxi = taxi, **validated_data)
        return driver

        
        

    def update(self, instance, validated_data):

        employee_data = validated_data.pop("employee", None)
        if employee_data:
            for atr, value in employee_data.items():
                setattr(instance.employee, atr, value)
            instance.employee.save()

        taxi_data = validated_data.pop("taxi", None)
        if taxi_data:
            for atr, value in taxi_data.items():
                setattr(instance.taxi, atr, value)
            instance.taxi.save()
        
        for atr, value in validated_data.items():
            setattr(instance, atr, value)
        instance.save()
        return instance


class BoundarySerializer(serializers.ModelSerializer):
    class Meta:
        model=Boundary
        fields='__all__'


class ContributionSerializer(serializers.ModelSerializer):
    class Meta:
        model=Contribution
        fields='__all__'

    