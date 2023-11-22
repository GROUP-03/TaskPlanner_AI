
from models import login as getrequestdb
from models import register as dynamodb
from models import upload_data as recording_details
from models import display_planner as allplans
from models import latest_planner as latestplan
import uuid
from flask_cors import CORS
import io
import json


from flask import Flask,jsonify,request

# Flask application
app = Flask(__name__)
CORS(app)

#Validate User
@app.route('/login', methods=['POST'])
def user_authentication():
    
     data = request.get_json()
     input_password=data['password']

     response = getrequestdb.user_authentication(data['email'])   
     
     print("response")
     
     if (response['ResponseMetadata']['HTTPStatusCode'] == 200 and 'Item' in response ):
      
       password=response['Item']['password'] 
       
       if password==input_password:
        
        return {
           'Message': 'Success'
           
       }
     return { 
       'Message': 'Failed'
   }

#Register User

@app.route('/register', methods=['POST'])
def register_user():
    
     data = request.get_json()
     
     response = dynamodb.register_user(data)   
     
     
     if (response['ResponseMetadata']['HTTPStatusCode'] == 200):
       return {
           'Message': 'Success'
       }
     return { 
       'Message': 'Failed'
      
   }


#Upload data

@app.route('/upload', methods=['POST'])
def upload_data():
   data = request.form.to_dict()
   videofile = request.files['file']
   industry=data.get('industry')
   meetingAgenda=data.get('agenda')
   email=data.get('email')
   audioLanguage=data.get('audio_language')
   filename=data.get('filename')
    

   s3response=recording_details.recording_upload(videofile,filename,meetingAgenda,email,audioLanguage)
   if s3response:
      dbresponse=recording_details.recording_data(industry,meetingAgenda,email,audioLanguage,filename)
    

      if (dbresponse['ResponseMetadata']['HTTPStatusCode'] == 200):
          return {
           'Message': 'Success',
           'response': dbresponse
       }
      else:
         return {
           'Message': 'Failed'
       }
   else:
    return {
           'Message': 'Failed',
           'response': s3response
       }

#Fetching current task planner

@app.route('/getlatestplanner', methods=['POST'])
def getlatestplanner():
  
     data = request.get_json()
     
     response = latestplan.get_latest_plan(data['email'])  

     if (response['ResponseMetadata']['HTTPStatusCode'] == 200):
       return {
           'Message': 'Success',
           'response':response['Items']
       }
     return { 
       'Message': 'Failed'
      
   }

#fetching all planner created by user
@app.route('/displayallplanner', methods=['POST'])
def display_all_planner():
    
     data = request.get_json()
     
     response = allplans.display_all_taskplans(data['email'])   
     if (response['ResponseMetadata']['HTTPStatusCode'] == 200):
       return {
           'Message': 'Success',
           'response':response['Items']
       }
     return { 
       'Message': 'Failed'
      
   }
     



if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)