import json
import nltk
from nltk.tokenize import word_tokenize, sent_tokenize
import dateparser
import string
import boto3
import datetime

nltk.data.path.append('/tmp/nltk_data')
nltk.download('punkt', download_dir='/tmp/nltk_data')
nltk.download('averaged_perceptron_tagger', download_dir='/tmp/nltk_data')

def lambda_handler(event, context):
    #Reading s3 event details and file content
    record = event['Records'][0]
    
    s3bucketname = record['s3']['bucket']['name']
    s3objectname = record['s3']['object']['key']
    
    s3 = boto3.client('s3',region_name='us-east-2')

    response = s3.get_object(Bucket=s3bucketname, Key=s3objectname)

    filedata = response['Body'].read()
    text=json.loads(filedata)
    transcriptedtext = text['results']['transcripts'][0]['transcript']
    

    lowercase_text=transcriptedtext.lower()
    
    #task extraction process
    exceptions_proper_nouns = ['submission','january','february','march','april','may','june','july','august','december','november', 'october', 'september','assignment', 'project', 'uh']
    task_words = ['assignment', 'assignments', 'homework', "submission", "task"]
    deadline_keywords = ["completed by", "finish by", "due on", "scheduled for", "deadline", "duedate"]
    
    task_details={}
    validSentenceCount=0
    
    sentencesToken = sent_tokenize(transcriptedtext)
   
    for sentence in sentencesToken:
       
        finalsentence=sentence.translate(str.maketrans('', '', string.punctuation))
       
        contains_taskkeyword = any(word in finalsentence for word in task_words) 
        contains_deadline_keyword=any(word in finalsentence for word in deadline_keywords)

        if contains_taskkeyword==True and contains_deadline_keyword==True:
     
            validSentenceCount= validSentenceCount+1
            word_tokens = word_tokenize(finalsentence)
            word_postag = nltk.pos_tag(word_tokens)
       
            Assignee = None
                
            for words, pos_tag in word_postag:
                if (pos_tag in ['NNP']) and (words.lower() not in exceptions_proper_nouns):
                    Assignee = words
                   
                if(words.lower() in task_words):
                        index = word_tokens.index(words)
                        task_info_1 = word_tokens[index-1]
                        task_detail = f"{task_info_1} {words}"
                        
                    
                if(words.lower() in deadline_keywords):
                    task_deadline=dateparser.parse(sentence.split(words)[-1].strip())
                    formatted_deadline=task_deadline.strftime('%m-%d-%Y')
                    task_details[validSentenceCount] = {'assignee': Assignee, 'task': task_detail, 'deadline': formatted_deadline}

    print("Task Dictionary:", task_details)

    resource=boto3.resource('dynamodb')
    taskdetail  = resource.Table('Task_detail')

    with taskdetail.batch_writer() as writer:
        for key, value in task_details.items():
         assignee=value.get('assignee')
         task=value.get('task')
         deadline=value.get('deadline')
         writer.put_item(Item={
           'assignee'     : assignee,
           'deadline' :deadline,
           'createdDate'  : datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
           'task':task
            }
         )

    return {
        'statusCode': 200,
        'body': json.dumps('Task extraction done')
    }