# Import the Flask class
from flask import Flask, request, jsonify,send_file

import pandas as pd
from sentence_transformers import SentenceTransformer, util
import streamlit as st
import io
import base64
import uuid
import os
from pymongo import MongoClient
from flask_cors import CORS
from datetime import datetime

# Create an instance of the Flask class
app = Flask(__name__)
CORS(app)

MONGO_URI = "mongodb+srv://maryalasai:Sai1089@saidb.jjlrjb0.mongodb.net/?retryWrites=true&w=majority"
DB_NAME = 'isq'

client = MongoClient(MONGO_URI)
db = client[DB_NAME]


def create_collection():
    db.create_collection('isqQuestions')

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

model = SentenceTransformer('all-MiniLM-L6-v2')

# df = pd.read_excel('./DHS-DB-19-02-24-Q&A.xlsx')
df = pd.read_excel('./DHS-data.xlsx')
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
    db.qa_collection.insert_one({'question': question, 'answer': answer})


@app.route('/get_data', methods=['GET'])
def get_data():
    create_collection()
    data = list(db.qa_collection.find({}, {'_id': 0}))
    return jsonify({'data': data})

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/download/<filename>')
def download_file(filename):
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    return send_file(file_path, as_attachment=True)



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

            create_collection()
            for _, row in input_df.iterrows():
                insert_into_db(row['Questions'], row['Answers'])

            download_link = f'/uploads/{filename}'

            return jsonify({'result': input_df.to_dict(orient='records'), 'download_link': download_link})
        except Exception as e:
            return jsonify({'error': f'Error processing Excel file: {str(e)}'})
    else:
        return jsonify({'error': 'Invalid file format. Please upload an Excel file (.xlsx)'})

@app.route('/upload_form', methods=['POST'])
def upload_form():
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

            # create_collection()
            # for _, row in input_df.iterrows():
            #     insert_into_db(row['Questions'], row['Answers'])

            download_link = f'/uploads/{filename}'

            return jsonify({'result': input_df.to_dict(orient='records'), 'download_link': download_link})
        except Exception as e:
            return jsonify({'error': f'Error processing Excel file: {str(e)}'})
    else:
        return jsonify({'error': 'Invalid file format. Please upload an Excel file (.xlsx)'})

@app.route('/get_all_data', methods=['GET'])
def get_all_data():
    try:
        if 'isqQuestions' not in db.list_collection_names():
            return jsonify({'data': []})
        data_cursor = db.isqQuestions.find({}, {'_id': 0})
        data_list = list(data_cursor)

        return jsonify({'data': data_list})
    except Exception as e:
        return jsonify({'error': f'Error retrieving data: {str(e)}'})

@app.route('/get_records_by_question', methods=['POST'])
def get_records_by_question():
    try:
        data = request.get_json()
        question_to_match = data.get('question', '')
        records_cursor = db.isqQuestions.find({'Question': question_to_match}, {'_id': 0})
        records_list = list(records_cursor)

        return jsonify({'data': records_list})
    except Exception as e:
        return jsonify({'error': f'Error retrieving records: {str(e)}'})

@app.route('/get_initial_data', methods=['GET'])
def get_data_from_excel():
    try:
        file_path = './initialdata.xlsx' 
        df = pd.read_excel(file_path)
        df = df.dropna(how='all')
        data_json = df.to_json(orient='records', date_format='iso', default_handler=str, force_ascii=False)

        return data_json
    except Exception as e:
        return jsonify({'error': f'Error reading Excel file: {str(e)}'})

# @app.route('/accept', methods=['POST'])
# def accept():
#     try:
#         if 'isqQuestions' not in db.list_collection_names():
#             db.create_collection('isqQuestions')

#         # Extract data from the request body
#         data = request.get_json()
#         question = data.get('Question')
#         quarter = data.get('quarter')
#         year = data.get('year')
#         answer = data.get('Answer')
        

       
#         newColumn = quarter+year
#         print(question,newColumn)
#         # Insert data into the "isqQuestions" collection
#         db.isqQuestions.insert_one({'Question': question, newColumn: answer,'verifiedON':datetime.now().strftime('%Y-%m-%d')})

#         return jsonify({'message': 'Collection created and data inserted successfully'})
#     except Exception as e:
#         return jsonify({'error': f'Error creating collection and inserting data: {str(e)}'})

@app.route('/accept', methods=['POST'])
def accept():
    try:
        data = request.get_json()
        question = data.get('Question')
        quarter = data.get('quarter')
        year = data.get('year')
        answer = data.get('Answer')

        new_column = quarter + year
        existing_document = db.isqQuestions.find_one({'Question': question})

        if existing_document:
            db.isqQuestions.update_one(
                {'Question': question},
                {'$set': {new_column: answer, 'verifiedON': datetime.now().strftime('%Y-%m-%d')}}
            )
            return jsonify({'message': f'Document with question "{question}" updated successfully'})
        else:
            db.isqQuestions.insert_one({'Question': question, new_column: answer, 'verifiedON': datetime.now().strftime('%Y-%m-%d')})
            return jsonify({'message': 'New document inserted successfully'})
    except Exception as e:
        return jsonify({'error': f'Error processing data: {str(e)}'})

@app.route('/reject_record', methods=['POST'])
def reject_record():
    try:
        # Get the question from the request body
        request_data = request.get_json()
        question_to_reject = request_data.get('question', '')

        # Delete the record with the specified question from the "isqQuestions" collection
        result = db.isqQuestions.delete_one({'Question': question_to_reject})

        if result.deleted_count > 0:
            return jsonify({'message': 'Record rejected successfully'})
        else:
            return jsonify({'error': 'Record not found'})

    except Exception as e:
        return jsonify({'error': f'Error rejecting record: {str(e)}'})

@app.route('/modifyold', methods=['POST'])
def modifyOld():
    try:
        if 'isqQuestions' not in db.list_collection_names():
            db.create_collection('isqQuestions')

        # Extract data from the request body
        data = request.get_json()
        question = data.get('Question')
        quarter = data.get('quarter')
        year = data.get('year')
        answer = data.get('Answer')
        

       
        newColumn = quarter+year
        print(question,newColumn)
        # Insert data into the "isqQuestions" collection
        db.isqQuestions.insert_one({'Question': question, newColumn: answer,'verifiedON':datetime.now().strftime('%Y-%m-%d')})
        file_path = './initialdata.xlsx'
        df = pd.read_excel(file_path)
        df = df[df['Questions'] != question]
        df.to_excel(file_path, index=False)

        return jsonify({'message': 'Collection created and data inserted successfully'})
    except Exception as e:
        return jsonify({'error': f'Error creating collection and inserting data: {str(e)}'})

@app.route('/update_record', methods=['PUT', 'PATCH'])
def update_record():
    try:
        request_data = request.get_json()
        question_to_update = request_data.get('Question', '')
        new_answer = request_data.get('Answer', '')
        # new_quarteryear = request_data.get('new_quarteryear', '')
        quarter = request_data.get('quarter')
        year = request_data.get('year')
        

       
        newColumn = quarter+year

        result = db.isqQuestions.update_one(
            {'Question': question_to_update},
            {'$set': {newColumn: new_answer}}
        )

        if result.modified_count > 0:
            return jsonify({'message': 'Record updated successfully'})
        else:
            return jsonify({'error': 'Record not found'})

    except Exception as e:
        return jsonify({'error': f'Error updating record: {str(e)}'})
    

if __name__ == '__main__':
    try:
        client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
        app.run(debug=True)
    except Exception as e:
        print(f"Error connecting to MongoDB: {str(e)}")
