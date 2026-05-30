from flask import Blueprint, request, jsonify, session
import os

bp = Blueprint('gate', __name__, url_prefix='/api/gate')

def get_access_code():
    """Read the current access code from file"""
    try:
        with open('/tmp/sirawdink_access_code.txt', 'r') as f:
            return f.read().strip()
    except:
        return None

@bp.route('/verify', methods=['POST'])
def verify_code():
    """Verify the access code before showing login"""
    data = request.get_json()
    if not data or not data.get('code'):
        return jsonify({'error': 'Code required'}), 400

    code = get_access_code()
    if not code:
        # No code set, allow through
        return jsonify({'valid': True}), 200

    if data['code'].upper().strip() == code.upper().strip():
        return jsonify({'valid': True}), 200
    else:
        return jsonify({'valid': False, 'error': 'Invalid access code'}), 401

@bp.route('/status', methods=['GET'])
def gate_status():
    """Check if gate is active"""
    code = get_access_code()
    return jsonify({'gate_active': code is not None}), 200
