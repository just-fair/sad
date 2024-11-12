from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

router = DefaultRouter()
router.register(r"employees", views.EmployeeViewSet, basename="employee")
router.register(r"drivers", views.DriverViewSet, basename="driver")
router.register(r"taxis", views.TaxiViewSet, basename="taxi")
router.register(r"accounts", views.UserViewSet, basename="account")
router.register(r"office-employees", views.OfficeViewSet, basename="office-employee")

urlpatterns = [
    path("user/", views.DynamicUserView.as_view()),
    path("token/", views.CustomTokenPairView.as_view()),
    path("token/refresh/", TokenRefreshView.as_view()),
    path("auth/", include("rest_framework.urls"))
    # path('employees/', views.EmployeeListView.as_view()),
    # path('employees/<str:pk>/', views.EmployeeDetailsView.as_view()),
    # path('employees/add', views.AddEmployeeView.as_view()),
    # path('drivers/', views.DriverListView.as_view()),
    # path('drivers/<int:pk>/', views.DriverDetailsView.as_view()),
    # path('drivers/add', views.AddDriverView.as_view()),
    # path('user/', views.UserInfoView.as_view())
]

urlpatterns+=router.urls