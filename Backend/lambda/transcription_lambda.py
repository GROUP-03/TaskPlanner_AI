import boto3
import datetime
def lambda_handler(event, context):
    
    record = event['Records'][0]
    
    s3bucketname = record['s3']['bucket']['name']
    s3objectname = record['s3']['object']['key']
    
    s3filelocation = f's3://{s3bucketname}/{s3objectname}'
    
    timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
    
    # Appending the timestamp to the s3objectname
    transcriptionjob = f'{s3objectname}-{timestamp}'
    
    transcriptedoutput = f'{s3objectname}-transcript.json'
    s3outputbucket = 'transcripted-output-taskplanner'
    
    client = boto3.client('transcribe')
    
    
    response = client.start_transcription_job(
        TranscriptionJobName=transcriptionjob,
        LanguageCode='en-IN',#input audio language
        Media={'MediaFileUri': s3filelocation},
        OutputBucketName=s3outputbucket,
        OutputKey=transcriptedoutput 
    )
    
    return {
        'statusCode': 200,
        'TranscriptionJobName': response['TranscriptionJob']['TranscriptionJobName']
    }
