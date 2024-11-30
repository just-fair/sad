from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers, exceptions
from .models import Employee, Driver, Taxi, Dispatch, Contribution, OfficeStaff
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
                    dispatch_permissions = Permission.objects.filter(codename__in=["delete_dispatch", "view_dispatch"])
                    logentry_permissions = Permission.objects.filter(codename__in=["add_logentry","view_logentry"])


                    all_permissions = list(employee_permissions) + list(driver_permissions) + list(officestaff_permissions) + list(taxi_permissions) + list(user_permissions) + list(contribution_permissions) + list(dispatch_permissions) + list(logentry_permissions)
                    admin_group.permissions.set(all_permissions)


                    user.groups.add(admin_group)
            elif role == "office staff" and employee.officestaff.office_role == OfficeStaff.OfficeRoleChoices.DISPATCHER:
                dispatcher_group, created = Group.objects.get_or_create(name="Dispatcher")
                if created:
                    employee_permissions = Permission.objects.filter(codename__in=["view_employee"])
                    driver_permissions = Permission.objects.filter(codename__in=["view_driver"])
                    taxi_permissions = Permission.objects.filter(codename__in=["change_taxi", "view_taxi"])
                    contribution_permissions = Permission.objects.filter(codename__in=["add_contribution", "change_contribution", "delete_contribution", "view_contribution"])
                    dispatch_permissions = Permission.objects.filter(codename__in=["delete_dispatch", "view_dispatch"])
                    logentry_permissions = Permission.objects.filter(codename__in=["add_logentry","view_logentry"])


                    all_permissions = list(employee_permissions) + list(driver_permissions) + list(taxi_permissions)  + list(contribution_permissions) + list(dispatch_permissions) + list(logentry_permissions)
                    dispatcher_group.permissions.set(all_permissions)


                    user.groups.add(dispatcher_group)
            elif role == "driver":
                driver_group, created = Group.objects.get_or_create(name="Driver")
                if created:
                    permissions = Permission.objects.filter(codename__in=["view_employee", "view_driver", "view_taxi", "view_user", "view_contribution", "view_dispatch"])
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
        if(getattr(employee, "role")=="driver"):
            driver_details = Driver.objects.filter(employee=employee).prefetch_related("taxi", "employee").first()
            print(driver_details) 
            data["user_data"]=DriverSerializer(driver_details).data
            return data
        elif (getattr(employee, "role")=="office staff"):
            office_staff_details = OfficeStaff.objects.filter(employee=employee).prefetch_related("employee").first()
            office_staff_role = getattr(office_staff_details, "office_role");
            if(office_staff_role == "admin" or office_staff_role=="dispatcher"):
                data["user_data"]=OfficeStaffSerializer(office_staff_details).data
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
        # Extract employee data
        employee_data = validated_data.pop('employee', None)

        # Update OfficeStaff fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # If employee data is provided, update only specified fields
        if employee_data:
            # Get the existing employee instance
            employee = instance.employee
            for attr, value in employee_data.items():
                setattr(employee, attr, value)
            employee.save()

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
    taxi = serializers.PrimaryKeyRelatedField(queryset=Taxi.objects.all(), required=False, allow_null=True, write_only=True)
    taxi_details = TaxiSerializer(source='taxi', read_only=True)
    
    class Meta:
        model = Driver
        fields = '__all__'
        extra_fields = ['taxi_details']

    def to_representation(self, instance):
        # Add taxi details in the serialized data for GET request
        ret = super().to_representation(instance)
        if self.context['request'].method in ['GET']:
            ret['taxi_details'] = TaxiSerializer(instance.taxi).data if instance.taxi else None
        return ret


    # def to_representation(self, instance):
    #     # Add taxi plate_number in the serialized data for GET request
    #     ret = super().to_representation(instance)
    #     if self.context['request'].method in ['GET']:
    #         ret['taxi_id'] = instance.taxi.plate_number if instance.taxi else None
    #     return ret

    def validate(self, data):
        taxi_id = self.initial_data.get("taxi_id", None)  # Get the taxi_id from the request data
        
        if not taxi_id:
            return data  # No taxi provided, so validation is complete
        
        instance_taxi_id = getattr(self.instance, "taxi_id", None) if self.instance else None

        # Skip validation if taxi is the same as before
        if instance_taxi_id == taxi_id:
            return data

        # Validation for assigning taxi to an alternate or daily driver
        drivers = Driver.objects.filter(taxi=taxi_id)
        if data.get("type_of_driver") == Driver.DriverTypes.ALTERNATE:
            if drivers.exists():
                if drivers.count() == 1:
                    if drivers[0].type_of_driver == Driver.DriverTypes.ALTERNATE:
                        return data 
                    else:
                        raise serializers.ValidationError("Taxi is currently assigned to a daily driver")
                else:
                    raise serializers.ValidationError("Taxi is currently assigned to 2 alternate drivers")
            else:
                return data
        else:  # If it's a daily driver
            if drivers.exists():
                raise serializers.ValidationError("Taxi is currently assigned to a driver")
            else:
                return data

    def create(self, validated_data):
        employee_data = validated_data.pop("employee", None)
        taxi_id = self.initial_data.pop("taxi_id", None)

        # Handle employee data, create or retrieve employee
        employee = None
        if employee_data:
            employee_id = self.initial_data.get("employee", {}).get("employee_id")
            try:
                employee = Employee.objects.get(employee_id=employee_id)
                setattr(employee, "driver", self.initial_data.get("driver_id"))
                employee.save()
            except Employee.DoesNotExist:
                employee = Employee.objects.create(**employee_data)

        # Handle taxi data, retrieve existing taxi or assign None
        taxi = None
        if taxi_id:
            taxi = Taxi.objects.get(pk=taxi_id)
            type_of_driver = validated_data.pop("type_of_driver", None)

            if type_of_driver == "alternate":
                taxi.travel_type="alternate"

        # Create the driver with the assigned employee and taxi
        driver = Driver.objects.create(employee=employee, taxi=taxi, **validated_data)
        return driver

    def update(self, instance, validated_data):
        employee_data = validated_data.pop("employee", None)
        if employee_data:
            for atr, value in employee_data.items():
                setattr(instance.employee, atr, value)
            instance.employee.save()

        taxi_id = self.initial_data.pop("taxi_id", None)
        
        if taxi_id and taxi_id != instance.taxi_id:
            instance.taxi_id = taxi_id
        
        new_type_of_driver = validated_data.get("type_of_driver")
        if new_type_of_driver and new_type_of_driver != instance.type_of_driver:
            # If a new taxi is being assigned or the type_of_driver is changing
            if taxi_id:
                taxi = Taxi.objects.get(pk=taxi_id)
            else:
                taxi = instance.taxi  # Use the currently assigned taxi

            # Update travel_type only if type_of_driver has changed
            if new_type_of_driver == "alternate":
                taxi.travel_type = "alternate"

            taxi.save()


            # if taxi_id:
            #     taxi = Taxi.objects.get(pk=taxi_id)
            #     if validated_data.get("type_of_driver") == "alternate":
            #         taxi.travel_type="alternate"
            #     instance.taxi_id = taxi_id
            #     instance.taxi.save()

        for atr, value in validated_data.items():
            
            setattr(instance, atr, value)
        instance.save()
        return instance


