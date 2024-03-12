# Import the Flask class
from flask import Flask, request, jsonify,send_file

import pandas as pd
from sentence_transformers import SentenceTransformer, util
import io
import base64
import uuid
import os
from pymongo import MongoClient
from flask_cors import CORS
from datetime import datetime, timedelta
import pinecone
import os
from pinecone import Pinecone, ServerlessSpec, PodSpec
from transformers import RagTokenizer, RagRetriever, RagTokenForGeneration
import pickle4 as pickle
import torch

os.environ['PINECONE_API_KEY'] = "37440df8-a7cb-405c-b346-e9ea5483ba03"
os.environ['PINECONE_ENVIRONMENT'] = 'gcp-starter'

pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))
index = pc.Index("question-answer")

device = 'cuda' if torch.cuda.is_available() else 'cpu'

retriever = RagRetriever.from_pretrained("facebook/rag-token-nq", index_name="exact", use_dummy_dataset=True)
 
# Load the retriever
# with open('retriever.pkl', 'rb') as f:
#     retriever = pickle.load(f)
model_name = RagTokenForGeneration.from_pretrained("facebook/rag-token-nq", retriever=retriever)

# Initialize tokenizer
tokenizer = RagTokenizer.from_pretrained("facebook/rag-token-nq")


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

# model = SentenceTransformer('all-MiniLM-L6-v2')

# df = pd.read_excel('./DHS-DB-19-02-24-Q&A.xlsx')
# df = pd.read_excel('./DHS-data.xlsx')
# questions = df['Questions'].astype(str).tolist()
# answers = df['Answer'].tolist()

# question_embeddings = model.encode(questions, convert_to_tensor=True)

# def semantic_search(query):
#     query_embedding = model.encode(query, convert_to_tensor=True)
#     similarities = util.pytorch_cos_sim(query_embedding, question_embeddings)[0]
#     most_similar_index = similarities.argmax()
#     return answers[most_similar_index]

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



# @app.route('/upload_and_process', methods=['POST'])
# def upload_and_process():
#     if 'file' not in request.files:
#         return jsonify({'error': 'No file part'})

#     file = request.files['file']

#     if file.filename == '':
#         return jsonify({'error': 'No selected file'})

#     if file and file.filename.endswith('.xlsx'):
#         try:
#             input_df = pd.read_excel(file)

#             input_df['Answers'] = input_df['Questions'].astype(str).apply(semantic_search)

#             filename = generate_unique_filename()

#             output_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
#             input_df.to_excel(output_path, sheet_name='Sheet1', index=False)

#             create_collection()
#             for _, row in input_df.iterrows():
#                 insert_into_db(row['Questions'], row['Answers'])

#             download_link = f'/uploads/{filename}'

#             return jsonify({'result': input_df.to_dict(orient='records'), 'download_link': download_link})
#         except Exception as e:
#             return jsonify({'error': f'Error processing Excel file: {str(e)}'})
#     else:
#         return jsonify({'error': 'Invalid file format. Please upload an Excel file (.xlsx)'})

# @app.route('/upload_form', methods=['POST'])
# def upload_form():
#     if 'file' not in request.files:
#         return jsonify({'error': 'No file part'})

#     file = request.files['file']

#     if file.filename == '':
#         return jsonify({'error': 'No selected file'})

#     if file and file.filename.endswith('.xlsx'):
#         try:
#             input_df = pd.read_excel(file)

#             input_df['Answers'] = input_df['Questions'].astype(str).apply(semantic_search)

#             filename = generate_unique_filename()

#             output_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
#             input_df.to_excel(output_path, sheet_name='Sheet1', index=False)

#             # create_collection()
#             # for _, row in input_df.iterrows():
#             #     insert_into_db(row['Questions'], row['Answers'])

#             download_link = f'/uploads/{filename}'

#             return jsonify({'result': input_df.to_dict(orient='records'), 'download_link': download_link})
#         except Exception as e:
#             return jsonify({'error': f'Error processing Excel file: {str(e)}'})
#     else:
#         return jsonify({'error': 'Invalid file format. Please upload an Excel file (.xlsx)'})

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



def get_context(question, top_k,selected_category):
    # Prepare the question
    input_dict = tokenizer(question, return_tensors="pt")
    # Pass the input through the model
    outputs = model_name(input_dict["input_ids"])
    # Get the embeddings
    embeddings = outputs.question_encoder_last_hidden_state
    # Convert the tensor to a list
    xq = embeddings.tolist()

    # search pinecone index for context passage with the answer
    xc = index.query(vector=xq, top_k=top_k, include_metadata=True)

    # get the current date
    current_date = datetime.now()
    # calculate the date 60 months ago
    six_months_ago = current_date - timedelta(days=6*30)

    # extract the context passage from pinecone search result
    c = []
    for x in xc["matches"]:
        # convert the 'Verification_Date' to a datetime object
        verification_date = datetime.strptime(x["metadata"]['Verification_Date'], "%Y-%m-%d")
        # check if 'Verification_Date' is less than 6 months old and 'Category' matches the selected category
        if verification_date >= six_months_ago and x["metadata"]['Category'] == selected_category:
           # Create a dictionary for the answer and context
            context = {"context": x["metadata"]['Answers']}
            c.append(context)
        # check if 'Verification_Date' is less than 6 months old and 'Category' matches the selected category
        #if verification_date >= six_months_ago :
           # Create a dictionary for the answer and context
            #context = {"context": x["metadata"]['Answers']}
            #c.append(context)

    return c

from pprint import pprint

def extract_answer(question, context):
    results = []
    for c in context:
        # Extract the string from the 'context' key of the dictionary
        context_str = c['context']
        # Prepare the question and context
        input_dict = tokenizer.prepare_seq2seq_batch(src_texts=question, tgt_texts=context_str, return_tensors="pt")
        # Pass the input through the model
        outputs = model_name(input_dict["input_ids"])
        # Get the logits
        logits = outputs.logits
        # Convert logits to token ids
        token_ids = torch.argmax(logits, dim=-1)
        # Decode the token ids to get the answer
        answer_text = tokenizer.batch_decode(token_ids, skip_special_tokens=True)[0]  # select the first element
        # Create a dictionary for the answer and context
        answer = {"answer": answer_text, "context": context_str}
        results.append(answer)
    # print the results
    for result in results:
        print(result)
    return results



@app.route('/process_excel', methods=['POST'])
def process_excel():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']

    if file.filename.endswith('.xls') or file.filename.endswith('.xlsx'):
        df = pd.read_excel(file)
        if 'question_column' not in df.columns or 'category_column' not in df.columns:
            return jsonify({"error": "Missing required columns in the Excel file"}), 400

        result = []
        for _, row in df.iterrows():
            question = row['question_column']
            category = row['category_column']

            context = get_context(question, top_k=1, selected_category=category)
            answer=extract_answer(question, context)
            result.append({"question": question, "answer": answer})

        return jsonify({"result": result})

    else:
        return jsonify({"error": "Invalid file format. Please provide an Excel file"}), 400

if __name__ == '__main__':
    try:
        client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
        app.run(debug=True)
    except Exception as e:
        print(f"Error connecting to MongoDB: {str(e)}")
