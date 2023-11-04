

from flask import Flask

# Flask application
app = Flask(__name__)
 

#Validate User
@app.route('/login', methods=['POST'])
def user_authentication():
    return {'Message': 'Testing login endpoint'}

#Register User

@app.route('/register', methods=['POST'])
def register_user():
    return {'Message': 'Testing register endpoint'}


#Upload data

@app.route('/upload', methods=['POST'])
def upload_data():
   return {'Message': 'Testing upload endpoint'}

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