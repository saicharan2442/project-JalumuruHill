from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient, DESCENDING, ASCENDING
from bson import ObjectId, json_util
from bson.errors import InvalidId
import json
import csv
import io
import smtplib
from datetime import datetime
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

# ─── Configuration ─────────────────────────────────────────────────────────────

# MongoDB Configuration
MONGO_URI = 'mongodb://localhost:27017/'
DB_NAME = 'jalumuru_hill'
# Use environment variables in production
# MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')

EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USER = 'fastrack2442@gmail.com'
EMAIL_PASS = os.getenv('EMAIL_PASS', 'password_here')

# ─── MongoDB Connection ────────────────────────────────────────────────────────

def get_mongo_client():
    return MongoClient(MONGO_URI)

def get_db():
    client = get_mongo_client()
    return client[DB_NAME]

# Custom JSON encoder to handle ObjectId
class JSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)

app.json_encoder = JSONEncoder

# Helper function to parse MongoDB documents
def parse_json(data):
    return json.loads(json_util.dumps(data))

# Helper function to validate ObjectId
def is_valid_objectid(id_str):
    try:
        ObjectId(id_str)
        return True
    except (InvalidId, TypeError):
        return False

# ─── “User-Panel” Routes ───────────────────────────────────────────────────────

@app.route('/donars', methods=['GET'])
def user_get_donars():
    try:
        db = get_db()
        donars = list(db.donars.find().sort('_id', DESCENDING))
        return jsonify(parse_json(donars))
    except Exception as e:
        print(f"Error fetching donors: {e}")
        return jsonify({'error': 'Failed to fetch donors'}), 500

@app.route('/ebooks', methods=['GET'])
def user_get_ebooks():
    try:
        db = get_db()
        ebooks = list(db.ebooks.find().sort('_id', DESCENDING))
        return jsonify(parse_json(ebooks))
    except Exception as e:
        print(f"Error fetching ebooks: {e}")
        return jsonify({'error': 'Failed to fetch ebooks'}), 500

@app.route('/events', methods=['GET'])
def user_get_events():
    try:
        db = get_db()
        events = list(db.events.find(
            {},
            {'eventname': 1, 'event_date': 1, 'event_temple': 1, 'discription': 1}
        ).sort('_id', DESCENDING))
        return jsonify(parse_json(events))
    except Exception as e:
        print(f"Error fetching events: {e}")
        return jsonify({'error': 'Failed to fetch events'}), 500

@app.route('/temples', methods=['GET'])
def user_get_temples():
    try:
        db = get_db()
        temples = list(db.temples.find().sort('_id', ASCENDING))
        return jsonify(parse_json(temples))
    except Exception as e:
        print(f"Error fetching temples: {e}")
        return jsonify({'error': 'Failed to fetch temples'}), 500

@app.route('/api/contacts', methods=['GET'])
def user_get_contacts():
    return admin_get_contacts()

@app.route('/api/contact', methods=['POST'])
def user_send_contact_email():
    data = request.get_json()
    if not data:
        return jsonify({'success': False, 'message': 'No data provided'}), 400
    
    try:
        with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as smtp:
            smtp.starttls()
            smtp.login(EMAIL_USER, EMAIL_PASS)
            body = (
                f"From: {data.get('name', 'Unknown')} <{data.get('email', 'No email')}>\n"
                f"Subject: {data.get('subject', 'No subject')}\n\n"
                f"{data.get('message', 'No message')}"
            )
            smtp.sendmail(EMAIL_USER, EMAIL_USER, body)
        return jsonify({'success': True, 'message': 'Message delivered successfully.'}), 200
    except Exception as e:
        print(f"Email error: {e}")
        return jsonify({'success': False, 'message': 'Sorry, message not sent.'}), 500

