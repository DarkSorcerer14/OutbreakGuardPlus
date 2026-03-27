"""
OutbreakGuard+ Alert System Module
Handles multi-channel alerts (Simulated - Twilio Disabled)
"""

import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AlertManager:
    def __init__(self):
        self.client = None
        logger.warning("⚠️ Running in simulated mode for Twilio alerts (Twilio removed)")

    def send_sms(self, to_number, message):
        """Send an SMS alert to a recipient"""
        logger.info(f"📡 [SIMULATION] Sending SMS to {to_number}: {message}")
        return True, "mock_sid_123"

    def make_voice_call(self, to_number, script_url_or_text):
        """Make an automated voice call with a message"""
        logger.info(f"📡 [SIMULATION] Making Voice Call to {to_number}: {script_url_or_text}")
        return True, "mock_call_sid_123"

    def notify_asha_worker(self, worker_id, zone_data):
        """Notify ASHA worker via localized app/push notification logic"""
        message = f"🛡️ OutbreakGuard+ Alert for your zone: {zone_data['name']}. Risk Level: {zone_data['risk_level']}. Potential: {zone_data['disease_predicted']}. Please initiate door-to-door outreach immediately."
        return self.send_sms("+919999999999", message) # Using mock ASHA phone

    def notify_pharmacy(self, pharmacy_id, zone_data):
        """Send alert to local pharmacy terminal/system"""
        message = f"🛡️ OutbreakGuard+ PharmaSentinel Notice: Elevated {zone_data['disease_predicted']} risk in your area. Please ensure adequate stocks of ORS, Zinc, and antibiotics. Advise customers on water quality."
        logger.info(f"🏪 [SYSTEM] Notice pushed to Pharmacy {pharmacy_id} for zone {zone_data['name']}")
        return True, "notified"

# Singleton instance
alert_manager = AlertManager()
