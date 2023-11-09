from boto3 import resource
import config


resource = resource(
    'dynamodb',
    aws_access_key_id     = config.AWS_ACCESS_KEY_ID,
    aws_secret_access_key = config.AWS_SECRET_ACCESS_KEY,
    region_name           = config.REGION_NAME
)
login_info = resource.Table('LoginInfo')

def user_authentication(email):
    response = login_info.get_item(
        Key = {
            'email':email
        },
        AttributesToGet = [
            'password' # valid types dont throw error, 
        ]                      # Other types should be converted to python type before sending as json response
    )
    print(response)
    return response