@app.route('/api/donar', methods=['POST'])
def user_add_donar():
    data = request.get_json()
    if not data:
        return jsonify({'success': False, 'message': 'No data provided'}), 400
    
    donated_at = datetime.now()
    
    try:
        db = get_db()
        donar_data = {
            'Name': data.get('name'),
            'village': data.get('village'),
            'district': data.get('district'),
            'email': data.get('email'),
            'phone_number': data.get('phone_number'),
            'donated': data.get('donated'),
            'donated_at': donated_at,
            'created_at': donated_at
        }
        
        result = db.donars.insert_one(donar_data)
        return jsonify({
            'success': True, 
            'message': 'Donor added successfully.',
            'id': str(result.inserted_id)
        }), 201
    except Exception as e:
        print(f"Error adding donor: {e}")
        return jsonify({'success': False, 'message': 'Failed to add donor'}), 500

# ─── “Admin-Panel” Routes ─────────────────────────────────────────────────────

# Contacts CRUD
@app.route('/api/contacts', methods=['GET'])
def admin_get_contacts():
    try:
        db = get_db()
        contacts = list(db.contacts.find().sort('created_at', DESCENDING))
        
        # Convert to match the expected format
        formatted_contacts = []
        for contact in contacts:
            formatted_contacts.append({
                'id': str(contact['_id']),
                'role': contact.get('role', ''),
                'name': contact.get('name', ''),
                'email': contact.get('email', ''),
                'mobile': contact.get('mobile_number', contact.get('mobile', '')),
                'imageUrl': contact.get('image_url', contact.get('imageUrl', '')),
                'createdAt': contact.get('created_at')
            })
        
        return jsonify(formatted_contacts)
    except Exception as e:
        print(f"Error fetching contacts: {e}")
        return jsonify({'error': 'Failed to fetch contacts'}), 500

@app.route('/api/contacts', methods=['POST'])
def admin_add_contact():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    try:
        db = get_db()
        
        contact_data = {
            'role': data.get('role'),
            'name': data.get('name'),
            'email': data.get('email'),
            'mobile_number': data.get('mobile'),
            'image_url': data.get('imageUrl'),
            'created_at': datetime.now()
        }
        
        result = db.contacts.insert_one(contact_data)
        return jsonify({
            'message': 'Contact added successfully',
            'id': str(result.inserted_id)
        }), 201
    except Exception as e:
        print(f"Error adding contact: {e}")
        return jsonify({'error': 'Failed to add contact'}), 500

@app.route('/api/contacts/<contact_id>', methods=['PUT'])
def admin_update_contact(contact_id):
    if not is_valid_objectid(contact_id):
        return jsonify({'error': 'Invalid contact ID'}), 400
    
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    try:
        db = get_db()
        
        update_data = {}
        if 'role' in data:
            update_data['role'] = data.get('role')
        if 'name' in data:
            update_data['name'] = data.get('name')
        if 'email' in data:
            update_data['email'] = data.get('email')
        if 'mobile' in data:
            update_data['mobile_number'] = data.get('mobile')
        if 'imageUrl' in data:
            update_data['image_url'] = data.get('imageUrl')
        
        update_data['updated_at'] = datetime.now()
        
        result = db.contacts.update_one(
            {'_id': ObjectId(contact_id)},
            {'$set': update_data}
        )
        
        if result.matched_count == 0:
            return jsonify({'error': 'Contact not found'}), 404
        
        if result.modified_count == 0:
            return jsonify({'message': 'No changes made to contact'}), 200
        
        return jsonify({'message': 'Contact updated successfully'}), 200
    except Exception as e:
        print(f"Error updating contact: {e}")
        return jsonify({'error': f'Failed to update contact: {str(e)}'}), 500

@app.route('/api/contacts/<contact_id>', methods=['DELETE'])
def admin_delete_contact(contact_id):
    if not is_valid_objectid(contact_id):
        return jsonify({'error': 'Invalid contact ID'}), 400
    
    try:
        db = get_db()
        result = db.contacts.delete_one({'_id': ObjectId(contact_id)})
        
        if result.deleted_count == 0:
            return jsonify({'error': 'Contact not found'}), 404
        
        return jsonify({'message': 'Contact deleted successfully'}), 200
    except Exception as e:
        print(f"Error deleting contact: {e}")
        return jsonify({'error': f'Failed to delete contact: {str(e)}'}), 500

