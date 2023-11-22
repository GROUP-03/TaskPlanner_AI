import json
import nltk
from nltk.tokenize import sent_tokenize
import boto3
import datetime
import os
from openai import OpenAI
import uuid

nltk.data.path.append('/tmp/nltk_data')
nltk.download('punkt', download_dir='/tmp/nltk_data')

def lambda_handler(event, context):
    #Reading s3 event details and file content
    record = event['Records'][0]
    
    s3bucketname = record['s3']['bucket']['name']
    s3objectname = record['s3']['object']['key']
    
    s3 = boto3.client('s3',region_name='us-east-2')
   
    metadataresponse = s3.head_object(Bucket=s3bucketname, Key=s3objectname)
    meetingagenda=metadataresponse['Metadata']['meetingagenda']
    email=metadataresponse['Metadata']['email']
    
    response = s3.get_object(Bucket=s3bucketname, Key=s3objectname)

    filedata = response['Body'].read()
    text=json.loads(filedata)
    transcriptedtext = text['results']['transcripts'][0]['transcript']

    lowercase_text=transcriptedtext.lower()
    
    #task extraction process
    
    #load keywords from environmental variables
    task_words =os.environ['TASK_KEYWORDS']
    deadline_keywords = os.environ['DEADLINE_KEYWORDS']
    valid_sentence=''
    sentencesToken = sent_tokenize(lowercase_text)
   
    for sentence in sentencesToken:
      contains_taskkeyword = any(word in sentence for word in task_words) 
      contains_deadline_keyword=any(word in sentence for word in deadline_keywords)

      if contains_taskkeyword==True and contains_deadline_keyword==True: 
            valid_sentence=valid_sentence+sentence
            
    #Calling open AI to extract task details


    client = OpenAI(
    api_key=os.environ['OPENAPI_KEY']
    )

    completion = client.chat.completions.create(
    model="gpt-3.5-turbo",
  messages=[
    {"role": "user", "content": f"Identify assignee, deadline in YYYY-MM-dd format and task from following sentences and write it in json format in a key named task_info {valid_sentence}"}
  ]
)

    content=completion.choices[0].message.content

    task_details= json.loads(content)
    
    #Storing task details in dynamo db
    resource=boto3.resource('dynamodb')
    taskdetail  = resource.Table('Task_detail')

    with taskdetail.batch_writer() as writer:
     for data in task_details.get('task_info'):
        assignee = data.get('assignee').title()
        deadline = data.get('deadline')
        task = data.get('task').title()
        writer.put_item(Item={
           'assignee'     : assignee,
           'deadline' :deadline,
           'createdDate':datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
           'uid':str(uuid.uuid4()),
           'task':task,
           'email':email,
           'meetingagenda':meetingagenda


            }
         )

    return {
        'statusCode': 200,
        'body': json.dumps('Task extraction done')
    }