from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  
# MySQL Database Configuration (Use your MySQL credentials here)
app.config['SQLALCHEMY_DATABASE_URI']='mysql://root:123456@localhost/ticket'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database
db = SQLAlchemy(app)

# Models
class Ticket(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String(100), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(20), default='Open')
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

# Routes
@app.route('/tickets', methods=['POST'])
def create_ticket():
    data = request.json
    ticket = Ticket(
        user_name=data['user_name'],
        title=data['title'],
        description=data['description'],
        category=data['category']
    )
    db.session.add(ticket)
    db.session.commit()
    return jsonify({"message": "Ticket created successfully"}), 201

@app.route('/tickets', methods=['GET'])
def get_tickets():
    tickets = Ticket.query.all()
    result = [
        {
            "id": ticket.id,
            "user_name": ticket.user_name,
            "title": ticket.title,
            "description": ticket.description,
            "category": ticket.category,
            "status": ticket.status,
            "created_at": ticket.created_at
        } for ticket in tickets
    ]
    return jsonify(result)

if __name__ == '__main__':
    # Ensure app context for creating tables
    with app.app_context():
        db.create_all()  # Create tables in the database
    app.run(debug=True)
