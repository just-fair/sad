from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework import permissions, generics
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Employee, Driver, Taxi, Boundary, Contribution, OfficeStaff
from django.contrib.auth.models import User
from .serializers import EmployeeSerializer, DriverSerializer, TaxiSerializer, BoundarySerializer, ContributionSerializer, EmployeeLimitedDetailsSerializer, DriverLimitedDetailsSerializer, UserSerializer, CustomTokenPairSerializer, OfficeStaffSerializer


class CustomTokenPairView(TokenObtainPairView):
    serializer_class = CustomTokenPairSerializer



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

        deleted_count, deleted_objects = Employee.objects.filter(employee_id__in=ids).delete()

        print(deleted_count)
        print(deleted_objects)

        return Response(
            {"message": f"{deleted_count} employees deleted successfully."},
            status=status.HTTP_200_OK
        )
    
class OfficeViewSet(viewsets.ModelViewSet):
    queryset = OfficeStaff.objects.all().select_related("employee")
    permission_classes = [IsAuthenticated]
    serializer_class = OfficeStaffSerializer

class DriverViewSet(viewsets.ModelViewSet):
    queryset = Driver.objects.all().prefetch_related("employee", "taxi")
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        if self.action == "list":
            return DriverLimitedDetailsSerializer
        
        return DriverSerializer
    
class TaxiViewSet(viewsets.ModelViewSet):
    queryset = Taxi.objects.all()
    serializer_class = TaxiSerializer
    permission_classes = [IsAuthenticated]

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
        