# Events CRUD
@app.route('/api/events', methods=['GET'])
def admin_get_events():
    try:
        db = get_db()
        events = list(db.events.find().sort('event_date', DESCENDING))
        formatted_events = []
        for event in events:
            formatted_events.append({
                'id': str(event['_id']),
                'eventname': event.get('eventname'),
                'event_date': event.get('event_date'),
                'event_temple': event.get('event_temple'),
                'discription': event.get('discription'),
                'created_at': event.get('created_at')
            })
        return jsonify(formatted_events)
    except Exception as e:
        print(f"Error fetching events: {e}")
        return jsonify({'error': 'Failed to fetch events'}), 500

@app.route('/api/events', methods=['POST'])
def admin_add_event():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    try:
        db = get_db()
        
        event_data = {
            'eventname': data.get('eventname'),
            'event_date': data.get('event_date'),
            'event_temple': data.get('event_temple'),
            'discription': data.get('discription'),
            'created_at': datetime.now()
        }
        
        result = db.events.insert_one(event_data)
        return jsonify({
            'message': 'Event added successfully',
            'id': str(result.inserted_id)
        }), 201
    except Exception as e:
        print(f"Error adding event: {e}")
        return jsonify({'error': 'Failed to add event'}), 500

@app.route('/api/events/<event_id>', methods=['PUT'])
def admin_update_event(event_id):
    if not is_valid_objectid(event_id):
        return jsonify({'error': 'Invalid event ID'}), 400
    
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    try:
        db = get_db()
        
        update_data = {}
        if 'eventname' in data:
            update_data['eventname'] = data.get('eventname')
        if 'event_date' in data:
            update_data['event_date'] = data.get('event_date')
        if 'event_temple' in data:
            update_data['event_temple'] = data.get('event_temple')
        if 'discription' in data:
            update_data['discription'] = data.get('discription')
        
        update_data['updated_at'] = datetime.now()
        
        result = db.events.update_one(
            {'_id': ObjectId(event_id)},
            {'$set': update_data}
        )
        
        if result.matched_count == 0:
            return jsonify({'error': 'Event not found'}), 404
        
        if result.modified_count == 0:
            return jsonify({'message': 'No changes made to event'}), 200
        
        return jsonify({'message': 'Event updated successfully'}), 200
    except Exception as e:
        print(f"Error updating event: {e}")
        return jsonify({'error': f'Failed to update event: {str(e)}'}), 500

@app.route('/api/events/<event_id>', methods=['DELETE'])
def admin_delete_event(event_id):
    if not is_valid_objectid(event_id):
        return jsonify({'error': 'Invalid event ID'}), 400
    
    try:
        db = get_db()
        result = db.events.delete_one({'_id': ObjectId(event_id)})
        
        if result.deleted_count == 0:
            return jsonify({'error': 'Event not found'}), 404
        
        return jsonify({'message': 'Event deleted successfully'}), 200
    except Exception as e:
        print(f"Error deleting event: {e}")
        return jsonify({'error': f'Failed to delete event: {str(e)}'}), 500

# Donors CRUD + CSV
@app.route('/api/donors', methods=['GET'])
def admin_get_donors():
    try:
        db = get_db()
        donors = list(db.donars.find().sort('_id', DESCENDING))
        formatted_donors = []
        for donor in donors:
            formatted_donors.append({
                'id': str(donor['_id']),
                'Name': donor.get('Name'),
                'village': donor.get('village'),
                'district': donor.get('district'),
                'email': donor.get('email'),
                'phone_number': donor.get('phone_number'),
                'donated': donor.get('donated'),
                'donated_at': donor.get('donated_at'),
                'created_at': donor.get('created_at')
            })
        return jsonify(formatted_donors)
    except Exception as e:
        print(f"Error fetching donors: {e}")
        return jsonify({'error': 'Failed to fetch donors'}), 500

