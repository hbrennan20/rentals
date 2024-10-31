import pandas as pd
import streamlit as st

st.title("2017 CSV Reader")
df = pd.read_csv("/Users/hugh/Desktop/2017_wins_ie.csv")

st.write(df.head())


st.write(df.shape)


df.to_csv("/Users/hugh/Desktop/2017_wins_ie.csv", index=False)


st.metric(label="Number of Contracts", value=df.shape[0])

st.metric(label="Total Value of Contracts Awarded", value=format(df['AWARD_VALUE_EURO'].sum() / 1e9, '.2f') + " billion Euro")  # Convert to billions and format

grouped_df = df.groupby(['WIN_NAME']).agg(
    total_award_value=('AWARD_VALUE_EURO', 'sum'),
    contract_count=('AWARD_VALUE_EURO', 'count')
).reset_index()
grouped_df = grouped_df.sort_values(by='total_award_value', ascending=False)

st.title("Grouped by WIN_NAME, total AWARD_VALUE_EURO, and contract count:")
st.write(grouped_df)


distinct_winners = df['WIN_NAME'].unique()
selected_winner = st.selectbox("Select a Winner", distinct_winners)

if selected_winner:
    st.subheader(selected_winner)
    winner_contracts = df[df['WIN_NAME'] == selected_winner]
    st.write(winner_contracts)
    
    # Calculate number of contracts and total value in million euros
    num_contracts = winner_contracts.shape[0]
    total_value_mn = winner_contracts['AWARD_VALUE_EURO'].sum() / 1e6  # Convert to millions

    st.metric(label="Number of Contracts Won", value=num_contracts)
    st.metric(label="Total Value of Contracts Won (mn)", value=format(total_value_mn, '.2f') + " million Euro")
