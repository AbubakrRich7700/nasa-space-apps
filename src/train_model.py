import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib
import os

print("🚀 NASA Exoplanet ML Model Training...")

# Создаем демо данные (так как оригинальные данные большие)
def create_demo_data():
    np.random.seed(42)
    n_samples = 2000
    
    data = {
        'orbital_period': np.random.uniform(0.5, 500, n_samples),
        'transit_duration': np.random.uniform(0.5, 10, n_samples),
        'planet_radius': np.random.uniform(0.01, 0.2, n_samples),
        'star_temperature': np.random.uniform(3000, 7000, n_samples),
        'star_gravity': np.random.uniform(4.0, 5.0, n_samples),
        'star_radius': np.random.uniform(0.5, 2.0, n_samples),
        'is_exoplanet': np.random.choice([0, 1], n_samples, p=[0.7, 0.3])
    }
    
    df = pd.DataFrame(data)
    df.to_csv('exoplanet_data.csv', index=False)
    print(f"✅ Created demo data with {n_samples} samples")
    return df

# Загружаем или создаем данные
try:
    data = pd.read_csv('exoplanet_data.csv')
    print("✅ Data loaded successfully")
except:
    print("📊 Creating demo dataset...")
    data = create_demo_data()

# Подготовка данных
features = ['orbital_period', 'transit_duration', 'planet_radius', 'star_temperature', 'star_gravity', 'star_radius']
target = 'is_exoplanet'

X = data[features]
y = data[target]

# Делим данные на тренировочные и тестовые
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Обучаем модель
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Сохраняем модель
joblib.dump(model, 'model/exoplanet_model.pkl')
print("✅ ML model trained and saved!")

# Оценка точности
from sklearn.metrics import accuracy_score, classification_report
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

print(f"📊 Model Accuracy: {accuracy:.2%}")
print("\n📈 Classification Report:")
print(classification_report(y_test, y_pred))

# Сохраняем список фич для бэкенда
feature_info = {
    'features': features,
    'accuracy': accuracy
}

import json
with open('model/model_info.json', 'w') as f:
    json.dump(feature_info, f)

print("🎉 Model training completed!")
