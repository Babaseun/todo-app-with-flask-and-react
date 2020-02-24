import jwt
import bcrypt


def generateToken(ID):

    token = jwt.encode({"userID": ID}, "secret")
    return str(token.decode('utf-8'))


def verifyToken(token):
    if not token:
        return "No token provided"
    else:
        try:
            decoded = jwt.decode(token, "secret")
            return decoded
        except Exception as e:
            return ({"message": "Invalid Token was provided"}, 400)


def hashPassword(password):
    hashed_password = bcrypt.hashpw(password, bcrypt.gensalt(rounds=8))
    return hashed_password


def comparePassword(password, hashedPassword):
    return bcrypt.checkpw(password, hashedPassword)
