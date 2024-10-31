import streamlit as st
from PyPDF2 import PdfReader

st.title("PDF Text Extractor")


st.write("Need to set this up to scrape all pdfs from here: https://www.centralbank.ie/about/freedom-of-information/freedom-of-information-publication-scheme/procurement")


text = None

def extract_text_from_pdf(uploaded_file):
    if uploaded_file is not None:
        reader = PdfReader(uploaded_file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text
    return None


st.title("Manual PDF Text Extractor")
uploaded_file = st.file_uploader("Choose a PDF file", type="pdf")

if st.button("Extract Text"):
    text = extract_text_from_pdf(uploaded_file)
    if text:
        st.text_area("Extracted Text", text, height=300)
    else:
        st.error("No text found in the PDF.")


import openai

def get_winners_and_values(text):
    # Call OpenAI API to analyze the extracted text and get winners and their values
    openai.api_key = st.secrets["OPENAI_API_KEY"]  # Ensure your OpenAI API key is set in Streamlit secrets
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user", "content": f"From the following text, extract the list of actual winners and the value of the winnings for each contract:\n{text}"}
        ]
    )
    return response.choices[0].message['content']

if st.button("Get Winners and Values"):
    if text:
        winners_info = get_winners_and_values(text)
        st.text_area("Winners and Values", winners_info, height=300)
    else:
        st.error("No text available to analyze.")
