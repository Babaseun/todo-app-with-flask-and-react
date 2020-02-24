from __main__ import db


class User(db.Model):
    id = db.Column(db.String, unique=True, nullable=False, primary_key=True)
    name = db.Column(db.String, nullable=False)
    email = db.Column(db.String, nullable=False, unique=True)
    password = db.Column(db.String, nullable=False)
    created_at = db.Column(db.String)

    def __repr__(self):
        return f"{self.id} {self.name}"


class Todos(db.Model):
    id = db.Column(db.String, unique=True, nullable=False, primary_key=True)
    todo = db.Column(db.String, nullable=False)
    created_at = db.Column(db.String)
    owner_id = db.Column(db.String, db.ForeignKey(
        User.id, ondelete="CASCADE"), nullable=False)
    completed = db.Column(db.Integer)

    def __repr__(self):
        return f"({self.id},{self.todo},{self.created_at})"
