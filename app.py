"""Flask app for Cupcakes"""

from flask import Flask, jsonify, request
from flask_debugtoolbar import DebugToolbarExtension

from models import db, connect_db, Cupcake

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///cupcakes'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True

connect_db(app)
db.create_all()

app.config['SECRET_KEY'] = "I'LL NEVER TELL!!"

# Having the Debug Toolbar show redirects explicitly is often useful;
# however, if you want to turn it off, you can uncomment this line:
#
# app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False

debug = DebugToolbarExtension(app)


@app.get("/api/cupcakes")
def list_all_cupcakes():
    """Return JSON {'cupcake': [{id, flavor, size, rating, image}, ...]}"""

    cupcakes = Cupcake.query.all()
    serialized = [c.serialize() for c in cupcakes]

    return jsonify(cupcakes = serialized)

@app.get("/api/cupcakes/<int:cupcake_id>")
def get_cupcake_by_id(cupcake_id):
    """Get data for a specific cupcake
    & return JSON {cupcake: {id, flavor, size, rating, image}}"""

    cupcake = Cupcake.query.get_or_404(cupcake_id)
    serialized = cupcake.serialize()

    return jsonify(cupcake = serialized)

@app.post("/api/cupcakes")
def create_cupcake():
    """Create a new cupcake from data
    & return JSON {cupcake: {id, flavor, size, rating, image}}"""

    flavor = request.json["flavor"]
    size = request.json["size"]
    rating = request.json["rating"]
    image = request.json["image"]

    cupcake = Cupcake(flavor=flavor, size=size, rating=rating, image=image)

    db.session.add(cupcake)
    db.session.commit()

    serialized = cupcake.serialize()

    # returns tuple (json, status_code)
    return (jsonify(cupcake = serialized), 201)

