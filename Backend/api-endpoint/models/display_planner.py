from boto3 import resource
import config
from boto3.dynamodb.conditions import Key


resource = resource(
    'dynamodb',
    aws_access_key_id     = config.AWS_ACCESS_KEY_ID,
    aws_secret_access_key = config.AWS_SECRET_ACCESS_KEY,
    region_name           = config.REGION_NAME
)
taskDetail = resource.Table('Task_detail')

def display_all_taskplans(email):
    try:
        response = taskDetail.query(
        KeyConditionExpression=Key('email').eq(email)
        )
        return response
    #response['Items']

    except Exception as e:
       print(e.response['Error']['Message'])
       return e.response