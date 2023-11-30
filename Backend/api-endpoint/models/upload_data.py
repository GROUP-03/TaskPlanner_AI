from boto3 import resource
import config
import boto3
import datetime

# creating instance of dynamo db
resource = resource(
    'dynamodb',
    aws_access_key_id     = config.AWS_ACCESS_KEY_ID,
    aws_secret_access_key = config.AWS_SECRET_ACCESS_KEY,
    region_name           = config.REGION_NAME
)

# referencing to UploadDetail table in dynamo db
upload_detail  = resource.Table('UploadDetail')
input_bucket='input-taskplanner'

#Uploading recording to s3 location  
def recording_upload(file_object,filename,meetingAgenda,email,audioLanguage):
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
            "audioLanguage":audioLanguage

           
        }
    })
        return True
   except Exception as e:
        print(f"Error in uploading file to s3: {str(e)}")
        return False

#inserting upload details in dynamo db
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
   
    
