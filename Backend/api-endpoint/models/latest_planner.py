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

def get_latest_plan(email):
    try:
        response = taskDetail.query(
        KeyConditionExpression=Key('email').eq(email),
        ScanIndexForward=False,
        Limit=1
        )
        return response
    #response['Items']

    except Exception as e:
       print(e.response['Error']['Message'])
       return e.response