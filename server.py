import Helper
import uuid
from flask import Flask, request, jsonify, g
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db.sqlite3"
CORS(app)


db = SQLAlchemy(app)

from models import User, Todos
from middleware import get_user

@app.route('/api/v1/register', methods=['POST'])
def register():
    data = request.get_json()
    user_exists = User.query.filter_by(email=data['email']).first()

    if user_exists:
        return jsonify({"message": "User already registered"}), 400
    else:
        _ID = str(uuid.uuid4())
        password = bytes(data['password'], 'utf-8')
        hashedPassword = Helper.hashPassword(password)

        try:
            new_user = User(
                id=_ID, name=data['name'], email=data['email'], password=hashedPassword)
            db.session.add(new_user)
            db.session.commit()
        except KeyError as e:
            return jsonify({"message": "All Fields are required"}), 400

        token = Helper.generateToken(_ID)

        return jsonify({"token": token}), 200


@app.route('/api/v1/login', methods=['POST'])
def login():
    data = request.get_json()
    user_exists = User.query.filter_by(email=data['email']).first()

    if user_exists:
        password = bytes(data['password'], 'utf-8')
        match = Helper.comparePassword(password, user_exists.password)

        if match:
            token = Helper.generateToken(user_exists.id)

            return jsonify({"token": token}), 200

        else:

            return jsonify({"message": "Either email or password is incorrect"}), 400

    else:
        return jsonify({"message": "User is not registered"}), 400


@app.route('/api/v1/user/<string:ID>', methods=['DELETE'])
@get_user
def delete_user(ID):

    user_exists = User.query.filter_by(id=ID, owner_id=g.user['id']).first()
    if user_exists:
        db.session.delete(user_exists)
        db.session.commit()

        return jsonify({"message": "Deleted"}), 200

    else:
        return jsonify({"message": "User is not registered"}), 400


@app.route('/api/v1/todos', methods=['POST', 'GET'])
@get_user
def todos():
    if request.method == "POST":
        try:
            data = request.get_json()
            _ID = str(uuid.uuid4())
            new_todo = Todos(id=_ID, todo=data['todo'], owner_id=g.user['id'],
                             created_at=data['created_at'], completed=data['completed'])

            db.session.add(new_todo)
            db.session.commit()

            return jsonify({"message": "Todo added successfully"}), 201

        except Exception as e:
            print(e)
            return jsonify({"message": "Todo not added"}), 400

    else:
        try:

            all_todos = Todos.query.filter_by(owner_id=g.user['id']).all()
            username = User.query.filter_by(id=g.user['id']).first()
            if all_todos:
                arr_of_todos = []
                pairs = {}
                for todo in all_todos:
                    pairs = {"id": todo.id,
                             "todo": todo.todo,
                             "created_at": todo.created_at,
                             "completed": todo.completed,
                             "owner_id": todo.owner_id}

                    arr_of_todos.append(pairs)

                return jsonify({"username": username.name}, {"todos": arr_of_todos}), 200

            else:

                return jsonify({"username": username.name}, {"message": "You have not added any todo"}), 200

        except Exception as e:
            print(e)
            return jsonify({"message": "Todo Error"}), 400


@app.route('/api/v1/todos/<string:ID>', methods=['DELETE', 'PUT'])
@get_user
def update_todo_completed(ID):
    if request.method == "DELETE":
        try:
            todo = Todos.query.filter_by(id=ID, owner_id=g.user['id']).first()
            db.session.delete(todo)
            db.session.commit()
            return jsonify({"message": "Todo deleted successfully"}), 200
        except Exception as e:
            print(e)
    else:
        try:
            update = request.get_json()
            todo = Todos.query.filter_by(id=ID, owner_id=g.user['id']).first()

            todo.completed = update['completed']
            db.session.commit()

            return jsonify({"message": "Todo updated successfully"}), 200
        except Exception as e:
            print(e)
            return jsonify({"message": "Error updating todo"}), 400


@app.route('/api/v1/todos/update/<string:ID>', methods=['PUT'])
@get_user
def update_todo(ID):

    try:
        update = request.get_json()
        todo = Todos.query.filter_by(id=ID, owner_id=g.user['id']).first()

        todo.todo = update['todo']
        db.session.commit()

        return jsonify({"message": "Todo updated successfully"}), 200
    except Exception as e:
        print(e)
        return jsonify({"message": "Error updating todo"}), 400


if __name__ == "__main__":
    app.run(debug=True)