@app.route('/api/donors', methods=['POST'])
def admin_add_donor():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    try:
        db = get_db()
        
        donor_data = {
            'Name': data.get('Name'),
            'village': data.get('village'),
            'district': data.get('district'),
            'email': data.get('email'),
            'phone_number': data.get('phone_number'),
            'donated': data.get('donated'),
            'created_at': datetime.now()
        }
        
        result = db.donars.insert_one(donor_data)
        return jsonify({
            'message': 'Donor added successfully',
            'id': str(result.inserted_id)
        }), 201
    except Exception as e:
        print(f"Error adding donor: {e}")
        return jsonify({'error': 'Failed to add donor'}), 500

@app.route('/api/donors/upload', methods=['POST'])
def admin_upload_donors_csv():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    # Accept .csv case-insensitively
    if not file.filename.lower().endswith('.csv'):
        print(f"Rejected file due to extension: {file.filename}")
        return jsonify({'error': 'Only CSV files are allowed'}), 400

    try:
        # Read using utf-8-sig to gracefully handle BOM if present
        raw = file.stream.read()
        try:
            text = raw.decode('utf-8-sig')
        except Exception:
            text = raw.decode('utf-8', errors='replace')

        stream = io.StringIO(text, newline=None)
        reader = csv.DictReader(stream)
        db = get_db()

        donors_to_insert = []
        for row in reader:
            # Normalize keys to lowercase and strip BOM/whitespace
            cleaned_row = {}
            for k, v in row.items():
                key = (k or '').strip().lstrip('\ufeff').lower()
                value = v.strip() if v else ''
                cleaned_row[key] = value

            # Accept multiple header variants for donated_at
            donated_at_val = (
                cleaned_row.get('donated_at')
                or cleaned_row.get('donated at')
                or cleaned_row.get('donated')
                or ''
            )

            donor_data = {
                'Name': cleaned_row.get('name', '') or cleaned_row.get('fullname', ''),
                'village': cleaned_row.get('village', ''),
                'district': cleaned_row.get('district', ''),
                'email': cleaned_row.get('email', ''),
                'phone_number': cleaned_row.get('phone_number', '') or cleaned_row.get('phone', ''),
                'donated': cleaned_row.get('donated', '') or cleaned_row.get('amount', ''),
                'donated_at': donated_at_val,
                'created_at': datetime.now()
            }

            # Only insert rows that have at least a name or email or phone
            if donor_data['Name'] or donor_data['email'] or donor_data['phone_number']:
                donors_to_insert.append(donor_data)

        if donors_to_insert:
            result = db.donars.insert_many(donors_to_insert)
            return jsonify({
                'message': f'CSV data uploaded successfully. {len(result.inserted_ids)} records added.',
                'count': len(result.inserted_ids)
            }), 201
        else:
            return jsonify({'error': 'No valid data found in CSV file'}), 400
    except Exception as e:
        print(f"Error uploading CSV: {e}")
        return jsonify({'error': f'Failed to process CSV file: {str(e)}'}), 500

@app.route('/api/donors/<donor_id>', methods=['PUT'])
def admin_update_donor(donor_id):
    if not is_valid_objectid(donor_id):
        return jsonify({'error': 'Invalid donor ID'}), 400
    
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    try:
        db = get_db()
        
        update_data = {}
        if 'Name' in data:
            update_data['Name'] = data.get('Name')
        if 'village' in data:
            update_data['village'] = data.get('village')
        if 'district' in data:
            update_data['district'] = data.get('district')
        if 'email' in data:
            update_data['email'] = data.get('email')
        if 'phone_number' in data:
            update_data['phone_number'] = data.get('phone_number')
        if 'donated' in data:
            update_data['donated'] = data.get('donated')
        
        update_data['updated_at'] = datetime.now()
        
        result = db.donars.update_one(
            {'_id': ObjectId(donor_id)},
            {'$set': update_data}
        )
        
        if result.matched_count == 0:
            return jsonify({'error': 'Donor not found'}), 404
        
        if result.modified_count == 0:
            return jsonify({'message': 'No changes made to donor'}), 200
        
        return jsonify({'message': 'Donor updated successfully'}), 200
    except Exception as e:
        print(f"Error updating donor: {e}")
        return jsonify({'error': f'Failed to update donor: {str(e)}'}), 500

