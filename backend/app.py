from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import csv
import io
import smtplib
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

# ─── Configuration ─────────────────────────────────────────────────────────────

DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': '2442',
    'database': 'jalumuru_hill'
}

EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USER = 'fastrack2442@gmail.com'
# use an environment variable in production, e.g. os.getenv('EMAIL_PASS')
EMAIL_PASS = os.getenv('EMAIL_PASS', '20021214S@da')

# ─── Utilities ────────────────────────────────────────────────────────────────

def get_db_connection():
    return mysql.connector.connect(**DB_CONFIG)

def format_datetime(dt):
    return dt.strftime("%Y-%m-%d %H:%M:%S") if dt else None

# ─── “User-Panel” Routes ───────────────────────────────────────────────────────

@app.route('/donars', methods=['GET'])
def user_get_donars():
    db = get_db_connection()
    cur = db.cursor()
    cur.execute("SELECT * FROM donars ORDER BY id DESC")
    cols = [c[0] for c in cur.description]
    data = []
    for row in cur.fetchall():
        d = dict(zip(cols, row))
        d['donated_at'] = format_datetime(d.get('donated_at'))
        data.append(d)
    cur.close()
    db.close()
    return jsonify(data)

@app.route('/ebooks', methods=['GET'])
def user_get_ebooks():
    db = get_db_connection()
    cur = db.cursor()
    cur.execute("SELECT * FROM ebooks ORDER BY id DESC")
    cols = [c[0] for c in cur.description]
    data = []
    for row in cur.fetchall():
        e = dict(zip(cols, row))
        e['created_at'] = format_datetime(e.get('created_at'))
        data.append(e)
    cur.close()
    db.close()
    return jsonify(data)

@app.route('/events', methods=['GET'])
def user_get_events():
    db = get_db_connection()
    cur = db.cursor()
    cur.execute("""
        SELECT id, eventname, event_date, event_temple, discription
        FROM events ORDER BY id DESC
    """)
    events = []
    for id_, name, date, temple, desc in cur.fetchall():
        events.append({
            'id': id_,
            'eventname': name,
            'event_date': date,
            'event_temple': temple,
            'discription': desc
        })
    cur.close()
    db.close()
    return jsonify(events)

@app.route('/temples', methods=['GET'])
def user_get_temples():
    db = get_db_connection()
    cur = db.cursor()
    cur.execute("SELECT * FROM temples ORDER BY id ASC")
    cols = [c[0] for c in cur.description]
    data = []
    for row in cur.fetchall():
        t = dict(zip(cols, row))
        t['created_at'] = format_datetime(t.get('created_at'))
        data.append(t)
    cur.close()
    db.close()
    return jsonify(data)

@app.route('/api/contacts', methods=['GET'])
def user_get_contacts():
    # same endpoint as admin-GET; admin GET will also serve this
    return admin_get_contacts()

@app.route('/api/contact', methods=['POST'])
def user_send_contact_email():
    data = request.get_json()
    try:
        with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as smtp:
            smtp.starttls()
            smtp.login(EMAIL_USER, EMAIL_PASS)
            body = (
                f"From: {data['name']} <{data['email']}>\n"
                f"Subject: {data['subject']}\n\n"
                f"{data['message']}"
            )
            smtp.sendmail(EMAIL_USER, EMAIL_USER, body)
        return jsonify({'success': True, 'message': 'Message delivered successfully.'}), 200
    except Exception as e:
        print("Email error:", e)
        return jsonify({'success': False, 'message': 'Sorry, message not sent.'}), 500

@app.route('/api/donar', methods=['POST'])
def user_add_donar():
    data = request.get_json()
    donated_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    db = get_db_connection()
    cur = db.cursor()
    cur.execute("""
        INSERT INTO donars (Name, village, district, email, phone_number, donated, donated_at)
        VALUES (%s,%s,%s,%s,%s,%s,%s)
    """, (
        data.get('name'),
        data.get('village'),
        data.get('district'),
        data.get('email'),
        data.get('phone_number'),
        data.get('donated'),
        donated_at
    ))
    db.commit()
    cur.close()
    db.close()
    return jsonify({'success': True, 'message': 'Donor added successfully.'}), 201

# ─── “Admin-Panel” Routes ─────────────────────────────────────────────────────

# Contacts CRUD
@app.route('/api/contacts', methods=['POST'])
def admin_add_contact():
    data = request.get_json()
    db = get_db_connection()
    cur = db.cursor()
    cur.execute("""
        INSERT INTO contacts (role,name,email,mobile_number,image_url)
        VALUES (%s,%s,%s,%s,%s)
    """, (
        data['role'], data['name'], data['email'],
        data['mobile'], data['imageUrl']
    ))
    db.commit()
    cur.close()
    db.close()
    return jsonify({'message': 'Contact added'}), 201

