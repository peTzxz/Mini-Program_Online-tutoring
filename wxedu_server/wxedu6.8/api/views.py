# -*- coding: utf-8 -*-
#  reload(sys) sys.setdefaultencoding( "utf-8" )
from api.models import *
from rest_framework import generics
from django.shortcuts import render
from dss.Serializer import serializer
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from django.db.models import Q
from django.db.models import F
from django.db.models import Count
from weixin import  WeixinPay, WeixinError
from . import wx_pay
from wx_pay import WxPay, WxPayError
import urllib  
import re  
import time  
import os  


pay = WeixinPay('wxa8025380403083c5', '1487139352', '0aa4a0c3ac4bd1cbdc4d5fcd061f7163', 'http://www.weixin.qq.com/wxpay/pay.php') # 后两个参数可选
wx_pay = WxPay(
        wx_app_id='wxa8025380403083c5',  # 微信平台appid
        wx_mch_id='1487139352',  # 微信支付商户号
        wx_mch_key='0aa4a0c3ac4bd1cbdc4d5fcd061f7163',
        # wx_mch_key 微信支付重要密钥，请登录微信支付商户平台，在 账户中心-API安全-设置API密钥设置
        wx_notify_url='http://www.weixin.qq.com/wxpay/pay.php'
        # wx_notify_url 接受微信付款消息通知地址（通常比自己把支付成功信号写在js里要安全得多，推荐使用这个来接收微信支付成功通知）
        # wx_notify_url 开发详见https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_7
    )
apiUrl="https://www.weixinjiajiao.cn/"

# lv.0  0-100
# lv.1  100-300
# lv.2  300-600
# lv.3  600-1000
# lv.4  1000-1500
# lv.5  1500-2100
# lv.6  2100-2800
# lv.7  2800-3600
# lv.8  3600-4500
# lv.9  4500-5500

class JSONResponse(HttpResponse):
    def __init__(self, data, **kwargs):
        content = JSONRenderer().render(data)
        kwargs['content_type'] = 'application/json'
        super(JSONResponse, self).__init__(content, **kwargs)

def download_img(url,phone): 
    print 'debug:url='+url
    times=time.time()
    path = "C:/inetpub/wwwroot/wxedu8.23/api/static/images/"+phone+str(times)+".jpg"  
    print path
    fileName="api/static/images/"+phone+str(times)+".jpg"  
    data = urllib.urlopen(url).read()  
    f = file(path,"wb")  
    f.write(data)  
    f.close()
    return fileName

def getLevel(a):
    if a.level>=0 and a.level<=100:
        level={'lv':0,'sc':a.level,'max':100}
    elif a.level>100 and a.level<=300:
        level={'lv':1,'sc':a.level,'max':300}
    elif a.level>300 and a.level<=600:
        level={'lv':2,'sc':a.level,'max':600}
    elif a.level>600 and a.level<=1000:
        level={'lv':3,'sc':a.level,'max':1000}
    elif a.level>1000 and a.level<=1500:
        level={'lv':4,'sc':a.level,'max':1500}
    elif a.level>1500 and a.level<=2100:
        level={'lv':5,'sc':a.level,'max':2100}
    elif a.level>2100 and a.level<=2800:
        level={'lv':6,'sc':a.level,'max':2800}
    elif a.level>2800 and a.level<=3600:
        level={'lv':7,'sc':a.level,'max':3600}
    elif a.level>3600 and a.level<=4500:
        level={'lv':8,'sc':a.level,'max':4500}
    elif a.level>4500 and a.level<=5500:
        level={'lv':9,'sc':a.level,'max':5500}
    else:
        level={'lv':9,'sc':5500,'max':5500}
    return level



def teacherInfo(record):
    total=[]
    for a in record:
        url=apiUrl+a.headImg.url[4:]
        url=url.decode()
        level=getLevel(a)
        d={'name':a.name,'grade':a.grade,'education':a.education,'major':a.major,
        'gender':a.gender,'tphone':a.tphone,'introduction':a.introduction,'city':a.city,'headImg':url,
        'level':level['lv'],'sc':level['sc'],'lvMax':level['max'],'package':a.package,'character':a.character}
        total.append(d)
    return total