@app.route('/api/donors/<donor_id>', methods=['DELETE'])
def admin_delete_donor(donor_id):
    if not is_valid_objectid(donor_id):
        return jsonify({'error': 'Invalid donor ID'}), 400
    
    try:
        db = get_db()
        result = db.donars.delete_one({'_id': ObjectId(donor_id)})
        
        if result.deleted_count == 0:
            return jsonify({'error': 'Donor not found'}), 404
        
        return jsonify({'message': 'Donor deleted successfully'}), 200
    except Exception as e:
        print(f"Error deleting donor: {e}")
        return jsonify({'error': f'Failed to delete donor: {str(e)}'}), 500

# Temples CRUD
@app.route('/api/temples', methods=['GET'])
def admin_get_temples():
    try:
        db = get_db()
        temples = list(db.temples.find().sort('_id', DESCENDING))
        formatted_temples = []
        for temple in temples:
            formatted_temples.append({
                'id': str(temple['_id']),
                'tname': temple.get('tname'),
                'donar': temple.get('donar'),
                'village': temple.get('village'),
                'district': temple.get('district'),
                'ph_no': temple.get('ph_no'),
                'image_url': temple.get('image_url'),
                'created_at': temple.get('created_at')
            })
        return jsonify(formatted_temples)
    except Exception as e:
        print(f"Error fetching temples: {e}")
        return jsonify({'error': 'Failed to fetch temples'}), 500

@app.route('/api/temples', methods=['POST'])
def admin_add_temple():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    try:
        db = get_db()
        
        temple_data = {
            'image_url': data.get('image_url'),
            'tname': data.get('tname'),
            'donar': data.get('donar'),
            'village': data.get('village'),
            'district': data.get('district'),
            'ph_no': data.get('ph_no'),
            'created_at': datetime.now()
        }
        
        result = db.temples.insert_one(temple_data)
        return jsonify({
            'message': 'Temple added successfully',
            'id': str(result.inserted_id)
        }), 201
    except Exception as e:
        print(f"Error adding temple: {e}")
        return jsonify({'error': 'Failed to add temple'}), 500

@app.route('/api/temples/<temple_id>', methods=['PUT'])
def admin_update_temple(temple_id):
    if not is_valid_objectid(temple_id):
        return jsonify({'error': 'Invalid temple ID'}), 400
    
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    try:
        db = get_db()
        
        update_data = {}
        if 'image_url' in data:
            update_data['image_url'] = data.get('image_url')
        if 'tname' in data:
            update_data['tname'] = data.get('tname')
        if 'donar' in data:
            update_data['donar'] = data.get('donar')
        if 'village' in data:
            update_data['village'] = data.get('village')
        if 'district' in data:
            update_data['district'] = data.get('district')
        if 'ph_no' in data:
            update_data['ph_no'] = data.get('ph_no')
        
        update_data['updated_at'] = datetime.now()
        
        result = db.temples.update_one(
            {'_id': ObjectId(temple_id)},
            {'$set': update_data}
        )
        
        if result.matched_count == 0:
            return jsonify({'error': 'Temple not found'}), 404
        
        if result.modified_count == 0:
            return jsonify({'message': 'No changes made to temple'}), 200
        
        return jsonify({'message': 'Temple updated successfully'}), 200
    except Exception as e:
        print(f"Error updating temple: {e}")
        return jsonify({'error': f'Failed to update temple: {str(e)}'}), 500

@app.route('/api/temples/<temple_id>', methods=['DELETE'])
def admin_delete_temple(temple_id):
    if not is_valid_objectid(temple_id):
        return jsonify({'error': 'Invalid temple ID'}), 400
    
    try:
        db = get_db()
        result = db.temples.delete_one({'_id': ObjectId(temple_id)})
        
        if result.deleted_count == 0:
            return jsonify({'error': 'Temple not found'}), 404
        
        return jsonify({'message': 'Temple deleted successfully'}), 200
    except Exception as e:
        print(f"Error deleting temple: {e}")
        return jsonify({'error': f'Failed to delete temple: {str(e)}'}), 500

