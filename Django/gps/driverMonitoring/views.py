from rest_framework.views import APIView
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework import permissions, generics
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Employee, Driver, Taxi,Dispatch, Contribution, OfficeStaff
from django.contrib.auth.models import User
from .serializers import EmployeeSerializer, DriverSerializer, TaxiSerializer, DispatchSerializer, ContributionSerializer, EmployeeLimitedDetailsSerializer, DriverLimitedDetailsSerializer, UserSerializer, CustomTokenPairSerializer, OfficeStaffSerializer
import os
from dotenv import load_dotenv
from imagekitio import ImageKit
from datetime import timedelta
from django.utils import timezone

load_dotenv()

imagekit = ImageKit(
    public_key=os.getenv("IMAGEKIT_PUBLIC_API_KEY"),   
    private_key=os.getenv("IMAGEKIT_PRIVATE_API_KEY"),  
    url_endpoint=os.getenv("IMAGEKIT_URL_END_POINT"),   
)

class GenerateImageUploadToken(generics.RetrieveAPIView):
    def get(self, request):
        try:
            # Generate authentication parameters
            auth_params = imagekit.get_authentication_parameters()
            return Response(auth_params, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class CustomTokenPairView(TokenObtainPairView):
    serializer_class = CustomTokenPairSerializer
    def get_serializer_context(self):
        return {"request": self.request}



class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    # def get_queryset(self):
    #     print(self.request.body)
    #     pass
    
    # change this to filter pala ireturn lang yung user details ng naka login


class DynamicUserView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
       return User.objects.filter(pk = self.request.user.id)



# getting not so detailed list of employees
class EmployeeViewSet(viewsets.ModelViewSet):
    # queryset = Employee.objects.defer("gender", "contact_number", "date_started", "birthday")
    queryset = Employee.objects.all()
    permission_classes = [IsAuthenticated]
    # serializer_class = EmployeeLimitedDetailsSerializer
    # permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        # if self.action == "list":
        #     return EmployeeLimitedDetailsSerializer
        
        return EmployeeSerializer
    
    @action(detail=False, methods=["post"], url_path="delete-multiple")
    def delete_multiple(self, request):

        ids = request.data.get("ids", [])
        
        if not ids:
            return Response({"message": "No Data provided"}, status=status.HTTP_400_BAD_REQUEST)

        employees_to_delete = Employee.objects.filter(employee_id__in=ids)

        # Delete related User instances before deleting Employee instances
        for employee in employees_to_delete:
            if employee.user:
                employee.user.delete()  

        deleted_count, deleted_objects = employees_to_delete.delete()

        return Response(
            {"message": f"{deleted_count} employees deleted successfully."},
            status=status.HTTP_200_OK
        )
    
    def perform_destroy(self, instance):
        # Delete the related User instance if it exists
        if instance.user:
            instance.user.delete()
        super().perform_destroy(instance)
    
class OfficeViewSet(viewsets.ModelViewSet):
    queryset = OfficeStaff.objects.all().select_related("employee")
    permission_classes = [AllowAny]
    serializer_class = OfficeStaffSerializer

    @action(detail=False, methods=["post"], url_path="delete-multiple")
    def delete_multiple(self, request):
        ids = request.data.get("ids", [])

        if not ids:
            return Response({"message": "No Data provided"}, status=status.HTTP_400_BAD_REQUEST)

        # Kunin yung office staff
        office_staff_to_delete = OfficeStaff.objects.filter(office_staff_id__in=ids)

        # kunin yung related data ng record sa employee
        employees_to_delete = office_staff_to_delete.values_list('employee', flat=True)

        
        # check kung merong employee, pag nag eexist edi burahin tas kasama na din sa deletion yung office staff kasi naka model.CASCADE
        for employee_id in employees_to_delete:
            if Employee.objects.filter(employee_id=employee_id).exists():
                
                Employee.objects.filter(employee_id=employee_id).delete()
        

        return Response(
            {
                "message": f"{len(employees_to_delete)} is successfully deleted"
            },
            status=status.HTTP_200_OK,
        )

class DriverViewSet(viewsets.ModelViewSet):
    queryset = Driver.objects.all().prefetch_related("employee", "taxi").order_by("employee__employee_id");
    permission_classes = [AllowAny]
    
    # def get_queryset(self):
    #     queryset = Driver.objects.all().prefetch_related("employee", "taxi").order_by("employee__employee_id");
    #     taxi_id = self.request.query_params.get("taxi");
    
    #     if taxi_id:
    #         queryset = queryset.filter(taxi=taxi_id)
    #     return queryset
    
    def get_queryset(self):
        queryset = super().get_queryset()

        
        taxi_id = self.request.query_params.get("taxi");
        if taxi_id:
            queryset = queryset.filter(taxi=taxi_id)
            
    
        if taxi_id:
            queryset = queryset.filter(taxi=taxi_id)
        return queryset

        new_driver = self.request.query_params.get('new_driver', None)

        if new_driver == 'true':
            now = timezone.now()
            queryset = queryset.filter(employee__date_started__gte=now - timedelta(days=7))
            queryset = queryset.filter(employee__date_started__lt=now)

        return queryset

    def get_serializer_class(self):
        if self.action == "list":
            return DriverLimitedDetailsSerializer
            # return DriverSerializer
        
        return DriverSerializer
    
class TaxiViewSet(viewsets.ModelViewSet):
    queryset = Taxi.objects.all()
    serializer_class = TaxiSerializer
    permission_classes = [IsAuthenticated]

class DispatchViewSet(viewsets.ModelViewSet):
    # queryset = Dispatch.objects.all().prefetch_related("driver", "taxi").order_by("date_and_time")
    serializer_class=DispatchSerializer
    permission_classes=[AllowAny]

    def get_queryset(self):
        queryset = Dispatch.objects.all().prefetch_related("driver", "taxi").order_by("-time_in")
        taxi_id = self.request.query_params.get("taxi");
    
        if taxi_id:
            queryset = queryset.filter(taxi=taxi_id)    
        return queryset


# # getting a detailed single employee
# class EmployeeDetailsView(generics.RetrieveUpdateDestroyAPIView):
#     # queryset = Employee.objects.all()
#     serializer_class= EmployeeSerializer
#     permission_classes = [permissions.AllowAny]

#     def get_queryset(self):
#         queryset= Employee.objects.filter(employee_id=self.kwargs["pk"])
#         return queryset.objects.save()

# # create ng employee
# class AddEmployeeView(generics.CreateAPIView):
#     serializer_class=EmployeeSerializer

# # getting not so detailed list of drivers
# class DriverListView(generics.ListAPIView):
#     queryset=Driver.objects.only("driver_id", "employee", "taxi").prefetch_related("employee", "taxi")
#     serializer_class = DriverLimitedDetailsSerializer

# # getting a detailed single employee
# class DriverDetailsView(generics.RetrieveUpdateDestroyAPIView):
#     queryset=Driver.objects.all()
#     serializer_class = DriverSerializer

# # create add ng driver
# class AddDriverView(generics.CreateAPIView):
#     serializer_class=DriverSerializer




# # View/Functionality para makuha ng user yung boundary details nya, different user different data
# class UserInfoView(generics.ListAPIView):
    
#     serializer_class = EmployeeSerializer

#     def get_queryset(self):
#         user = self.request.user
#         # print(type(user))

#         queryset = Employee.objects.filter(user = user.id);
#         return queryset








# @api_view(['GET'])
# def getEmployees(request):
#     employees = Employee.objects.defer("gender", "contact_number", "date_started", "birthday")
#     serializeEmployees = EmployeeLimitedDetailsSerializer(employees, many=True)
#     return Response({'drivers':serializeEmployees.data})

# @api_view(['GET'])
# def getEmployeeDetails(request, pk):
#     employees = Employee.objects.filter(pk=pk)
#     serializeEmployees = EmployeeSerializer(employees, many=True)
#     return Response(serializeEmployees.data, status=status.HTTP_200_OK)

@api_view(['POST'])
def addEmployee(request):
    serializeEmployee = EmployeeSerializer(data=request.data)
    if serializeEmployee.is_valid():
        serializeEmployee.save();
        return Response(serializeEmployee.data, status=status.HTTP_201_CREATED)
    return Response(serializeEmployee.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'DELETE', 'PUT'])
def getEmployee(request, pk):

    try:
        employee = Employee.objects.get(pk=pk)
    except Employee.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializeEmployee = EmployeeSerializer(employee);
        return  Response(serializeEmployee.data)
        
    elif request.method == 'PUT':
        serializeEmployee = EmployeeSerializer(employee, data=request.data)
        
        if serializeEmployee.is_valid():
            serializeEmployee.save();
            return Response(serializeEmployee.data);

        return Response(EmployeeSerializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    elif request.method == 'DELETE':
        employee.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    


# Controllers for Drivers
@api_view(['GET'])
def getDrivers(request):
    drivers = Driver.objects.select_related("employee", "taxi")
    serializeDriver = DriverSerializer(drivers, many=True)

    return Response(serializeDriver.data, status=status.HTTP_200_OK)
        