"""
OutbreakGuard+ Firebase Firestore Integration Module
Handles persistent storage of zone risk data, alert logs, and outbreak trends.
Running in a high-fidelity JSON persistence mode (Local Simulation).
"""

import os
import logging
import json
import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class FirestoreManager:
    def __init__(self):
        self.db_file = "local_db.json"
        self._initialize_db()
        logger.warning(f"🏛️ Running in JSON Persistence Mode (Local File: {self.db_file})")

    def _initialize_db(self):
        """Create the local database file if it doesn't exist"""
        if not os.path.exists(self.db_file):
            initial_data = {
                "zones": {},
                "alerts": [],
                "system_logs": []
            }
            with open(self.db_file, 'w') as f:
                json.dump(initial_data, f, indent=2)

    def _read_db(self):
        """Read current database state from JSON"""
        try:
            with open(self.db_file, 'r') as f:
                return json.load(f)
        except Exception:
            return {"zones": {}, "alerts": [], "system_logs": []}

    def _write_db(self, data):
        """Save database state to JSON"""
        try:
            with open(self.db_file, 'w') as f:
                json.dump(data, f, indent=2)
            return True
        except Exception as e:
            logger.error(f"Failed to write to local DB: {e}")
            return False

    def update_zone_risk(self, zone_id, risk_data):
        """Update/Store the current risk assessment for a specific zone with history"""
        db = self._read_db()
        
        # Add timestamp if not present
        if "timestamp" not in risk_data:
            risk_data["timestamp"] = datetime.datetime.now().isoformat()
            
        # Initialize zone if not present
        if zone_id not in db["zones"]:
            db["zones"][zone_id] = {
                "current": risk_data,
                "history": []
            }
        
        # Update current and append to history
        db["zones"][zone_id]["current"] = risk_data
        db["zones"][zone_id]["history"].append(risk_data)
        
        # Keep last 50 entries for history
        db["zones"][zone_id]["history"] = db["zones"][zone_id]["history"][-50:]
        
        logger.info(f"🏛️ [LOCAL DB] Risk updated for zone {zone_id}: {risk_data.get('risk_level', 'Unknown')}")
        return self._write_db(db)

    def log_alert(self, alert_id, alert_data):
        """Log a sent alert in the system database for tracking and analytics"""
        db = self._read_db()
        alert_data["id"] = alert_id
        alert_data["timestamp"] = datetime.datetime.now().isoformat()
        
        db["alerts"].append(alert_data)
        db["alerts"] = db["alerts"][-100:] # Limit to last 100 alerts
        
        logger.info(f"📜 [LOCAL DB] Alert {alert_id} logged in JSON database")
        return self._write_db(db)

    def get_zone_history(self, zone_id, limit=30):
        """Fetch historical risk data for a zone for trending analysis"""
        db = self._read_db()
        zone = db["zones"].get(zone_id, {"history": []})
        return zone["history"][-limit:]

    def reset_database(self):
        """Clear the local database for a fresh start"""
        if os.path.exists(self.db_file):
            os.remove(self.db_file)
        self._initialize_db()
        logger.info("🏛️ [DATABASE] Local JSON database reset.")

# Singleton instance
firestore_manager = FirestoreManager()