class DispatchSerializer(serializers.ModelSerializer):
    taxi=serializers.PrimaryKeyRelatedField(queryset=Taxi.objects.all(),write_only=True)
    driver=serializers.PrimaryKeyRelatedField(queryset=Driver.objects.all(),write_only=True)

    taxi_details = TaxiSerializer(source='taxi', read_only=True)
    driver_details = DriverSerializer(source='driver', read_only=True)
    

    class Meta:
        model=Dispatch
        fields='__all__'
        extra_fields = ['taxi_details', 'driver_details']


    def update_taxi_condition(self, park_or_dispatch, taxi):
        if park_or_dispatch == Dispatch.ParkedOrDispatchChoices.PARK:
            taxi.condition = Taxi.Condition.PARKED
        elif park_or_dispatch == Dispatch.ParkedOrDispatchChoices.DISPATCH:
            taxi.condition = Taxi.Condition.DEPLOYED
        taxi.save()

    def create(self, validated_data):
        taxi = Taxi.objects.get(pk=self.initial_data.pop("taxi"))
        park_or_dispatch = validated_data['park_or_dispatch']
        self.update_taxi_condition(park_or_dispatch, taxi)
        return super().create(validated_data)

    def to_representation(self, instance):
        # Add taxi details in the serialized data for GET request
        print(self.context.get("request"))
        ret = super().to_representation(instance)
        if self.context['request'].method == ['GET']:
            ret['taxi_details'] = TaxiSerializer(instance.taxi).data if instance.taxi else None
            ret['driver_details'] = DriverSerializer(instance.driver).data if instance.driver else None
        return ret


class ContributionSerializer(serializers.ModelSerializer):
    class Meta:
        model=Contribution
        fields='__all__'

    