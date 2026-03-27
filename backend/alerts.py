"""
OutbreakGuard+ Alert System Module
Handles multi-channel alerts (Simulated - Twilio Disabled)
"""

import os
import logging
import json
import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Constants for localized messages
LOCAL_LANG_MAP = {
    "Maharashtra": "Marathi",
    "Bihar": "Hindi",
    "West Bengal": "Bengali",
    "Madhya Pradesh": "Hindi",
    "Delhi": "Hindi",
    "Uttar Pradesh": "Hindi"
}

SIMULATED_TRANSLATION = {
    "Hindi": "⚠️ आपके क्षेत्र में दूषित पानी का खतरा बढ़ गया है। कृपया पानी उबाल कर पिएं।",
    "Marathi": "⚠️ आपल्या भागात दूषित पाण्याचा धोका वाढला आहे. कृपया पाणी उकळून प्या.",
    "Bengali": "⚠️ আপনার এলাকায় দূষিত জলের ঝুঁকি বেড়েছে। নিয়মিত জল ফুটিয়ে ব্যবহার করুন।",
}

class AlertManager:
    def __init__(self):
        self.client = None
        self.log_file = "alerts_log.json"
        logger.warning("⚠️ Running in optimized simulation mode (Persistence enabled)")

    def _log_to_file(self, to, channel, message, sid):
        """Append alert to a local simulation logs for persistence"""
        entry = {
            "timestamp": datetime.datetime.now().isoformat(),
            "sid": sid,
            "to": to,
            "channel": channel,
            "message": message,
            "status": "SENT"
        }
        
        try:
            logs = []
            if os.path.exists(self.log_file):
                with open(self.log_file, 'r', encoding='utf-8') as f:
                    logs = json.load(f)
            
            logs.append(entry)
            with open(self.log_file, 'w', encoding='utf-8') as f:
                json.dump(logs, f, indent=2, ensure_ascii=False)
        except Exception as e:
            logger.error(f"Error logging alert: {e}")

    def send_sms(self, to_number, message, zone_data=None):
        """Send a simulated SMS alert with regional translation logic"""
        lang = "English"
        if zone_data:
            state = zone_data.get('state', '')
            lang = LOCAL_LANG_MAP.get(state, "English")
        
        translated_msg = SIMULATED_TRANSLATION.get(lang, message)
        
        print("\n" + "="*50)
        print(f"📱 SIMULATED SMS DISPATCH [{lang}]")
        print(f"TO:      {to_number}")
        print(f"MESSAGE: {translated_msg}")
        if lang != "English":
            print(f"ORIGINAL: {message}")
        print("="*50 + "\n")
        
        sid = f"SIM_{os.urandom(4).hex()}"
        self._log_to_file(to_number, "SMS", translated_msg, sid)
        return True, sid

    def make_voice_call(self, to_number, script_url_or_text):
        """Make an automated voice call simulation"""
        print("\n" + "="*50)
        print(f"📞 SIMULATED VOICE CALL")
        print(f"TO:      {to_number}")
        print(f"SCRIPT:  {script_url_or_text}")
        print("="*50 + "\n")
        
        sid = f"SIM_CALL_{os.urandom(4).hex()}"
        self._log_to_file(to_number, "VOICE", script_url_or_text, sid)
        return True, sid

    def notify_asha_worker(self, worker_id, zone_data):
        """Notify ASHA worker via localized push notification simulation"""
        message = f"🛡️ OutbreakGuard+ Alert for your zone: {zone_data['name']}. Risk Level: {zone_data['risk_level']}. Potential: {zone_data['disease_predicted']}. Please initiate door-to-door outreach immediately."
        return self.send_sms("+919999999999", message, zone_data)

    def notify_pharmacy(self, pharmacy_id, zone_data):
        """Send alert to local pharmacy terminal/system simulation"""
        message = f"🛡️ OutbreakGuard+ PharmaSentinel Notice: Elevated {zone_data['disease_predicted']} risk in your area. Please ensure adequate stocks of ORS, Zinc, and antibiotics."
        logger.info(f"🏪 [SYSTEM] Notice pushed to Pharmacy {pharmacy_id} for zone {zone_data['name']}")
        sid = f"SIM_PHARMA_{os.urandom(4).hex()}"
        self._log_to_file(pharmacy_id, "PHARMACY", message, sid)
        return True, "notified"

# Singleton instance
alert_manager = AlertManager()
