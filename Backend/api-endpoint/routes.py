from models import login as getrequestdb
from models import register as dynamodb
from models import upload_data as recording_details
 
 
 
from flask import Flask,jsonify,request
 
# Flask application
app = Flask(__name__)
 
 
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
    
    #upload file to S3
    videofile=request.files['videoFile']
    industry=request.form['industry']
    meetingAgenda=request.form['meetingAgenda']
    email=request.form['email']
    audioLanguage=request.form['audioLanguage']
    filename=videofile.filename
    
 
    s3response=recording_details.recording_upload(videofile)
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
   return {'Message': 'Testing endpoint to fetch current task planner'}
 
#fetching all planner created by user
@app.route('/displayallplanner', methods=['POST'])
def displayallplanner():
   return {'Message': 'Testing endpoint to fetch all task planner'}
     
 
 
if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)