@app.route('/api/contacts/<int:contact_id>', methods=['PUT'])
def admin_update_contact(contact_id):
    data = request.get_json()
    db = get_db_connection()
    cur = db.cursor()
    cur.execute("""
        UPDATE contacts
        SET role=%s,name=%s,email=%s,mobile_number=%s,image_url=%s
        WHERE id=%s
    """, (
        data['role'], data['name'], data['email'],
        data['mobile'], data['imageUrl'], contact_id
    ))
    db.commit()
    cur.close()
    db.close()
    return jsonify({'message': 'Contact updated'}), 200

@app.route('/api/contacts/<int:contact_id>', methods=['DELETE'])
def admin_delete_contact(contact_id):
    db = get_db_connection()
    cur = db.cursor()
    cur.execute("DELETE FROM contacts WHERE id=%s", (contact_id,))
    db.commit()
    cur.close()
    db.close()
    return jsonify({'message': 'Contact deleted'}), 200

def admin_get_contacts():
    db = get_db_connection()
    cur = db.cursor(dictionary=True)
    cur.execute("""
        SELECT id,role,name,email,mobile_number AS mobile,
               image_url AS imageUrl,created_at AS createdAt
        FROM contacts ORDER BY created_at DESC
    """)
    results = cur.fetchall()
    cur.close()
    db.close()
    return jsonify(results)

# Events CRUD
@app.route('/api/events', methods=['GET'])
def admin_get_events():
    db = get_db_connection()
    cur = db.cursor(dictionary=True)
    cur.execute("""
        SELECT id,eventname,event_date,event_temple,discription
        FROM events ORDER BY event_date DESC
    """)
    res = cur.fetchall()
    cur.close()
    db.close()
    return jsonify(res)

@app.route('/api/events', methods=['POST'])
def admin_add_event():
    data = request.get_json()
    db = get_db_connection()
    cur = db.cursor()
    cur.execute("""
        INSERT INTO events (eventname,event_date,event_temple,discription)
        VALUES (%s,%s,%s,%s)
    """, (
        data['eventname'], data['event_date'],
        data['event_temple'], data['discription']
    ))
    db.commit()
    cur.close()
    db.close()
    return jsonify({'message': 'Event added'}), 201

@app.route('/api/events/<int:event_id>', methods=['PUT'])
def admin_update_event(event_id):
    data = request.get_json()
    db = get_db_connection()
    cur = db.cursor()
    cur.execute("""
        UPDATE events
        SET eventname=%s,event_date=%s,event_temple=%s,discription=%s
        WHERE id=%s
    """, (
        data['eventname'], data['event_date'],
        data['event_temple'], data['discription'], event_id
    ))
    db.commit()
    cur.close()
    db.close()
    return jsonify({'message': 'Event updated'}), 200

@app.route('/api/events/<int:event_id>', methods=['DELETE'])
def admin_delete_event(event_id):
    db = get_db_connection()
    cur = db.cursor()
    cur.execute("DELETE FROM events WHERE id=%s", (event_id,))
    db.commit()
    cur.close()
    db.close()
    return jsonify({'message': 'Event deleted'}), 200

# Donors CRUD + CSV
@app.route('/api/donors', methods=['GET'])
def admin_get_donors():
    db = get_db_connection()
    cur = db.cursor(dictionary=True)
    cur.execute("""
        SELECT id,Name,village,district,email,phone_number,donated,donated_at
        FROM donars ORDER BY id DESC
    """)
    rows = cur.fetchall()
    for r in rows:
        r['donated_at'] = format_datetime(r.get('donated_at'))
    cur.close()
    db.close()
    return jsonify(rows)

@app.route('/api/donors', methods=['POST'])
def admin_add_donor():
    data = request.get_json()
    db = get_db_connection()
    cur = db.cursor()
    cur.execute("""
        INSERT INTO donars (Name,village,district,email,phone_number,donated)
        VALUES (%s,%s,%s,%s,%s,%s)
    """, (
        data['Name'], data['village'], data['district'],
        data['email'], data['phone_number'], data['donated']
    ))
    db.commit()
    cur.close()
    db.close()
    return jsonify({'message': 'Donor added successfully'}), 201

@app.route('/api/donors/upload', methods=['POST'])
def admin_upload_donors_csv():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if not file.filename.endswith('.csv'):
        return jsonify({'error': 'Only CSV allowed'}), 400

    stream = io.StringIO(file.stream.read().decode('UTF8'), newline=None)
    reader = csv.DictReader(stream)
    db = get_db_connection()
    cur = db.cursor()
    for row in reader:
        cur.execute("""
            INSERT INTO donars (Name,village,district,email,phone_number,donated)
            VALUES (%s,%s,%s,%s,%s,%s)
        """, (
            row['Name'], row['village'], row['district'],
            row['email'], row['phone_number'], row['donated']
        ))
    db.commit()
    cur.close()
    db.close()
    return jsonify({'message': 'CSV data uploaded successfully'}), 201

