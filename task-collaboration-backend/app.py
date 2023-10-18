from flask import Flask, request, jsonify, send_from_directory

app = Flask('app')

# Route to serve static files from the "frontend" directory
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    if not path or path.endswith('/'):
        path += 'index.html'
    return send_from_directory('frontend', path)

# Routes
@app.route("/tasks", methods=["GET"])
def get_tasks():
    tasks = list(mongo.db.tasks.find())
    return jsonify({"tasks": tasks})

@app.route("/tasks", methods=["POST"])
def add_task():
    data = request.get_json()
    title = data.get("title")
    description = data.get("description")
    due_date = data.get("due_date")

    if title:
        task = {
            "title": title,
            "description": description,
            "due_date": due_date,
        }
        mongo.db.tasks.insert_one(task)
        return jsonify({"message": "Task added successfully"})
    else:
        return jsonify({"error": "Title is required"}), 400

@app.route("/tasks/<string:task_id>", methods=["GET"])
def get_task(task_id):
    task = mongo.db.tasks.find_one({"_id": ObjectId(task_id)})
    if task:
        return jsonify({"task": task})
    else:
        return jsonify({"error": "Task not found"}), 404

@app.route("/tasks/<string:task_id>", methods=["DELETE"])
def delete_task(task_id):
    result = mongo.db.tasks.delete_one({"_id": ObjectId(task_id)})
    if result.deleted_count:
        return jsonify({"message": "Task deleted successfully"})
    else:
        return jsonify({"error": "Task not found"}), 404

if __name__ == "__main__":
    app.run(debug=True)
