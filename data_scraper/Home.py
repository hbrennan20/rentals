import streamlit as st

from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
import pandas as pd
import plotly.express as px



def scrape_etenders():
    driver = webdriver.Chrome()
    try:
        url = "https://www.etenders.gov.ie/epps/quickSearchAction.do?d-3680175-p=&searchType=cftFTS&latest=true&T01_ps=100"
        driver.get(url)

        wait = WebDriverWait(driver, 10)

        # Get the page source
        page_source = driver.page_source

        # Parse the page source using BeautifulSoup
        soup = BeautifulSoup(page_source, 'html.parser')

        # Find the table by ID
        table = soup.find('table', {'id': 'T01'})
        if table is None:
            print("Table with ID 'T01' not found.")
            return

        # Find all rows in tbody
        rows = table.find('tbody').find_all('tr')
        print(f"Found {len(rows)} rows.")

        # Create lists to store data
        data = {
            'Title': [], 'Location': [], 'Date Published': [], 
            'Submission Deadline': [], 'Resource ID': [], 'Info': [],
            'Procedure': [], 'Status': [], 'Notice PDF': [],
            'Award Date': [], 'Estimated Value': [], 'Cycle': []
        }

        # Loop through each row
        for row in rows:
            # Extract title and its link
            title_cell = row.find('td', {'data-column': lambda x: x and 'Title' in x})
            title_link = title_cell.find('a') if title_cell else None
            data['Title'].append(title_link.text.strip() if title_link else None)

            # Extract other fields using data-column attributes
            data['Resource ID'].append(row.find('td', {'data-column': lambda x: x and 'Resource ID' in x}).text.strip() if row.find('td', {'data-column': lambda x: x and 'Resource ID' in x}) else None)
            data['Location'].append(row.find('td', {'data-column': lambda x: x and 'CA' in x}).text.strip() if row.find('td', {'data-column': lambda x: x and 'CA' in x}) else None)
            
            # Extract Info (get the title attribute from the img tag)
            info_cell = row.find('td', {'data-column': 'Info'})
            info_img = info_cell.find('img') if info_cell else None
            data['Info'].append(info_img['title'].strip() if info_img and 'title' in info_img.attrs else None)

            # Extract dates
            data['Date Published'].append(row.find('td', {'data-column': lambda x: x and 'Date published' in x}).text.strip() if row.find('td', {'data-column': lambda x: x and 'Date published' in x}) else None)
            data['Submission Deadline'].append(row.find('td', {'data-column': lambda x: x and 'Tenders Submission Deadline' in x}).text.strip() if row.find('td', {'data-column': lambda x: x and 'Tenders Submission Deadline' in x}) else None)

            # Extract other fields
            data['Procedure'].append(row.find('td', {'data-column': lambda x: x and 'Procedure' in x}).text.strip() if row.find('td', {'data-column': lambda x: x and 'Procedure' in x}) else None)
            data['Status'].append(row.find('td', {'data-column': lambda x: x and 'Status' in x}).text.strip() if row.find('td', {'data-column': lambda x: x and 'Status' in x}) else None)
            
            # Extract Notice PDF link
            pdf_cell = row.find('td', {'data-column': 'Notice PDF'})
            pdf_link = pdf_cell.find('a')['href'] if pdf_cell and pdf_cell.find('a') else None
            data['Notice PDF'].append(pdf_link)

            data['Award Date'].append(row.find('td', {'data-column': lambda x: x and 'Award date' in x}).text.strip() if row.find('td', {'data-column': lambda x: x and 'Award date' in x}) else None)
            data['Estimated Value'].append(row.find('td', {'data-column': 'Estimated value'}).text.strip() if row.find('td', {'data-column': 'Estimated value'}) else None)
            data['Cycle'].append(row.find('td', {'data-column': lambda x: x and 'Cycle' in x}).text.strip() if row.find('td', {'data-column': lambda x: x and 'Cycle' in x}) else None)

        # Create DataFrame
        df = pd.DataFrame(data)

        # Clean up the data
        df = df.apply(lambda x: x.str.strip() if isinstance(x, pd.Series) else x)

        # Display DataFrame in Streamlit
        st.title("E-Tenders Scraper")
        st.write("Scraped Data:")
        st.dataframe(df)

        # Export DataFrame to CSV
        df.to_csv('names.csv', index=False)

    finally:
        driver.quit()

# Add Streamlit button to trigger scraping
if st.button('Scrape E-Tenders'):
    scrape_etenders()


import os
from datetime import datetime

# Check if the 'names.csv' file exists and get its last modified time
csv_file = 'names.csv'
if os.path.exists(csv_file):
    last_modified_time = os.path.getmtime(csv_file)
    formatted_time = datetime.fromtimestamp(last_modified_time).strftime('%Y-%m-%d %H:%M:%S')
    st.write(f"The data was last scraped on: {formatted_time}")
else:
    st.write("'names.csv' does not exist.")



# Load the CSV file to calculate summary statistics
import pandas as pd


# Read the CSV file
df_summary = pd.read_csv('names.csv')

st.write(df_summary)
# Clean and convert Submission Deadline column to datetime
df_summary['Submission Deadline'] = pd.to_datetime(df_summary['Submission Deadline'], errors='coerce')

# Clean and convert Estimated Value column
df_summary['Estimated Value'] = df_summary['Estimated Value'].replace('[\€,]', '', regex=True).astype(float)

# Create a plotly scatter plot
fig = px.scatter(df_summary, 
                 x='Submission Deadline',
                 y='Estimated Value',
                 title='Estimated Values by Submission Deadline',
                 labels={'Submission Deadline': 'Submission Deadline', 'Estimated Value': 'Estimated Value (€)'},
                 hover_name='Title')  # Include title in the tooltip
fig.update_layout(showlegend=False)

# Display the chart
st.plotly_chart(fig)

# Display summary statistics
st.write("Summary Statistics:")
st.write(f"Total number of entries: {len(df_summary)}")

# Check if 'Estimated Value' column exists and calculate stats
if 'Estimated Value' in df_summary.columns:
    estimated_value_stats = df_summary['Estimated Value'].describe()
    st.write("Estimated Value Statistics:")
    st.write(estimated_value_stats)
else:
    st.write("'Estimated Value' column does not exist in the CSV.")

# Add Streamlit sidebar for filtering
min_value, max_value = st.sidebar.slider(
    'Select Estimated Value Range',
    min_value=0.0,
    max_value=float(df_summary['Estimated Value'].max()),
    value=(0.0, float(df_summary['Estimated Value'].max()))
)

# Filter DataFrame based on estimated value
df_summary_filtered = df_summary[
    (df_summary['Estimated Value'] >= min_value) & 
    (df_summary['Estimated Value'] <= max_value)
]

# Add date input for submission deadline filtering
submission_deadline = st.sidebar.date_input(
    'Select Submission Max Deadline',
    value=datetime.now()
)

# Filter DataFrame based on submission deadline
df_summary_filtered = df_summary_filtered[
    df_summary_filtered['Submission Deadline'].dt.date <= submission_deadline
]

# Display the filtered DataFrame
st.write(df_summary_filtered)


total_estimated_value = df_summary_filtered['Estimated Value'].sum()
total_contracts = df_summary_filtered.shape[0]

st.metric(label="Total Estimated Value", value=f"€{total_estimated_value:,.2f}")
st.metric(label="Total Contracts", value=total_contracts)
