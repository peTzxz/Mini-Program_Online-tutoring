# -*- coding: utf-8 -*-
from django.db import models
from unittest.util import _MAX_LENGTH


# Create your models here.
class StudentModel(models.Model):
    name = models.CharField(max_length=10)
    grade = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=100, blank=True)
    address = models.CharField(max_length=100, blank=True)
    gender = models.IntegerField(default=0)
    sphone = models.CharField(max_length=11, blank=False, primary_key=True)
    introduction = models.CharField(max_length=100)
    level=models.IntegerField()
    package=models.IntegerField()
    character = models.CharField(max_length=10)
    fivecharacter=models.CharField(max_length=10)
    headImg = models.ImageField(upload_to = './api/static/')



class TeacherModel(models.Model):
    name = models.CharField(max_length=10)
    grade = models.CharField(max_length=100, blank=True)
    education = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=100, blank=True)
    major = models.CharField(max_length=100, blank=True)
    gender = models.IntegerField(default=0)
    tphone = models.CharField(max_length=11, blank=False, primary_key=True)
    introduction = models.CharField(max_length=100)
    level=models.IntegerField()
    package=models.IntegerField()
    character = models.CharField(max_length=10)
    fivecharacter=models.CharField(max_length=10)
    headImg = models.ImageField(upload_to = './api/static/')


class REStudentModel(models.Model):
    sphone = models.ForeignKey(StudentModel, on_delete=models.CASCADE)
    price = models.IntegerField()
    subject = models.CharField(max_length=10)
    state = models.IntegerField()
    time = models.CharField(max_length=100)
    times=models.IntegerField()
    generate = models.CharField(max_length=100)


class RETeacherModel(models.Model):
    tphone = models.ForeignKey(TeacherModel, on_delete=models.CASCADE)
    price = models.IntegerField()
    subject = models.CharField(max_length=10)
    state = models.IntegerField()
    time = models.CharField(max_length=100)
    generate = models.CharField(max_length=100)


class AppointModel(models.Model):
    sphone = models.ForeignKey(StudentModel, on_delete=models.CASCADE)
    tphone = models.ForeignKey(TeacherModel, on_delete=models.CASCADE)
    price = models.IntegerField()
    times = models.IntegerField()
    state = models.IntegerField()
    time = models.CharField(max_length=100, blank=True)
    generate = models.CharField(max_length=100)
    comment = models.CharField(max_length=100)
    subject=models.CharField(max_length=10)
    is_pay=models.IntegerField()    
    refund_times=models.IntegerField()
    refund_price=models.IntegerField()
    refund_reason=models.CharField(max_length=100, blank=True)


class UserModel(models.Model):
    phone = models.CharField(max_length=11, blank=False)
    password = models.CharField(max_length=20,blank=False)
    state=models.IntegerField(blank=False)
    class Meta:
        unique_together = (("phone", "password"),)


class CategoryModel(models.Model):
    cid = models.IntegerField(primary_key=True)
    cname = models.CharField(max_length=20)


class MessageModel(models.Model):
    send = models.CharField(max_length=11)
    receive = models.CharField(max_length=11)
    state = models.IntegerField()
    message = models.CharField(max_length=100)
    generate = models.CharField(max_length=100)



class CategorySecondModel(models.Model):
    csid = models.IntegerField(primary_key=True)
    cid = models.ForeignKey(CategoryModel, on_delete=models.CASCADE)
    csname = models.CharField(max_length=20)
    clogo =models.CharField(max_length=128)
