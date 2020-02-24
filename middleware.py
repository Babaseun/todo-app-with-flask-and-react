from functools import wraps
from flask import g,Response,request
import Helper
from models import User

def get_user(f):
    @wraps(f)
    def func_wrapper(*args,**kwargs):
        try:
           token = request.headers['X-Access-Token']
           
           decoded = Helper.verifyToken(token)
              
           try:
                
                    user = User.query.filter_by(id=decoded['userID']).first()
                    
                    if user:
                       g.user = {'id':decoded["userID"]}

                    else:
                       return {"message":"Un-Authorized"},401
               
           except TypeError as e:
               return decoded,400
             
           
        except KeyError as e:
            return {"message":"No Token Provided"}
       
        return f(*args,**kwargs)
    return func_wrapper
