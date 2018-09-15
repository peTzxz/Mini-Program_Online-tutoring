# -*- coding:utf-8 -*-

from rest_framework import serializers
from .models import StudentModel, TeacherModel, REStudentModel, RETeacherModel


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentModel
        fields=('name', 'grade', 'address',
                  'gender', 'sphone',)


class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherModel
        fields = ('name', 'grade', 'education',
                  'major', 'gender', 'tphone',
                 #'price', 'subject', 'time',
                  )


class REStudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = REStudentModel
        fields = ('name', 'nickName', 'age', 'role', 'register',
                  'subject', 'phone', 'price',
                  'question', 'questionnaire')


class RETeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = RETeacherModel
        fields = ('tphone.name', 'tphone.grade', 'tphone.education',
                  'tphone.major', 'tphone.gender', 'tphone_id',
                  'price', 'subject', 'time',)