def studentInfo(record):
    total=[]
    for a in record:
        url=apiUrl+a.headImg.url[4:]
        url=url.decode()
        level=getLevel(a)
        d={'name':a.name,'grade':a.grade,'address':a.address,'gender':a.gender,
        'sphone':a.sphone,'introduction':a.introduction,'city':a.city,'headImg':url,
        'level':level['lv'],'sc':level['sc'],'lvMax':level['max'],'package':a.package,'character':a.character}
        total.append(d)
    return total

def ReTeacherInfo(record):
    total =[] 
    for a in record:
        url=apiUrl+a.tphone.headImg.url[4:]
        url=url.decode()
        level=getLevel(a.tphone)
        d={'id':a.id,'name':a.tphone.name,'grade':a.tphone.grade,'education':a.tphone.education,'gender':a.tphone.gender,
        'tphone':a.tphone_id,'major':a.tphone.major,'price':a.price,'subject':a.subject,'time':a.time,'generate':a.generate,
        'introduction':a.tphone.introduction,'level':a.tphone.level,'lvl':level['lv'],'character':a.tphone.character,'city':a.tphone.city.split(',')[2],'headImg':url}
        total.append(d)
    return total


def ReStudentInfo(record):
    total =[]
    for a in record:
        url=apiUrl+a.sphone.headImg.url[4:]
        url=url.decode()
        level=getLevel(a.sphone)
        d={'id':a.id,'name':a.sphone.name,'grade':a.sphone.grade,'times':a.times,'address':a.sphone.address,'gender':a.sphone.gender,
        'sphone':a.sphone_id,'price':a.price,'subject':a.subject,'level':a.sphone.level,
        'lvl':level['lv'],'time':a.time,'introduction':a.sphone.introduction,'character':a.sphone.character,'generate':a.generate,
        'city':a.sphone.city.split(',')[2],'headImg':url}
        total.append(d)
    return total


def TeacherAppointInfo(record):
    total=[]
    for each in record:
        tphone = each.tphone_id
        data = TeacherModel.objects.filter(tphone=tphone)
        for each1 in data:
            d = {'name': each1.name, 'grade': each1.grade, 'education': each1.education, 'major': each1.major,
                'gender': each1.gender, 'tphone': each1.tphone, 'introduction': each1.introduction,
                'id': each.id, 'price': each.price, 'times': each.times, 'state': each.state, 'time': each.time,
                'generate': each.generate, 'comment': each.comment, 'sphone_id': each.sphone_id,
                'tphone_id': each.tphone_id, 'subject': each.subject,'is_pay':each.is_pay,'refund_price':each.refund_price,
                'refund_times':each.refund_times,'refund_reason':each.refund_reason
            }
        total.append(d)
    return total


def StudentAppointInfo(record):
    total=[]
    for each in record:
        sphone = each.sphone_id
        data = StudentModel.objects.filter(sphone=sphone)
        for each1 in data:
            d = {'name': each1.name, 'grade': each1.grade, 'address': each1.address,
                'gender': each1.gender, 'sphone': each1.sphone, 'introduction': each1.introduction,
                'id': each.id, 'price': each.price, 'times': each.times, 'state': each.state, 'time': each.time,
                'generate': each.generate, 'comment': each.comment, 'sphone_id': each.sphone_id,
                'tphone_id': each.tphone_id, 'subject': each.subject,'is_pay':each.is_pay,'refund_price':each.refund_price,
                'refund_times':each.refund_times,'refund_reason':each.refund_reason
            }
        total.append(d)
    return total[::-1]


# pages/one/index.js
@csrf_exempt
def getteacherinf(request,tphone):
    if request.method == 'GET':
        record=TeacherModel.objects.filter(tphone=tphone)
        total=teacherInfo(record)
        data = serializer(total, output_type='json')
        return HttpResponse(data)


# pages/one/index.js
@csrf_exempt
def getstudentinf(request,sphone):
    if request.method == 'GET':
        record=StudentModel.objects.filter(sphone=sphone)
        total=studentInfo(record)
        data = serializer(total, output_type='json')
        return HttpResponse(data)


#detail/detail.js
@csrf_exempt
def RETeacher_list_id(request,id):
    if request.method == 'GET':
        record = RETeacherModel.objects.filter(id=id)
        total=ReTeacherInfo(record)
        data = serializer(total,output_type='json')
        return HttpResponse(data)


