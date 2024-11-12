# Generated by Django 5.1.2 on 2024-10-23 04:16

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('driverMonitoring', '0002_alter_employee_employee_id_alter_employee_user'),
    ]

    operations = [
        migrations.CreateModel(
            name='OfficeStaff',
            fields=[
                ('office_staff', models.AutoField(primary_key=True, serialize=False)),
                ('office_role', models.CharField(choices=[('admin', 'Admin'), ('dispatcher', 'Dispatcher'), ('mekaniko', 'Mekaniko'), ('liaison', 'Liaison')])),
                ('employee', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='driverMonitoring.employee')),
            ],
        ),
    ]