# Ebooks CRUD
@app.route('/api/ebooks', methods=['GET'])
def admin_get_ebooks():
    try:
        db = get_db()
        ebooks = list(db.ebooks.find().sort('_id', DESCENDING))
        formatted_ebooks = []
        for ebook in ebooks:
            formatted_ebooks.append({
                'id': str(ebook['_id']),
                'name': ebook.get('name'),
                'format': ebook.get('format'),
                'size': ebook.get('size'),
                'download_link': ebook.get('download_link'),
                'image_url': ebook.get('image_url'),
                'created_at': ebook.get('created_at')
            })
        return jsonify(formatted_ebooks)
    except Exception as e:
        print(f"Error fetching ebooks: {e}")
        return jsonify({'error': 'Failed to fetch ebooks'}), 500

@app.route('/api/ebooks', methods=['POST'])
def admin_add_ebook():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    try:
        db = get_db()
        
        ebook_data = {
            'name': data.get('name'),
            'format': data.get('format'),
            'size': data.get('size'),
            'download_link': data.get('download_link'),
            'image_url': data.get('image_url'),
            'created_at': datetime.now()
        }
        
        result = db.ebooks.insert_one(ebook_data)
        return jsonify({
            'message': 'Ebook added successfully',
            'id': str(result.inserted_id)
        }), 201
    except Exception as e:
        print(f"Error adding ebook: {e}")
        return jsonify({'error': 'Failed to add ebook'}), 500

@app.route('/api/ebooks/<ebook_id>', methods=['PUT'])
def admin_update_ebook(ebook_id):
    if not is_valid_objectid(ebook_id):
        return jsonify({'error': 'Invalid ebook ID'}), 400
    
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    try:
        db = get_db()
        
        update_data = {}
        if 'name' in data:
            update_data['name'] = data.get('name')
        if 'format' in data:
            update_data['format'] = data.get('format')
        if 'size' in data:
            update_data['size'] = data.get('size')
        if 'download_link' in data:
            update_data['download_link'] = data.get('download_link')
        if 'image_url' in data:
            update_data['image_url'] = data.get('image_url')
        
        update_data['updated_at'] = datetime.now()
        
        result = db.ebooks.update_one(
            {'_id': ObjectId(ebook_id)},
            {'$set': update_data}
        )
        
        if result.matched_count == 0:
            return jsonify({'error': 'Ebook not found'}), 404
        
        if result.modified_count == 0:
            return jsonify({'message': 'No changes made to ebook'}), 200
        
        return jsonify({'message': 'Ebook updated successfully'}), 200
    except Exception as e:
        print(f"Error updating ebook: {e}")
        return jsonify({'error': f'Failed to update ebook: {str(e)}'}), 500

@app.route('/api/ebooks/<ebook_id>', methods=['DELETE'])
def admin_delete_ebook(ebook_id):
    if not is_valid_objectid(ebook_id):
        return jsonify({'error': 'Invalid ebook ID'}), 400
    
    try:
        db = get_db()
        result = db.ebooks.delete_one({'_id': ObjectId(ebook_id)})
        
        if result.deleted_count == 0:
            return jsonify({'error': 'Ebook not found'}), 404
        
        return jsonify({'message': 'Ebook deleted successfully'}), 200
    except Exception as e:
        print(f"Error deleting ebook: {e}")
        return jsonify({'error': f'Failed to delete ebook: {str(e)}'}), 500