#detail/detail.js
@csrf_exempt
def REStudent_list_id(request,id):
    if request.method == 'GET':
        record = REStudentModel.objects.filter(id=id)
        total=ReStudentInfo(record)
        data = serializer(total,output_type='json')
        return HttpResponse(data)


#myrelease/release.js
@csrf_exempt
def RETeacher_list_tphone(request,tphone):
    if request.method == 'GET':
        record = RETeacherModel.objects.filter(tphone__tphone=tphone)
        total=ReTeacherInfo(record)
        data = serializer(total,output_type='json')
        return HttpResponse(data)


#myrelease/release.js
@csrf_exempt
def RETeacher_list_sphone(request,sphone):
    if request.method == 'GET':
        record = REStudentModel.objects.filter(sphone__sphone=sphone)
        total=ReStudentInfo(record)
        data = serializer(total,output_type='json')
        return HttpResponse(data)


# pages/service/service.js
@csrf_exempt
def subject_list(request):
    total = []
    if request.method=='GET':
        category=CategoryModel.objects.all()
        categorysecond=CategorySecondModel.objects.all()
        total.append(category)
        total.append(categorysecond)
        data = serializer(total, output_type='json')
        return HttpResponse(data)


# pages/mydata/mydata.js
@csrf_exempt
def updateCity(request):
    if request.method=='POST':
        data = JSONParser().parse(request)
        if data['state']==0:
            print 0
            TeacherModel.objects.filter(tphone=data['phone']).update(city=data['city'])
        if data['state']=='1':
            print 1
            StudentModel.objects.filter(sphone=data['phone']).update(city=data['city'])
        return HttpResponse(True)

@csrf_exempt
def updateGender(request):
    if request.method=='POST':
        data = JSONParser().parse(request)
        if data['state']==0:
            print 0
            TeacherModel.objects.filter(tphone=data['phone']).update(gender=data['gender'])
        if data['state']=='1':
            print 1
            StudentModel.objects.filter(sphone=data['phone']).update(gender=data['gender'])
        return HttpResponse(True)        


# pages/mydata/mydata.js
@csrf_exempt
def updateIntroduction(request):
    if request.method=='POST':
        data = JSONParser().parse(request)
        if data['state']==0:
            print 0
            TeacherModel.objects.filter(tphone=data['phone']).update(introduction=data['introduction'])
        if data['state']=='1':
            print 1
            StudentModel.objects.filter(sphone=data['phone']).update(introduction=data['introduction'])
        return HttpResponse(True)


# pages/mydata/mydata.js
@csrf_exempt
def updateName(request):
    if request.method=='POST':
        data = JSONParser().parse(request)
        if data['state']==0:
            print 0
            TeacherModel.objects.filter(tphone=data['phone']).update(name=data['name'])
        if data['state']=='1':
            print 1
            StudentModel.objects.filter(sphone=data['phone']).update(name=data['name'])
        return HttpResponse(True)


# pages/mydata/mydata.js
@csrf_exempt
def updateMajor(request):
    if request.method=='POST':
        data = JSONParser().parse(request)
        TeacherModel.objects.filter(tphone=data['phone']).update(major=data['major'])
        return HttpResponse(True)

# pages/mydata/mydata.js
@csrf_exempt
def updateEducation(request):
    if request.method=='POST':
        data = JSONParser().parse(request)
        TeacherModel.objects.filter(tphone=data['phone']).update(education=data['education'])
        return HttpResponse(True)


# pages/mydata/mydata.js
@csrf_exempt
def updateAddress(request):
    if request.method=='POST':
        data = JSONParser().parse(request)
        StudentModel.objects.filter(sphone=data['phone']).update(address=data['address'])
        return HttpResponse(True)


# pages/mydata/mydata.js
@csrf_exempt
def updateTGrade(request):
    if request.method=='POST':
        data = JSONParser().parse(request)
        TeacherModel.objects.filter(tphone=data['phone']).update(grade=data['grade'])
        return HttpResponse(True)

# pages/mydata/mydata.js
@csrf_exempt
def updateSGrade(request):
    if request.method=='POST':
        data = JSONParser().parse(request)
        StudentModel.objects.filter(sphone=data['phone']).update(grade=data['grade'])
        return HttpResponse(True)        


