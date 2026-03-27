"""
OutbreakGuard+ Alert System Module
Handles multi-channel alerts via Twilio (SMS, Voice) and ASHA/Pharmacy notification logic.
"""

import os
from twilio.rest import Client
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AlertManager:
    def __init__(self):
        # In a real app, these would come from environment variables
        self.account_sid = os.environ.get('TWILIO_ACCOUNT_SID', 'AC_MOCK_SID')
        self.auth_token = os.environ.get('TWILIO_AUTH_TOKEN', 'MOCK_TOKEN')
        self.from_number = os.environ.get('TWILIO_FROM_NUMBER', '+1234567890')
        
        # Initialize Twilio client (only if credentials are not mock)
        self.client = None
        if 'AC' in self.account_sid and self.auth_token != 'MOCK_TOKEN':
            try:
                self.client = Client(self.account_sid, self.auth_token)
                logger.info("✅ Twilio client initialized")
            except Exception as e:
                logger.error(f"❌ Failed to initialize Twilio: {e}")
        else:
            logger.warning("⚠️ Running in simulated mode for Twilio alerts")

    def send_sms(self, to_number, message):
        """Send an SMS alert to a recipient"""
        if self.client:
            try:
                message = self.client.messages.create(
                    body=message,
                    from_=self.from_number,
                    to=to_number
                )
                logger.info(f"✅ SMS sent to {to_number}: {message.sid}")
                return True, message.sid
            except Exception as e:
                logger.error(f"❌ SMS failed to {to_number}: {e}")
                return False, str(e)
        else:
            # Simulation mode
            logger.info(f"📡 [SIMULATION] Sending SMS to {to_number}: {message}")
            return True, "mock_sid_123"

    def make_voice_call(self, to_number, script_url_or_text):
        """Make an automated voice call with a message"""
        if self.client:
            try:
                # Twilio uses TwiML for voice calls
                call = self.client.calls.create(
                    twiml=f'<Response><Say voice="alice" language="hi-IN">{script_url_or_text}</Say></Response>',
                    from_=self.from_number,
                    to=to_number
                )
                logger.info(f"✅ Voice call initiated to {to_number}: {call.sid}")
                return True, call.sid
            except Exception as e:
                logger.error(f"❌ Voice call failed to {to_number}: {e}")
                return False, str(e)
        else:
            # Simulation mode
            logger.info(f"📡 [SIMULATION] Making Voice Call to {to_number}: {script_url_or_text}")
            return True, "mock_call_sid_123"

    def notify_asha_worker(self, worker_id, zone_data):
        """Notify ASHA worker via localized app/push notification logic"""
        # In a real implementation, this would trigger a push notification or a specialized SMS
        message = f"🛡️ OutbreakGuard+ Alert for your zone: {zone_data['name']}. Risk Level: {zone_data['risk_level']}. Potential: {zone_data['disease_predicted']}. Please initiate door-to-door outreach immediately."
        return self.send_sms("+919999999999", message) # Using mock ASHA phone

    def notify_pharmacy(self, pharmacy_id, zone_data):
        """Send alert to local pharmacy terminal/system"""
        message = f"🛡️ OutbreakGuard+ PharmaSentinel Notice: Elevated {zone_data['disease_predicted']} risk in your area. Please ensure adequate stocks of ORS, Zinc, and antibiotics. Advise customers on water quality."
        # In a real app, this might be a webhook to the pharmacy's ERP or a digital notice
        logger.info(f"🏪 [SYSTEM] Notice pushed to Pharmacy {pharmacy_id} for zone {zone_data['name']}")
        return True, "notified"

# Singleton instance
alert_manager = AlertManager()
