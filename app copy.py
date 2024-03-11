# Import the Flask class
from flask import Flask, request, jsonify,send_file

import pandas as pd
from sentence_transformers import SentenceTransformer, util
import streamlit as st
import io
import base64
import uuid
import os
import psycopg2
from psycopg2.extras import RealDictCursor

# Create an instance of the Flask class
app = Flask(__name__)


DB_HOST = 'localhost'
DB_PORT = '5432'
DB_NAME = 'dhs'
DB_USER = 'sai'
DB_PASSWORD = 'Sai@1089'

conn = psycopg2.connect(
    host=DB_HOST,
    port=DB_PORT,
    database=DB_NAME,
    user=DB_USER,
    password=DB_PASSWORD
)

def create_table():
    with conn.cursor() as cursor:
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS qa_table (
                id SERIAL PRIMARY KEY,
                question TEXT,
                answer TEXT
            )
        ''')
    conn.commit()


UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

model = SentenceTransformer('all-MiniLM-L6-v2')

df = pd.read_excel('./DHS-DB-19-02-24-Q&A.xlsx')
questions = df['Questions'].astype(str).tolist()
answers = df['Answer'].tolist()

question_embeddings = model.encode(questions, convert_to_tensor=True)

def semantic_search(query):
    query_embedding = model.encode(query, convert_to_tensor=True)
    similarities = util.pytorch_cos_sim(query_embedding, question_embeddings)[0]
    most_similar_index = similarities.argmax()
    return answers[most_similar_index]

def generate_unique_filename():
    return str(uuid.uuid4()) + '.xlsx'

def insert_into_db(question, answer):
    with conn.cursor() as cursor:
        cursor.execute('INSERT INTO qa_table (question, answer) VALUES (%s, %s)', (question, answer))
    conn.commit()

def get_data_from_db():
    with conn.cursor(cursor_factory=RealDictCursor) as cursor:
        cursor.execute('SELECT * FROM qa_table')
        result = cursor.fetchall()
    return result

@app.route('/get_data', methods=['GET'])
def get_data():
    data = get_data_from_db()
    return jsonify(data)

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/upload_and_process', methods=['POST'])
def upload_and_process():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    if file and file.filename.endswith('.xlsx'):
        try:
            input_df = pd.read_excel(file)

            input_df['Answers'] = input_df['Questions'].astype(str).apply(semantic_search)

            filename = generate_unique_filename()

            output_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            input_df.to_excel(output_path, sheet_name='Sheet1', index=False)

            create_table()
            for _, row in input_df.iterrows():
                insert_into_db(row['Questions'], row['Answers'])

            download_link = f'/download/{filename}'

            return jsonify({'result': input_df.to_dict(orient='records'), 'download_link': download_link})
        except Exception as e:
            return jsonify({'error': f'Error processing Excel file: {str(e)}'})
    else:
        return jsonify({'error': 'Invalid file format. Please upload an Excel file (.xlsx)'})

@app.route('/download/<filename>')
def download_file(filename):
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    return send_file(file_path, as_attachment=True)


if __name__ == '__main__':
    app.run(debug=True)