# pages/login/login.js        
@csrf_exempt
def islogin(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        state= data["state"]
        phone= data["phone"]
        password=data["password"]
        users=UserModel.objects.filter(phone=phone,password=password,state=state)
        if users.__len__():
            return HttpResponse(True)
        else:
            return  HttpResponse(False)



# myrelease/release.js
@csrf_exempt
def deletereleasebyid(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        print data
        RETeacherModel.objects.filter(id=data['id']).delete()
        return  HttpResponse(True)


# add_release/add_release.js
@csrf_exempt
def teacheraddrelease(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        print data
        record=RETeacherModel(tphone_id=data['tphone_id'],price=data['price'],time=data['time'],state=data['state'],subject=data['subject'],generate=data['generate'])
        record.save()
        return  HttpResponse(True)


# add_release/add_release.js
@csrf_exempt
def studentaddrelease(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        print data
        record=REStudentModel(sphone_id=data['sphone_id'],price=data['price'],time=data['time'],state=data['state'],subject=data['subject'],times=data['times'],generate=data['generate'])
        record.save()
        return  HttpResponse(True)


# register/register.js
@csrf_exempt
def register(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        print data
        # isExist=UserModel.objects.filter(phone=data['phone'])
        if data['headImg']=='noHead':
            fileName='api/static/images/head.png'.encode('utf-8')
        else:
            fileName=download_img(data['headImg'].encode('utf-8'),data['phone'].encode('utf-8'))
        print fileName
        record=UserModel.objects.filter(phone=data['phone'],password=data['password'],state=data['state'])
        if record.__len__():
            return  HttpResponse(False)
        else:
            record=UserModel.objects.create(phone=data['phone'],password=data['password'],state=data['state'])
            record.save()
        if data['state']==0:
            print 1
            TeacherModel.objects.create(name='未填写',grade='未填写',education='未填写',city='江苏省,扬州市,邗江区',major='未填写',gender=0,tphone=data['phone'],headImg=fileName,character='未进行',introduction='空空如也',package=0,level=0)
        if data['state']=='1':
            print 2
            StudentModel.objects.create(name='未填写',grade='未填写',address='未填写',city='江苏省,扬州市,邗江区',gender=0,sphone=data['phone'],headImg=fileName,character='未进行',introduction='空空如也',package=0,level=0)
        return  HttpResponse(True)
        # try:
        #     record=UserModel(phone=data['phone'],password=data['password'],state=data['state'])
        #     record.save()
        # except Exception as e:
        #     return HttpResponse(False)
        # else:
        #     if data['state']==0:
        #         cul=TeacherModel(name='未填写',grade='未填写',education='未填写',major='未填写',gender=0,tphone=data['phone'],headImg=data['headImg'],character='未进行',introduction='空空如也',package=0)
        #         cul.save()
        #     if data['state']=='1':
        #         cul=StudentModel(name='未填写',grade='未填写',address='未填写',gender=0,sphone=data['phone'],headImg=data['headImg'],character='未进行',introduction='空空如也',package=0)
        #         cul.save()
        #     return  HttpResponse(True)
            

 
# pages/service/service.js
@csrf_exempt
def RETeacher_list_sub(request,sub):
    if request.method == 'GET':
        if sub=='0':
            record=RETeacherModel.objects.all()
            total=ReTeacherInfo(record)
    	else:
            csname = CategorySecondModel.objects.get(csid=sub).csname
            record=RETeacherModel.objects.filter(subject=csname)
            total=ReTeacherInfo(record)
        data = serializer(total,output_type='json')
        return HttpResponse(data)


# pages/service/service.js
@csrf_exempt
def REStudent_list_sub(request,sub):
    if request.method == 'GET':
        if sub=='0':
            record=REStudentModel.objects.all()
            total=ReStudentInfo(record)
        else:
            csname = CategorySecondModel.objects.get(csid=sub).csname
            record=REStudentModel.objects.filter(subject=csname)
            total=ReStudentInfo(record)
        data = serializer(total,output_type='json')
        return HttpResponse(data)


# pages/service/service.js
@csrf_exempt
def subject_list(request):
    total = []
    if request.method=='GET':
        category=CategoryModel.objects.all()
        categorysecond=CategorySecondModel.objects.all()
        total.append(category)
        total.append(categorysecond)
        data = serializer(total, output_type='json')
        return HttpResponse(data)


#confirm_order/confirm_order.js
@csrf_exempt
def appoint_add(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        print data
        record=AppointModel(price=data["price"],times=data["times"],state=data["state"],time=data["time"],
         generate=data["generate"],comment=data["comment"],sphone_id=data["sphone_id"],tphone_id=data["tphone_id"],subject=data["subject"],is_pay=0)
        record.save()
        return HttpResponse(True)
    return  HttpResponse(False)


#undefined
@csrf_exempt
def confirmmsg(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        print data
        MessageModel.objects.filter(receive=data['receive'],generate=data['generate']).update(state=1)
        AppointModel.objects.filter(tphone_id=data['receive'],generate=data['generate']).update(state=1)
        return HttpResponse(True)


# pages/service/service.js
@csrf_exempt
def csname_list(request):
    total = []
    if request.method=='GET':
        categorysecond=CategorySecondModel.objects.all()
        for each in categorysecond:
            total.append(each.csname)
        data = serializer(total, output_type='json')
        return HttpResponse(data)

    
# pages/service/service.js   
@csrf_exempt
def selectbyname(request):
    if request.method=='POST':
        data = JSONParser().parse(request)
        if data['state']=='1':
            try:
                student=StudentModel.objects.get(name=data['name'])
                record=student.restudentmodel_set.all()
                total=ReStudentInfo(record)
            except:
                return HttpResponse([])
        if data['state']==0:
            try:
                teacher=TeacherModel.objects.get(name=data['name'])
                record=teacher.reteachermodel_set.all()
                total=ReTeacherInfo(record)
            except:
                return HttpResponse([])
	    info = serializer(total,output_type='json')
    return HttpResponse(info)



@csrf_exempt
def cancelmsg(request):
    if request.method == "POST":
        data = JSONParser().parse(request)
        print data
        record=MessageModel(state=2,send=data['tphone'],receive=data['sphone'],generate=data['generate'])
        record.save()
        return HttpResponse(True)

# main_page/main.js
@csrf_exempt
def get_s_appoint(request,tphone,state):
    if request.method=="GET":
        record=AppointModel.objects.filter(tphone_id=tphone,state=state)
        total=StudentAppointInfo(record)
        print total
        data = serializer(total, output_type='json')
        return HttpResponse(data)


# main_page/main.js
@csrf_exempt
def get_t_appoint(request,sphone,state):
    if request.method=="GET":
        record=AppointModel.objects.filter(sphone_id=sphone,state=state)
        total=TeacherAppointInfo(record)
        data = serializer(total, output_type='json')
        return HttpResponse(data)

# comment_page/comment.js
@csrf_exempt
def comment_add(request):
    if request.method=='POST':
        data = JSONParser().parse(request)
        print data
        record=AppointModel.objects.filter(id=data['id']).update(comment=data['comment'])
        return HttpResponse(True)


# main_page/main.js
@csrf_exempt
def message_add(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        record=MessageModel(state=data["state"],message=data["message"],send=data["send"],receive=data["receive"],generate=data["generate"])
        record.save()
        return HttpResponse(True)
    return  HttpResponse(False)
def images(request,path):
    return render(request, 'images.html', {'imagepath': path})


# main_page/main.js
@csrf_exempt
def appoint_accept(request,id):
    AppointModel.objects.filter(id=id).update(state=2)
    return HttpResponse(True)


# main_page/main.js
@csrf_exempt
def appoint_refuse(request,id):
    AppointModel.objects.filter(id=id).delete()
    return HttpResponse(True)


# main_page/main.js
@csrf_exempt
def appoint_pay(request,id):
    AppointModel.objects.filter(id=id).update(is_pay=1)
    return HttpResponse(True)


# main_page/main.js
@csrf_exempt
def appoint_finish(request,id):
    data = JSONParser().parse(request)
    tphone=0
    print data
    record=AppointModel.objects.filter(id=id).update(state=3)
    record1=AppointModel.objects.get(id=id)
    record1.tphone.package=record1.tphone.package+data
    print record1.tphone.package
    record1.tphone.save()
    record1.tphone.level=record1.tphone.level+100
    record1.sphone.level=record1.sphone.level+100
    record1.tphone.save()
    record1.sphone.save()
    return HttpResponse(True)


# cancel_order/cancel.js
@csrf_exempt
def get_appoint_by_id(request,id):
    if request.method=="GET":
        record=AppointModel.objects.filter(id=id)
        total=StudentAppointInfo(record)
        data = serializer(total, output_type='json')
        return HttpResponse(data)

## cancel_order/cancel.js
@csrf_exempt
def refund_add(request,id):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        AppointModel.objects.filter(id=id).update(refund_times=data["refund_times"],refund_reason=data["refund_reason"],refund_price=data["refund_price"],is_pay=2)
        return HttpResponse(True)


# cancel_order/cancel_detail.js
@csrf_exempt
def refund_accept(request,id):
    record=AppointModel.objects.get(id=id)
    record.state=3
    record.is_pay=3
    add_package=record.sphone.package+record.refund_price
    print add_package
    record.sphone.package=add_package
    record.sphone.save()
    record.tphone.level=record.tphone.level-50
    record.sphone.level=record.sphone.level-50
    record.save()
    return HttpResponse(True)


# cancel_order/cancel_detail.js
@csrf_exempt
def refund_refuse(request,id):
    AppointModel.objects.filter(id=id).update(is_pay=1)
    return HttpResponse(True)


@csrf_exempt
def getnewmsg(request):
    if request.method == 'POST':
        total=[]
        d={}
        data = JSONParser().parse(request)
        print data
        cul=MessageModel.objects.filter(receive=data['receive'],state=0)
        for each in cul:
            print  each.id
            print 'receive='+each.receive+'send='+each.send
            if data['state']==0:
                record=StudentModel.objects.get(sphone=each.send)
            else:
                record=TeacherModel.objects.get(tphone=each.send)
            d={'name':record.name,'message':each.message,'generate':each.generate,'state':each.state,'id':each.id,'send':each.send}
            total.append(d)
        records = serializer(total, output_type='json')
        return HttpResponse(records)



@csrf_exempt
def getoldmsg(request):
    if request.method == 'POST':
        total=[]
        d={}
        data = JSONParser().parse(request)
        print data
        cul=MessageModel.objects.filter(receive=data['receive'],state=1)
        print cul
        for each in cul:
            if data['state']==0:
                record=StudentModel.objects.get(sphone=each.send)
            else:
                record=TeacherModel.objects.get(tphone=each.send)
            d={'name':record.name,'message':each.message,'generate':each.generate,'state':each.state,'id':each.id,'send':each.send}
            total.append(d)
        records = serializer(total, output_type='json')
        return HttpResponse(records)


# loginbymsg/loginbymsg.js
@csrf_exempt
def loginbymsg(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        #print data['phone']
        record=UserModel.objects.get(phone=data['phone'],state=data['state'])
        #print record
        return HttpResponse("true")


# pages/one/index.js
@csrf_exempt
def searchSubject(request):
    total=[]
    if request.method=='POST':
        data=JSONParser().parse(request)
        csname=data['csname']
        data=CategorySecondModel.objects.filter(csname=csname)
        for each in data:
            d={'csname':each.csname,'cid':each.cid,'csid':each.csid}
            total.append(d)
        records = serializer(total, output_type='json')
        return HttpResponse(records)



# pages/login/forgetpsd.js
@csrf_exempt
def forgetpsd(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        print data['phone']
        UserModel.objects.filter(phone=data['phone']).update(password=data['password'])
        record=UserModel.objects.filter(phone=data['phone'])
        print record
        for each in record:
            return HttpResponse('true')
        return HttpResponse("false")


@csrf_exempt
def readmsg(request,id):
    if request.method == 'GET':
        MessageModel.objects.filter(id=id).update(state=1)
        return HttpResponse(True)


# detail/detail.js
@csrf_exempt
def get_comment(request):
    total=[]
    d={}
    if request.method == 'POST':
        data = JSONParser().parse(request)
        result=AppointModel.objects.filter(tphone_id=data['phone'],state=3,subject=data['subject'])
        for each in result:
            sphone = each.sphone_id
            records = StudentModel.objects.filter(sphone=sphone)
            print each.comment
            allstar=each.comment[0]+each.comment[2]+each.comment[4]
            allstar.encode('utf-8')
            allstars=int(allstar[0])+int(allstar[1])+int(allstar[2])
            stars=round(allstars/3)
            print allstars
            comment=each.comment[6:]
            for each1 in records:
				url=apiUrl+each1.headImg.url[4:]
				url=url.decode()
				print type(url)
				d = {'name': each1.name,'stars':stars,
				'generate': each.generate, 'comment':comment,'headImg':url
				}
            total.append(d)
    data = serializer(total, output_type='json')
    return HttpResponse(data)


@csrf_exempt
def t_image(request):
    if request.method == "POST":
        print(request.FILES)
        image=request.FILES
        info=request.POST
        record=TeacherModel.objects.get(tphone=info['tphone'])
        record.headImg=image['avatar']
        record.save()
        return HttpResponse('upload ok!')

@csrf_exempt
def s_image(request):
    if request.method == "POST":
        print(request.FILES)
        image=request.FILES
        info=request.POST
        record=StudentModel.objects.get(sphone=info['sphone'])
        record.headImg=image['avatar']
        record.save()
        return HttpResponse('upload ok!')


@csrf_exempt
def gethotsubject(request):
    if request.method == "GET":
        data=[]
        query=AppointModel.objects.values('subject').annotate(count=Count('subject')).order_by('-count')[0:8]
        for i in query:
            csname=i['subject']
            record=CategorySecondModel.objects.filter(csname=csname)
            print record
            for j in record:
                clogo=apiUrl+j.clogo
                clogo.encode()
                d={'name':j.csname,'csid':j.csid,'cid':j.cid_id,'clogo':clogo}
            data.append(d)
        if data==[]:
            data=[{'name':u'高中英语','csid':13,'cid':3,'clogo':u'https://www.weixinjiajiao.cn/static/clogo/yingyu.png'},
            {'name':u'高中数学','csid':12,'cid':3,'clogo':u'https://www.weixinjiajiao.cn/static/clogo/shuxue.png'},
            {'name':u'高中语文','csid':11,'cid':3,'clogo':u'https://www.weixinjiajiao.cn/static/clogo/yuwen.png'},
            {'name':u'高中物理','csid':14,'cid':3,'clogo':u'https://www.weixinjiajiao.cn/static/clogo/wuli.png'},
            {'name':u'高中化学','csid':15,'cid':3,'clogo':u'https://www.weixinjiajiao.cn/static/clogo/huaxue.png'},
            {'name':u'高中生物','csid':16,'cid':3,'clogo':u'https://www.weixinjiajiao.cn/static/clogo/shengwu.png'},
            {'name':u'高中历史','csid':17,'cid':3,'clogo':u'https://www.weixinjiajiao.cn/static/clogo/lishi.png'},
            {'name':u'高中政治','csid':18,'cid':3,'clogo':u'https://www.weixinjiajiao.cn/static/clogo/zhengzhi.png'}]
        data = serializer(data, output_type='json')
        return HttpResponse(data)


@csrf_exempt
def pay_jsapi(request):
    """微信网页支付请求发起"""
    if request.META.has_key('HTTP_X_FORWARDED_FOR'):
        ip =  request.META['HTTP_X_FORWARDED_FOR']
    else:
        ip = request.META['REMOTE_ADDR']
    payInfo = JSONParser().parse(request)
    total_fee=payInfo['total_fee']*100
    openid=payInfo['openid']
    # try:
    #     out_trade_no = pay.nonce_str
    #     raw = pay.unified_order(trade_type="JSAPI", openid=openid, body=u"测试", out_trade_no=out_trade_no, total_fee=2, attach="other info",spbill_create_ip=ip)
    #     print raw
    #     #new_raw={"appid":raw.appid,"mch_id":raw.mch_id,"sign":raw.sign,"return_msg":raw.return_msg,"return_code":raw.return_code,
    #     #"nonce_str":raw.nonce_str,"prepay_id":raw.prepay_id,"trade_type":raw.trade_type}
    #     #data=serializer(new_raw, output_type='json')
    # except WeixinError, e:
    #     print(e.message)
    #     return e.message, 400
    # if (raw['return_code']=="SUCCESS") and (raw['result_code']=="SUCCESS"):
    try:
        out_trade_no = pay.nonce_str
        raw = pay.jsapi(openid=openid, body=u"课时费", out_trade_no=out_trade_no, total_fee=total_fee, attach="other info")
        print raw
        raw={"timeStamp":raw['timeStamp'].decode('utf-8'),"nonceStr":raw['nonceStr'],"appId":raw['appId'].decode('utf-8'),"sign":raw['sign'].decode('utf-8'),"package":raw['package']}
        print raw
        data=serializer(raw,output_type='json')
        return HttpResponse(data)
    except WeixinError, e:
        print e
        return HttpResponse("false")



def group_by(query_set, group_by):
    django_groups = query_set.values(group_by).annotate(Count(group_by))
    groups = []
    for dict_ in django_groups:
        groups.append(dict_.get(group_by))
    return groups

@csrf_exempt
def enterprise_pay(request):
    payInfo = JSONParser().parse(request)
    total_fee=payInfo['total_fee']*100
    openid=payInfo['openid']
    phone=payInfo['phone']
    print phone
    try:
        raw=wx_pay.enterprise_payment(
            # 证书获取方法请阅读：https://pay.weixin.qq.com/wiki/doc/api/tools/cash_coupon.php?chapter=4_3
            # api_cert_path: 微信支付商户证书（apiclient_cert.pem）的本地保存路径
            api_cert_path='C:/cert/apiclient_cert.pem',
            # api_cert_path: 微信支付商户证书（apiclient_key.pem）的本地保存路径
            api_key_path='C:/cert/apiclient_key.pem',
            openid=openid,  # 要接收转账的用户openid
            check_name=False,    # 是否强制校验收款用户姓名
            # 如果check_name为True，下面re_user_name必须传入
            # 如果check_name为False，请删除下一行参数re_user_name
            #   # 校验不成功付款会是失败
            amount=total_fee,  # amount 单位是 分， 100 = 1元, 单用户 单笔上限／当日上限：2W／2W
            desc=u'课时费', # 付款原因
            spbill_create_ip='115.159.214.117',  # 调用微信企业付款接口服务器公网IP地址
        )
    except WxPayError,e:
        print e
        return HttpResponse("false")
    print raw
    TeacherModel.objects.filter(tphone=phone).update(package=0)
    StudentModel.objects.filter(sphone=phone).update(package=0)
    raw={"return_msg":raw['return_msg'],"return_code":raw['return_code'].decode('utf-8'),"result_code":raw['result_code'].decode('utf-8')}
    data=serializer(raw,output_type='json')
    return HttpResponse(data)

@csrf_exempt 
def get_hot_teacher(request):
    data=[]
    hot_teacher=TeacherModel.objects.all().order_by("-level")[0:8]
    print hot_teacher
    for i in hot_teacher:
        url=apiUrl+i.headImg.url[4:]
        url=url.decode()
        print url
        d={"url":url,"name":i.name,"tphone":i.tphone}
        data.append(d)
    data=serializer(data,output_type='json')
    return HttpResponse(data)


@csrf_exempt 
def updateCharacter(request):
    data = JSONParser().parse(request)
    fivecharacter=map(str,data['fivecharacter'])
    fivecharacter=','.join(fivecharacter)
    if data['state']==0:
        print 0
        TeacherModel.objects.filter(tphone=data['phone']).update(character=data['character'],fivecharacter=fivecharacter)
    if data['state']=='1':
        print 1
        StudentModel.objects.filter(sphone=data['phone']).update(character=data['character'],fivecharacter=fivecharacter)
    return HttpResponse(True)

@csrf_exempt 
def getFiveCharacter(request):
    data = JSONParser().parse(request)
    if data['state']==0:
        print 0
        fivecharacter=TeacherModel.objects.get(tphone=data['phone']).fivecharacter.split(',')
    if data['state']=='1':
        print 1
        fivecharacter=StudentModel.objects.get(sphone=data['phone']).fivecharacter.split(',')
    data=serializer(fivecharacter,output_type='json')
    return HttpResponse(data)


@csrf_exempt 
def retest(request):
    data = JSONParser().parse(request)
    if data['state']==0:
        print 0
        TeacherModel.objects.filter(tphone=data['phone']).update(character='未进行')
    if data['state']=='1':
        print 1
        StudentModel.objects.filter(sphone=data['phone']).update(character='未进行')
    data=serializer(fivecharacter,output_type='json')
    return HttpResponse(data)

@csrf_exempt 
def getOpenid(request):
    data = JSONParser().parse(request)
    url=data['url']
    req=urllib.urlopen(url)
    res=req.read()
    print res
    return HttpResponse(res)