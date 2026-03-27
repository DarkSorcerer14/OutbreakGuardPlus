"""
OutbreakGuard+ ML Model Training Script
Trains a Random Forest Classifier to predict waterborne disease outbreak risk
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
import joblib
import os
import json

# ─── Generate Synthetic Training Data ───────────────────────────────────
np.random.seed(42)
n_samples = 5000

data = {
    'rainfall_mm': np.random.uniform(0, 300, n_samples),
    'flood_proximity_km': np.random.uniform(0, 50, n_samples),
    'water_ph': np.random.uniform(5.5, 9.0, n_samples),
    'turbidity_ntu': np.random.uniform(0, 100, n_samples),
    'temperature_c': np.random.uniform(15, 45, n_samples),
    'humidity_pct': np.random.uniform(30, 100, n_samples),
    'historical_cases': np.random.randint(0, 500, n_samples),
    'ors_sales_spike': np.random.uniform(0, 10, n_samples),
    'antibiotic_sales_spike': np.random.uniform(0, 10, n_samples),
    'fever_med_sales_spike': np.random.uniform(0, 10, n_samples),
    'population_density': np.random.uniform(100, 10000, n_samples),
    'sanitation_score': np.random.uniform(0, 100, n_samples),
}

df = pd.DataFrame(data)

# ─── Generate Labels Based on Realistic Rules ───────────────────────────
def assign_risk(row):
    score = 0
    # Water quality factors
    if row['water_ph'] < 6.5 or row['water_ph'] > 8.5:
        score += 2
    if row['turbidity_ntu'] > 50:
        score += 2
    elif row['turbidity_ntu'] > 25:
        score += 1
    # Weather factors
    if row['rainfall_mm'] > 200:
        score += 2
    elif row['rainfall_mm'] > 100:
        score += 1
    if row['flood_proximity_km'] < 5:
        score += 3
    elif row['flood_proximity_km'] < 15:
        score += 1
    # Temperature & humidity
    if row['temperature_c'] > 35 and row['humidity_pct'] > 70:
        score += 2
    # Historical & pharma signals
    if row['historical_cases'] > 300:
        score += 2
    elif row['historical_cases'] > 150:
        score += 1
    if row['ors_sales_spike'] > 5:
        score += 2
    if row['antibiotic_sales_spike'] > 5:
        score += 1
    if row['fever_med_sales_spike'] > 5:
        score += 1
    # Sanitation
    if row['sanitation_score'] < 30:
        score += 2
    elif row['sanitation_score'] < 50:
        score += 1
    # Population density
    if row['population_density'] > 5000:
        score += 1

    if score >= 10:
        return 2  # High
    elif score >= 5:
        return 1  # Medium
    else:
        return 0  # Low

df['risk_level'] = df.apply(assign_risk, axis=1)

# ─── Disease Type Prediction ────────────────────────────────────────────
def assign_disease(row):
    if row['risk_level'] == 0:
        return 0  # None
    if row['water_ph'] < 6.5 and row['turbidity_ntu'] > 40:
        return 1  # Cholera
    elif row['temperature_c'] > 30 and row['historical_cases'] > 200:
        return 2  # Typhoid
    elif row['water_ph'] < 6.8 and row['temperature_c'] > 28:
        return 3  # Both
    else:
        return 1  # Default Cholera

df['disease_type'] = df.apply(assign_disease, axis=1)

# ─── Days Until Peak Prediction ─────────────────────────────────────────
def assign_days(row):
    if row['risk_level'] == 2:
        return np.random.randint(2, 5)
    elif row['risk_level'] == 1:
        return np.random.randint(5, 10)
    else:
        return np.random.randint(10, 20)

df['days_to_peak'] = df.apply(assign_days, axis=1)

# ─── Save Dataset ───────────────────────────────────────────────────────
df.to_csv(os.path.join(os.path.dirname(__file__), 'dataset.csv'), index=False)
print(f"Dataset generated: {len(df)} samples")
print(f"Risk distribution:\n{df['risk_level'].value_counts().to_string()}")

# ─── Train Risk Level Model ─────────────────────────────────────────────
features = ['rainfall_mm', 'flood_proximity_km', 'water_ph', 'turbidity_ntu',
            'temperature_c', 'humidity_pct', 'historical_cases',
            'ors_sales_spike', 'antibiotic_sales_spike', 'fever_med_sales_spike',
            'population_density', 'sanitation_score']

X = df[features]
y_risk = df['risk_level']
y_disease = df['disease_type']

X_train, X_test, y_risk_train, y_risk_test = train_test_split(X, y_risk, test_size=0.2, random_state=42)
_, _, y_disease_train, y_disease_test = train_test_split(X, y_disease, test_size=0.2, random_state=42)

# Risk Model
risk_model = RandomForestClassifier(n_estimators=150, max_depth=12, random_state=42, n_jobs=-1)
risk_model.fit(X_train, y_risk_train)
y_risk_pred = risk_model.predict(X_test)

print("\n═══ Risk Level Model ═══")
print(f"Accuracy: {accuracy_score(y_risk_test, y_risk_pred):.4f}")
print(classification_report(y_risk_test, y_risk_pred, target_names=['Low', 'Medium', 'High']))

# Disease Model
disease_model = RandomForestClassifier(n_estimators=150, max_depth=12, random_state=42, n_jobs=-1)
disease_model.fit(X_train, y_disease_train)
y_disease_pred = disease_model.predict(X_test)

print("\n═══ Disease Type Model ═══")
print(f"Accuracy: {accuracy_score(y_disease_test, y_disease_pred):.4f}")

# ─── Feature Importance ─────────────────────────────────────────────────
importances = risk_model.feature_importances_
feature_importance = dict(zip(features, importances.tolist()))
print("\n═══ Feature Importance ═══")
for feat, imp in sorted(feature_importance.items(), key=lambda x: x[1], reverse=True):
    print(f"  {feat}: {imp:.4f}")

# ─── Save Models ────────────────────────────────────────────────────────
models_dir = os.path.join(os.path.dirname(__file__), '..', 'backend', 'models')
os.makedirs(models_dir, exist_ok=True)

joblib.dump(risk_model, os.path.join(models_dir, 'risk_model.pkl'))
joblib.dump(disease_model, os.path.join(models_dir, 'disease_model.pkl'))
joblib.dump(features, os.path.join(models_dir, 'feature_names.pkl'))

# Save feature importance as JSON
with open(os.path.join(models_dir, 'feature_importance.json'), 'w') as f:
    json.dump(feature_importance, f, indent=2)

print(f"\nModels saved to {models_dir}")
print("Training complete!")