@app.route('/api/ebooks/upload', methods=['POST'])
def admin_upload_ebooks_csv():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    # Accept .csv case-insensitively
    if not file.filename.lower().endswith('.csv'):
        print(f"Rejected file due to extension: {file.filename}")
        return jsonify({'error': 'Only CSV files are allowed'}), 400

    try:
        print(f"Received file: filename={file.filename}, content_type={file.content_type}")
        raw = file.stream.read()
        try:
            text = raw.decode('utf-8-sig')
        except Exception:
            text = raw.decode('utf-8', errors='replace')
        # Log beginning of file to help debug formatting issues
        preview = text[:1024]
        print(f"File preview (first 1KB):\n{preview}")

        stream = io.StringIO(text, newline=None)
        try:
            reader = csv.DictReader(stream)
        except csv.Error as ce:
            print(f"CSV parse error: {ce}")
            return jsonify({'error': f'CSV parse error: {str(ce)}'}), 400
        db = get_db()

        ebooks_to_insert = []
        for idx, row in enumerate(reader):
            cleaned_row = {}
            for k, v in row.items():
                key = (k or '').strip().lstrip('\ufeff').lower()
                value = v.strip() if v else ''
                cleaned_row[key] = value

            if idx < 5:
                print(f"Row {idx} keys: {list(cleaned_row.keys())}")

            ebook_data = {
                'name': cleaned_row.get('name') or cleaned_row.get('title') or '',
                'format': cleaned_row.get('format') or cleaned_row.get('file_type') or '',
                'size': cleaned_row.get('size') or cleaned_row.get('file_size') or '',
                'download_link': (
                    cleaned_row.get('download_link')
                    or cleaned_row.get('download link')
                    or cleaned_row.get('download')
                    or cleaned_row.get('url')
                    or cleaned_row.get('link')
                    or ''
                ),
                'image_url': cleaned_row.get('image_url') or cleaned_row.get('cover') or '',
                'created_at': datetime.now()
            }

            # Require at least a name and download link (or url)
            if ebook_data['name'] and ebook_data['download_link']:
                ebooks_to_insert.append(ebook_data)

        if ebooks_to_insert:
            result = db.ebooks.insert_many(ebooks_to_insert)
            return jsonify({
                'message': f'CSV data uploaded successfully. {len(result.inserted_ids)} records added.',
                'count': len(result.inserted_ids)
            }), 201
        else:
            return jsonify({'error': 'No valid data found in CSV file'}), 400
    except Exception as e:
        print(f"Error uploading ebooks CSV: {e}")
        return jsonify({'error': f'Failed to process CSV file: {str(e)}'}), 500

# Marquee
@app.route('/api/marquee', methods=['GET'])
def get_marquee():
    try:
        db = get_db()
        marquee = db.marquee.find_one(sort=[('created_at', DESCENDING)])
        
        if marquee:
            return jsonify({'marquee': marquee.get('text', '')})
        else:
            return jsonify({'marquee': ''})
    except Exception as e:
        print(f"Error fetching marquee: {e}")
        return jsonify({'error': 'Failed to fetch marquee'}), 500

@app.route('/api/marquee', methods=['POST'])
def update_marquee():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    text = data.get('text', '')
    
    try:
        db = get_db()
        marquee_data = {
            'text': text,
            'created_at': datetime.now()
        }
        
        result = db.marquee.insert_one(marquee_data)
        return jsonify({
            'message': 'Marquee updated successfully',
            'id': str(result.inserted_id)
        }), 201
    except Exception as e:
        print(f"Error updating marquee: {e}")
        return jsonify({'error': 'Failed to update marquee'}), 500

# Debug endpoint to check collection structure
@app.route('/api/debug/collections', methods=['GET'])
def debug_collections():
    try:
        db = get_db()
        collections = db.list_collection_names()
        result = {}
        
        for collection_name in collections:
            count = db[collection_name].count_documents({})
            # Get one sample document
            sample = db[collection_name].find_one()
            result[collection_name] = {
                'count': count,
                'sample': parse_json(sample) if sample else None
            }
        
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    try:
        db = get_db()
        # Try to list collections to check DB connection
        db.list_collection_names()
        return jsonify({
            'status': 'healthy',
            'database': 'connected',
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'database': 'disconnected',
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }), 500

# ─── Main ──────────────────────────────────────────────────────────────────────

if __name__ == '__main__':
    print("Starting Flask server with MongoDB backend...")
    print(f"Database: {DB_NAME}")
    print(f"MongoDB URI: {MONGO_URI}")
    app.run(debug=True, host='0.0.0.0', port=5000)