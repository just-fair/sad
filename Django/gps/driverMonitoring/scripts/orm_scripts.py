from ..models import OfficeStaff, Employee
from datetime import date

def create_office_employees():
    office_staff_data = [
        {
            "office_role": "dispatcher",
            "employee": {
                "last_name": "Williams",
                "first_name": "Emily",
                "middle_name": "C",
                "gender": "F",
                "contact_number": "09198765432",
                "is_active": True,
                "role": "office staff",
                "image": "https://example.com/images/emily_williams.jpg",
                "date_started": "2024-11-05",
                "birthday": "1990-07-15",
                "user": None
            }
        },
        {
            "office_role": "mekaniko",
            "employee": {
                "last_name": "Brown",
                "first_name": "James",
                "middle_name": "D",
                "gender": "M",
                "contact_number": "09323456789",
                "is_active": True,
                "role": "office staff",
                "image": "https://example.com/images/james_brown.jpg",
                "date_started": "2024-11-03",
                "birthday": "1982-12-12",
                "user": None
            }
        },
        {
            "office_role": "liaison",
            "employee": {
                "last_name": "Taylor",
                "first_name": "Rachel",
                "middle_name": "E",
                "gender": "F",
                "contact_number": "09234567890",
                "is_active": True,
                "role": "office staff",
                "image": "https://example.com/images/rachel_taylor.jpg",
                "date_started": "2024-11-02",
                "birthday": "1995-01-25",
                "user": None
            }
        },
        {
            "office_role": "admin",
            "employee": {
                "last_name": "Martin",
                "first_name": "Lucas",
                "middle_name": "F",
                "gender": "M",
                "contact_number": "09314567890",
                "is_active": True,
                "role": "office staff",
                "image": "https://example.com/images/lucas_martin.jpg",
                "date_started": "2024-10-30",
                "birthday": "1989-06-10",
                "user": None
            }
        }
    ]

    for data in office_staff_data:
        employee_data = data["employee"]
        
        # Create the Employee record first
        employee = Employee.objects.create(
            last_name=employee_data["last_name"],
            first_name=employee_data["first_name"],
            middle_name=employee_data["middle_name"],
            gender=employee_data["gender"],
            contact_number=employee_data["contact_number"],
            is_active=employee_data["is_active"],
            role=employee_data["role"],
            image=employee_data["image"],
            date_started=employee_data["date_started"],
            birthday=employee_data["birthday"],
            user=employee_data["user"]
        )

        # Create OfficeStaff and associate it with the Employee
        OfficeStaff.objects.create(
            office_role=data["office_role"],
            employee=employee
        )
