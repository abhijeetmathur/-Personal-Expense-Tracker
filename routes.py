from flask import request, jsonify
from models import Expense
from db import db

def register_routes(app):
    @app.route("/expenses", methods=["GET"])
    def get_expenses():
        expenses = Expense.query.all()
        return jsonify([{
            "id": e.id,
            "date": e.date.strftime("%Y-%m-%d"),
            "category": e.category,
            "description": e.description,
            "amount": e.amount,
            "payment_method": e.payment_method
        } for e in expenses])

    @app.route("/expenses", methods=["POST"])
    def add_expense():
        data = request.json
        new_expense = Expense(
            date=data["date"],
            category=data["category"],
            description=data["description"],
            amount=data["amount"],
            payment_method=data["payment_method"]
        )
        db.session.add(new_expense)
        db.session.commit()
        return jsonify({
            "id": new_expense.id,
            "date": new_expense.date.strftime("%Y-%m-%d"),
            "category": new_expense.category,
            "description": new_expense.description,
            "amount": new_expense.amount,
            "payment_method": new_expense.payment_method
        })

    @app.route("/expenses/<int:id>", methods=["DELETE"])
    def delete_expense(id):
        expense = Expense.query.get_or_404(id)
        db.session.delete(expense)
        db.session.commit()
        return '', 204
