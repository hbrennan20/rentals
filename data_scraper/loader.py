import pandas as pd

# df = pd.read_csv("/Users/hugh/Desktop/2017_wins.csv")

# df = pd.read_csv("/Users/hugh/Desktop/2017_wins_ie.csv")

# df = df[df['ISO_COUNTRY_CODE'] == 'IE']
# 


# Using chunks to load large files

import pandas as pd
import streamlit as st

st.title("L5 CSV Reader")

# Initialize an empty DataFrame to store filtered results
filtered_df = pd.DataFrame()

x = 1
# Read the CSV in chunks
for chunk in pd.read_csv("/Users/hugh/Desktop/l5.csv", chunksize=100000, low_memory=False):
    filtered_chunk = chunk[chunk['ISO_COUNTRY_CODE'] == 'IE']  # Filter each chunk
    filtered_df = pd.concat([filtered_df, filtered_chunk])  # Concatenate the filtered chunk
    st.write(f"Chunk {x} processed")
    x += 1

filtered_df.to_csv("/Users/hugh/Desktop/l5_ie.csv", index=False)

st.write(filtered_df.head())