@app.route('/api/donors/<int:donor_id>', methods=['PUT'])
def admin_update_donor(donor_id):
    data = request.get_json()
    db = get_db_connection()
    cur = db.cursor()
    cur.execute("""
        UPDATE donars
        SET Name=%s,village=%s,district=%s,email=%s,phone_number=%s,donated=%s
        WHERE id=%s
    """, (
        data['Name'], data['village'], data['district'],
        data['email'], data['phone_number'], data['donated'],
        donor_id
    ))
    db.commit()
    cur.close()
    db.close()
    return jsonify({'message': 'Donor updated'}), 200

@app.route('/api/donors/<int:donor_id>', methods=['DELETE'])
def admin_delete_donor(donor_id):
    db = get_db_connection()
    cur = db.cursor()
    cur.execute("DELETE FROM donars WHERE id=%s", (donor_id,))
    db.commit()
    cur.close()
    db.close()
    return jsonify({'message': 'Donor deleted'}), 200

# Temples CRUD
@app.route('/api/temples', methods=['GET'])
def admin_get_temples():
    db = get_db_connection()
    cur = db.cursor(dictionary=True)
    cur.execute("""
        SELECT id,image_url,tname,donar,village,district,ph_no
        FROM temples ORDER BY id DESC
    """)
    res = cur.fetchall()
    cur.close()
    db.close()
    return jsonify(res)

@app.route('/api/temples', methods=['POST'])
def admin_add_temple():
    data = request.get_json()
    db = get_db_connection()
    cur = db.cursor()
    cur.execute("""
        INSERT INTO temples (image_url,tname,donar,village,district,ph_no)
        VALUES (%s,%s,%s,%s,%s,%s)
    """, (
        data['image_url'], data['tname'], data['donar'],
        data['village'], data['district'], data['ph_no']
    ))
    db.commit()
    cur.close()
    db.close()
    return jsonify({'message': 'Temple added'}), 201

@app.route('/api/temples/<int:temple_id>', methods=['PUT'])
def admin_update_temple(temple_id):
    data = request.get_json()
    db = get_db_connection()
    cur = db.cursor()
    cur.execute("""
        UPDATE temples
        SET image_url=%s,tname=%s,donar=%s,village=%s,district=%s,ph_no=%s
        WHERE id=%s
    """, (
        data['image_url'], data['tname'], data['donar'],
        data['village'], data['district'], data['ph_no'],
        temple_id
    ))
    db.commit()
    cur.close()
    db.close()
    return jsonify({'message': 'Temple updated'}), 200

@app.route('/api/temples/<int:temple_id>', methods=['DELETE'])
def admin_delete_temple(temple_id):
    db = get_db_connection()
    cur = db.cursor()
    cur.execute("DELETE FROM temples WHERE id=%s", (temple_id,))
    db.commit()
    cur.close()
    db.close()
    return jsonify({'message': 'Temple deleted'}), 200

# Ebooks CRUD
@app.route('/api/ebooks', methods=['GET'])
def admin_get_ebooks():
    db = get_db_connection()
    cur = db.cursor(dictionary=True)
    cur.execute("""
        SELECT id,name,format,size,download_link,image_url
        FROM ebooks ORDER BY id DESC
    """)
    res = cur.fetchall()
    for r in res:
        r['created_at'] = format_datetime(r.get('created_at'))
    cur.close()
    db.close()
    return jsonify(res)

@app.route('/api/ebooks', methods=['POST'])
def admin_add_ebook():
    data = request.get_json()
    db = get_db_connection()
    cur = db.cursor()
    cur.execute("""
        INSERT INTO ebooks (name,format,size,download_link,image_url)
        VALUES (%s,%s,%s,%s,%s)
    """, (
        data['name'], data['format'], data['size'],
        data['download_link'], data['image_url']
    ))
    db.commit()
    cur.close()
    db.close()
    return jsonify({'message': 'Ebook added'}), 201

@app.route('/api/ebooks/<int:ebook_id>', methods=['PUT'])
def admin_update_ebook(ebook_id):
    data = request.get_json()
    db = get_db_connection()
    cur = db.cursor()
    cur.execute("""
        UPDATE ebooks
        SET name=%s,format=%s,size=%s,download_link=%s,image_url=%s
        WHERE id=%s
    """, (
        data['name'], data['format'], data['size'],
        data['download_link'], data['image_url'], ebook_id
    ))
    db.commit()
    cur.close()
    db.close()
    return jsonify({'message': 'Ebook updated'}), 200

@app.route('/api/ebooks/<int:ebook_id>', methods=['DELETE'])
def admin_delete_ebook(ebook_id):
    db = get_db_connection()
    cur = db.cursor()
    cur.execute("DELETE FROM ebooks WHERE id=%s", (ebook_id,))
    db.commit()
    cur.close()
    db.close()
    return jsonify({'message': 'Ebook deleted'}), 200

# ─── Main ──────────────────────────────────────────────────────────────────────

if __name__ == '__main__':
    app.run(debug=True)
