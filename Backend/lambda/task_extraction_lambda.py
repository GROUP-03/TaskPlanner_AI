import json
import nltk
from nltk.tokenize import sent_tokenize
import boto3
import datetime
import os
from openai import OpenAI
import uuid
import string

#reference:https://www.nltk.org/book/ch07.html
nltk.data.path.append('/tmp/nltk_data')
nltk.download('punkt', download_dir='/tmp/nltk_data')

def lambda_handler(event, context):
    #Reading s3 event details and file content
    record = event['Records'][0]
    
    s3bucketname = record['s3']['bucket']['name']
    s3objectname = record['s3']['object']['key']
    
    s3 = boto3.client('s3',region_name='us-east-2')

     
   #get attributes from s3 object metadata
    metadataresponse = s3.head_object(Bucket=s3bucketname, Key=s3objectname)
    meetingagenda=metadataresponse['Metadata']['meetingagenda']
    email=metadataresponse['Metadata']['email']

    #read file content
    response = s3.get_object(Bucket=s3bucketname, Key=s3objectname)

    filedata = response['Body'].read()
    text=json.loads(filedata)
    transcriptedtext = text['results']['transcripts'][0]['transcript']

    lowercase_text=(transcriptedtext.translate
    (str.maketrans('', '', string.punctuation))).lower()
    currentyear=datetime.datetime.now().strftime("%Y")
    
    #task extraction process
    resource=boto3.resource('dynamodb')
    taskdetail  = resource.Table('Task_detail')

    #Define keywords 
    task_words =['assignment', 'assignments', 'homework', "submission", "task"]
    deadline_keywords =["completed by", "finish by", "due on", "scheduled for", "deadline", "duedate", "week","tommorrow"]
    valid_sentence=''
    sentencesToken = sent_tokenize(lowercase_text)

   #check if sentences are having both deadline and task_words keywords
    for sentence in sentencesToken:
      contains_taskkeyword = any(word in sentence for word in task_words) 
      contains_deadline_keyword=any(word in sentence for word in deadline_keywords)

      if contains_taskkeyword==True and contains_deadline_keyword==True: 
            #print("valid_sentence before value",valid_sentence)
            valid_sentence=valid_sentence+sentence
            #print("valid_sentence after value",valid_sentence)
            
   #if sentence does not have both deadline and task keywords enter No Task Found data in table
    if len(valid_sentence)==0:
       print("No task information found")
       taskdetail.put_item(Item={
           'assignee'     : 'NA',
           'deadline' :'NA',
           'createdDate':datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%S.000Z"),
           'uid':str(uuid.uuid4()),
           'task':'No Task Found',
           'email':email,
           'meetingagenda':meetingagenda


            }
         )
       
       print("No valid sentence found data inserted to db")

     #Calling open API to extract task details
     #reference:https://platform.openai.com/docs/quickstart?context=python

     #if sentence have both deadline and task keywords call open AI and store task data in dynamodb table
    else:
       
        client = OpenAI(
        api_key=os.environ['OPENAPI_KEY']
        )

        completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
        {"role": "user", "content": f"Identify assignee, deadline in dd/MM/YYYY format and task from following sentences and write it in json format in a key named task_info {lowercase_text}. If the year is not mentioned, please use {currentyear} as year." } 
         ]
        )

        content=completion.choices[0].message.content

        task_details= json.loads(content)
    
        #Storing task details in dynamo db
        
        #reference:https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/dynamodb/table/batch_writer.html
        with taskdetail.batch_writer() as writer:
         for data in task_details.get('task_info'):
            print("data",data)
            assignee = data.get('assignee').title()
            deadline = data.get('deadline')
            task = data.get('task').title()
            writer.put_item(Item={
           'assignee'     : assignee,
           'deadline' :deadline,
           'createdDate':datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%S.000Z"),
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



