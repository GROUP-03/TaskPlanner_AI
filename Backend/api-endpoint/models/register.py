from boto3 import resource
import config
import datetime


resource = resource(
    'dynamodb',
    aws_access_key_id     = config.AWS_ACCESS_KEY_ID,
    aws_secret_access_key = config.AWS_SECRET_ACCESS_KEY,
    region_name           = config.REGION_NAME
)
login_info = resource.Table('LoginInfo')



def register_user(data):
    response = login_info.put_item(
            Item = {
           
           'firstName'  : data['firstName'],
           'lastName' : data['lastName'],
           'email'  : data['email'],
           'password':data['password'],
           'createdDate': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

           
       }
   )
    
    return response


