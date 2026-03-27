"""
OutbreakGuard+ Firebase Firestore Integration Module
Handles persistent storage of zone risk data, alerts logs, and predicted outbreak trends.
"""

import os
import firebase_admin
from firebase_admin import credentials, firestore
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class FirestoreManager:
    def __init__(self):
        self.db = None
        # In a real app, this path would point to a service account JSON file
        cred_path = os.environ.get('FIREBASE_CRED_PATH', 'firebase-credentials.json')
        
        if os.path.exists(cred_path):
            try:
                cred = credentials.Certificate(cred_path)
                firebase_admin.initialize_app(cred)
                self.db = firestore.client()
                logger.info("✅ Firebase/Firestore initialized")
            except Exception as e:
                logger.error(f"❌ Failed to initialize Firebase: {e}")
        else:
            logger.warning("⚠️ No Firebase credentials found. Running in simulation mode (memory-only).")

    def update_zone_risk(self, zone_id, risk_data):
        """Update/Store the current risk assessment for a specific zone"""
        if self.db:
            try:
                self.db.collection('zones').document(zone_id).set(risk_data, merge=True)
                logger.debug(f"✅ Zone {zone_id} updated in Firestore")
                return True
            except Exception as e:
                logger.error(f"❌ Failed to update Firestore: {e}")
                return False
        else:
            # Memory simulation
            logger.info(f"🏛️ [SIMULATION] Storing risk data for {zone_id}: {risk_data['risk_level']}")
            return True

    def log_alert(self, alert_id, alert_data):
        """Log a sent alert in the system database for tracking and analytics"""
        if self.db:
            try:
                self.db.collection('alerts').document(alert_id).set(alert_data)
                return True
            except Exception as e:
                logger.error(f"❌ Failed to log alert in Firestore: {e}")
                return False
        else:
            logger.info(f"📜 [SIMULATION] Logging alert {alert_id} in memory")
            return True

    def get_zone_history(self, zone_id, limit=30):
        """Fetch historical risk data for a zone to generate trends"""
        if self.db:
            try:
                docs = self.db.collection('zones').document(zone_id).collection('history')\
                    .order_by('timestamp', direction=firestore.Query.DESCENDING).limit(limit).stream()
                return [doc.to_dict() for doc in docs]
            except Exception as e:
                logger.error(f"❌ Failed to fetch history from Firestore: {e}")
                return []
        else:
            # Return empty or some mock history for simulation
            return []

# Singleton instance
firestore_manager = FirestoreManager()
