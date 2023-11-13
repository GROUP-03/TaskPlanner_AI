from boto3 import resource
import config
import boto3
import datetime


resource = resource(
    'dynamodb',
    aws_access_key_id     = config.AWS_ACCESS_KEY_ID,
    aws_secret_access_key = config.AWS_SECRET_ACCESS_KEY,
    region_name           = config.REGION_NAME
)


upload_detail  = resource.Table('UploadDetail')
input_bucket='input-taskplanner'

def recording_upload(file_object,filename,meetingAgenda,email):
   try:
        s3 = boto3.client(
            's3',
            aws_access_key_id=config.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=config.AWS_SECRET_ACCESS_KEY,
            region_name=config.REGION_NAME
        )

        response=s3.upload_fileobj(file_object,input_bucket,filename,ExtraArgs={
        "Metadata": {
            "email": email,
            "meetingAgenda": meetingAgenda,
           
        }
    })
        return True
   except Exception as e:
        print(f"Error in uploading file to s3: {str(e)}")
        return False

def recording_data(industry,meetingAgenda,email,audioLanguage,filename):
   
   response = upload_detail.put_item(
       Item = {
           'industry'     : industry,
           'meetingAgenda'  : meetingAgenda,
           'email' : email,
           'audioLanguage'  : audioLanguage,
           'createdDate'  : datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
           'filename':filename,
            's3FilePath':"s3://"+input_bucket+"/"+filename
       }
   )
 
   return response
   
    
