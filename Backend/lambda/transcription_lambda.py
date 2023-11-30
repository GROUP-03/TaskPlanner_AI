import boto3
import datetime
import time
def lambda_handler(event, context):
    
    record = event['Records'][0]
    
    s3bucketname = record['s3']['bucket']['name']
    s3objectname = record['s3']['object']['key']

    #fetching s3 metadata object
    s3 = boto3.client('s3',region_name='us-east-2')
    response = s3.head_object(Bucket=s3bucketname, Key=s3objectname)
    meetingagenda=response['Metadata']['meetingagenda']
    email=response['Metadata']['email']
    audiolanguage=response['Metadata']['audiolanguage']
    
    s3filelocation = f's3://{s3bucketname}/{s3objectname}'
    
    timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
    
    # Appending the timestamp to the s3objectname
    transcriptionjob = f'{s3objectname}-{timestamp}'
    
    transcriptedoutput = f'{s3objectname}-{timestamp}-transcription.json'

    s3outputbucket = 'transcribed-out-planner'

    #reference:https://medium.com/@himanshukabra2212/automating-speech-to-text-with-s3-lambda-and-amazon-transcribe-bc075d952d9e#:~:text=By%20setting%20up%20an%20S3,saved%20to%20the%20output%20bucket
    client = boto3.client('transcribe')
    
    response = client.start_transcription_job(
        TranscriptionJobName=transcriptionjob,
        LanguageCode=audiolanguage,
        Media={'MediaFileUri': s3filelocation},
        OutputBucketName=s3outputbucket,
        OutputKey=transcriptedoutput
        
    )
    
    while True:
        jobstatus = client.get_transcription_job(TranscriptionJobName=transcriptionjob)
        if jobstatus['TranscriptionJob']['TranscriptionJobStatus'] in ['COMPLETED', 'FAILED']:
            break  
        time.sleep(10)

    print("status"+jobstatus['TranscriptionJob']['TranscriptionJobStatus'])
    if jobstatus['TranscriptionJob']['TranscriptionJobStatus'] == 'COMPLETED':
    
        s3getresponse = s3.get_object(Bucket=s3outputbucket, Key=transcriptedoutput)
        content=s3getresponse['Body'].read()
    
        s3.put_object(Bucket='transcripted-withmetadata', Key=transcriptedoutput, Body=content, Metadata={
            "email": email,
            "meetingAgenda": meetingagenda
        })
        
    
    return {
        'statusCode': 200,
        'TranscriptionJobName': 'lambda'
    }
