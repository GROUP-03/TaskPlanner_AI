# importing nessorcy packages and config file that contains keys for connecting to aws 
from boto3 import resource 
import config

# creating instances of dynamo db
resource = resource(
    'dynamodb',
    aws_access_key_id     = config.AWS_ACCESS_KEY_ID,
    aws_secret_access_key = config.AWS_SECRET_ACCESS_KEY,
    region_name           = config.REGION_NAME
) 
# referencing to Logininfo table in dynamo db
login_info = resource.Table('LoginInfo')

# retriving password of user stored in db
def user_authentication(email):
    response = login_info.get_item(
        Key = {
            'email':email
        },
        AttributesToGet = [
            'password' 
        ]                      
    )
    print(response)
    # returing responce
    return response