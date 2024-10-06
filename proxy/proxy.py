from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

API_KEY = os.environ.get("PUBLIC_HARVARD_API_KEY")
BASE_URL = "https://api.harvardartmuseums.org"

import firebase_admin
from firebase_admin import credentials, auth

# Inicializa o Firebase Admin SDK
cred = credentials.Certificate(".firebaseAdminSDK.json")
firebase_admin.initialize_app(cred)

@app.route("/proxy/<path:endpoint>", methods=["GET"])
def proxy(endpoint):
    params = request.args.to_dict()
    params["apikey"] = API_KEY
    url = f"{BASE_URL}/{endpoint}"

    response = requests.get(url, params=params)

    if response.status_code != 200:
        return (
            jsonify({"error": "Erro ao fazer requisição à API de Harvard"}),
            response.status_code,
        )

    try:
        return jsonify(response.json())
    except ValueError:
        print("Resposta recebida da API de Harvard:", response.text)
        return (
            jsonify({"error": "Resposta da API de Harvard não é um JSON válido"}),
            500,
        )


# @app.route("/api/register", methods=["POST"])
# def register_user():
#     data = request.json
#     email = data.get("email")
#     password = data.get("password")

#     try:
#         user = auth.create_user(email=email, password=password)
#         return jsonify({"uid": user.uid}), 201
#     except Exception as e:
#         return jsonify({"error": str(e)}), 400

@app.route("/api/login", methods=["POST"])
def login_user():
    data = request.json
    id_token = data.get("idToken")

    try:
        # Autentica o usuário com email e senha
        user = auth.get_user_by_uid(id_token)
        print('user', user)
        # id_token = auth.create_custom_token(user.uid)
        return jsonify({"idToken": id_token.decode()}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 401


@app.route("/api/logout", methods=["POST"])
def logout_user():
    data = request.json
    id_token = data.get("idToken")

    if not id_token:
        return jsonify({"error": "idToken is required"}), 400

    try:
        # Verifica o token e extrai o uid
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token["uid"]

        # Revoga os tokens de refresh do usuário
        auth.revoke_refresh_tokens(uid)

        return jsonify({"message": "User logged out successfully"}), 200
    except Exception as e:
        return jsonify({"error": "Error logging out"}), 400

if __name__ == "__main__":
    app.run()
