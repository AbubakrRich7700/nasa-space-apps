from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import json
import os

app = Flask(__name__)
CORS(app)

# Создаем папку для модели если нет
os.makedirs('model', exist_ok=True)

# Загружаем ML модель
try:
    model = joblib.load('model/exoplanet_model.pkl')
    with open('model/model_info.json', 'r') as f:
        model_info = json.load(f)
    print("✅ ML model loaded successfully")
except Exception as e:
    print(f"❌ Model loading error: {e}")
    model = None
    model_info = {'features': [], 'accuracy': 0}

@app.route('/')
def home():
    return jsonify({
        "message": "🚀 NASA Exoplanet Detection API",
        "status": "active",
        "model_accuracy": f"{model_info.get('accuracy', 0):.2%}",
        "endpoints": {
            "predict": "/predict (POST)",
            "model_info": "/model_info (GET)",
            "health": "/health (GET)"
        }
    })

@app.route('/health')
def health():
    return jsonify({"status": "healthy", "model_loaded": model is not None})

@app.route('/model_info')
def get_model_info():
    return jsonify(model_info)

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500
    
    try:
        data = request.json
        
        # Подготавливаем фичи для модели
        features = [
            float(data.get('orbital_period', 100)),
            float(data.get('transit_duration', 5)),
            float(data.get('planet_radius', 0.05)),
            float(data.get('star_temperature', 5000)),
            float(data.get('star_gravity', 4.5)),
            float(data.get('star_radius', 1.0))
        ]
        
        # Предсказание
        prediction = model.predict([features])[0]
        probabilities = model.predict_proba([features])[0]
        
        result = {
            'prediction': 'EXOPLANET' if prediction == 1 else 'NOT_EXOPLANET',
            'confidence': float(probabilities[prediction]),
            'probabilities': {
                'exoplanet': float(probabilities[1]),
                'not_exoplanet': float(probabilities[0])
            },
            'features_used': model_info['features']
        }
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/batch_predict', methods=['POST'])
def batch_predict():
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500
    
    try:
        data_list = request.json
        results = []
        
        for data in data_list:
            features = [
                float(data.get('orbital_period', 100)),
                float(data.get('transit_duration', 5)),
                float(data.get('planet_radius', 0.05)),
                float(data.get('star_temperature', 5000)),
                float(data.get('star_gravity', 4.5)),
                float(data.get('star_radius', 1.0))
            ]
            
            prediction = model.predict([features])[0]
            probabilities = model.predict_proba([features])[0]
            
            results.append({
                'prediction': 'EXOPLANET' if prediction == 1 else 'NOT_EXOPLANET',
                'confidence': float(probabilities[prediction]),
                'probability_exoplanet': float(probabilities[1])
            })
        
        return jsonify({"results": results, "total_processed": len(results)})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    print("🚀 Starting NASA Exoplanet API Server...")
    app.run(debug=True, host='0.0.0.0', port=5000)
