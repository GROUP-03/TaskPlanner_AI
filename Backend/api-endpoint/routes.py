
from models import login as getrequestdb
from models import register as dynamodb
from models import upload_data as recording_details
from models import display_planner as allplans
from models import latest_planner as latestplan
import uuid
from flask_cors import CORS
import io


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
     
     
     if (response['ResponseMetadata']['HTTPStatusCode'] == 200):
       password=response['Item']['password'] 
       
       if password==input_password:
        print("authentication successful")
        return {
           'Message': 'Authentication Successful',
           'response': response
       }
     return { 
       'Message': 'Authentication Failed',
       'response': response
   }

#Register User

@app.route('/register', methods=['POST'])
def register_user():
    
     data = request.get_json()
     
     response = dynamodb.register_user(data)   
     
     
     if (response['ResponseMetadata']['HTTPStatusCode'] == 200):
       return {
           'Message': 'Account Created Successfully',
       }
     return { 
       'Message': 'Error in Account Creation',
       'response': response
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
    

   s3response=recording_details.recording_upload(videofile,filename,meetingAgenda,email)
   if s3response:
      dbresponse=recording_details.recording_data(industry,meetingAgenda,email,audioLanguage,filename)
    

      if (dbresponse['ResponseMetadata']['HTTPStatusCode'] == 200):
          return {
           'Message': 'Data inserted to Dynamo db',
           'response': dbresponse
       }
      else:
         return {
           'Message': 'Error in dynamo db insert',
       }
   else:
    return {
           'Message': 's3 upload error',
           'response': s3response
       }

#Fetching current task planner

@app.route('/getlatestplanner', methods=['POST'])
def getlatestplanner():
  
     data = request.get_json()
     
     response = latestplan.get_latest_plan(data['email'])   
     print(response)
     return response

#fetching all planner created by user
@app.route('/displayallplanner', methods=['POST'])
def display_all_planner():
    
     data = request.get_json()
     
     response = allplans.display_all_taskplans(data['email'])   
     print(response)
     return response
     

#need to handle error in s3 upload, if upload fails data should not be inserted in dynamo db

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)