import pandas as pd
import streamlit as st
import plotly.express as px

# Configure the page to use full screen width
st.set_page_config(layout="wide")

df = pd.read_csv("/Users/hugh/Desktop/l5_ie.csv")


duplicate_id_notices = df[df.duplicated(subset='ID_NOTICE_CAN', keep=False)]
st.write("Duplicate ID_NOTICE_CAN values:")
st.dataframe(duplicate_id_notices)



# Keep the row with maximum AWARD_VALUE_EURO for each ID_NOTICE_CAN
# df = df.sort_values('AWARD_VALUE_EURO', ascending=False).drop_duplicates(subset='ID_NOTICE_CAN')





columns_to_move = ['TITLE', 'CAE_NAME', 'CAE_ADDRESS', 'AWARD_VALUE_EURO', 'NUMBER_OFFERS', 'WIN_NAME', 'WIN_ADDRESS', 'WIN_TOWN', 'DT_AWARD']
df = df[columns_to_move + [col for col in df.columns if col not in columns_to_move]]

st.title("Headline figures")

distinct_winners = df['WIN_NAME'].unique()
distinct_caes = df['CAE_NAME'].unique()

# Add sidebar for filtering
st.sidebar.title("Filter Options")
selected_years = st.sidebar.multiselect("Select Years", ['All'] + list(df['YEAR'].unique()), default=['All'])
selected_winners = st.sidebar.multiselect("Select Winners", ['All'] + list(distinct_winners), default=['All'])
selected_caes = st.sidebar.multiselect("Select Buyers", ['All'] + list(distinct_caes), default=['All'])

# Filter the full DataFrame based on selections
filtered_df = df.copy()
if 'All' not in selected_years:
    filtered_df = filtered_df[filtered_df['YEAR'].isin(selected_years)]
if 'All' not in selected_winners:
    filtered_df = filtered_df[filtered_df['WIN_NAME'].isin(selected_winners)]
if 'All' not in selected_caes:
    filtered_df = filtered_df[filtered_df['CAE_NAME'].isin(selected_caes)]

col1, col2, col3, col4 = st.columns(4)

with col1:
    st.metric(label="Number of Contracts", value=filtered_df.shape[0])

with col2:
    st.metric(label="Total Won", value=format(filtered_df['AWARD_VALUE_EURO'].sum() / 1e9, '.2f') + " bn")  # Convert to billions and format

with col3:
    st.metric(label="Average Contract Value", value=format(filtered_df['AWARD_VALUE_EURO'].mean() / 1e6, '.2f') + " mn")  # Convert to millions
with col1:
    st.metric(label="Sole Bidder", value=filtered_df[filtered_df['NUMBER_OFFERS'] == 1].shape[0])


with col4:
    max_value = filtered_df['AWARD_VALUE_EURO'].max()
    if max_value >= 1e9:
        st.metric(label="Max Contract Value", value=format(max_value / 1e9, '.2f') + " bn")  # Convert to billions
    else:
        st.metric(label="Max Contract Value", value=format(max_value / 1e6, '.2f') + " mn")  # Convert to millions
    st.metric(label="Min Contract Value", value=format(filtered_df['AWARD_VALUE_EURO'].min() / 1e6, '.2f') + " mn")  # Convert to millions


with st.expander("View Data"):
    st.write(filtered_df)


yearly_total_value = filtered_df.groupby(filtered_df['YEAR'])['AWARD_VALUE_EURO'].sum().reset_index()
yearly_total_value['AWARD_VALUE_EURO'] = yearly_total_value['AWARD_VALUE_EURO'] / 1e6  # Convert to millions
yearly_total_value.columns = ['Year', 'Total Value (mn)']  # Rename columns for clarity

# Create a bar chart using Plotly Express
fig = px.bar(yearly_total_value, x='Year', y='Total Value (mn)', title='Total Contract Value by Year')
st.plotly_chart(fig)



grouped_df = df.groupby(['WIN_NAME']).agg(
    total_award_value=('AWARD_VALUE_EURO', 'sum'),
    contract_count=('AWARD_VALUE_EURO', 'count')
).reset_index()
grouped_df = grouped_df.sort_values(by='total_award_value', ascending=False)

st.title("Contract Winners:")
st.write(grouped_df)


# Update metrics based on filtered DataFrame
st.metric(label="Number of Contracts", value=filtered_df.shape[0])
st.metric(label="Total Value of Contracts Awarded", value=format(filtered_df['AWARD_VALUE_EURO'].sum() / 1e9, '.2f') + " billion Euro")

# Display the filtered DataFrame
st.subheader("Filtered Contracts")
st.write(filtered_df)

if selected_winners:
    st.subheader("Winners: " + ", ".join(selected_winners))
    winner_contracts = filtered_df  # Use filtered DataFrame
    st.write(winner_contracts)
    
    # Calculate number of contracts and total value in million euros
    num_contracts = winner_contracts.shape[0]
    total_value_mn = winner_contracts['AWARD_VALUE_EURO'].sum() / 1e6  # Convert to millions

    st.metric(label="Number of Contracts Won", value=num_contracts)
    st.metric(label="Total Value of Contracts Won (mn)", value=format(total_value_mn, '.2f') + " million Euro")



    yearly_total_value = df.groupby(df['YEAR'])['AWARD_VALUE_EURO'].sum().reset_index()
    yearly_total_value['AWARD_VALUE_EURO'] = yearly_total_value['AWARD_VALUE_EURO'] / 1e6  # Convert to millions
    yearly_total_value.columns = ['Year', 'Total Value (mn)']  # Rename columns for clarity



grouped_df = df.groupby(['CAE_NAME']).agg(
    total_award_value=('AWARD_VALUE_EURO', 'sum'),
    contract_count=('AWARD_VALUE_EURO', 'count')
).reset_index()
grouped_df = grouped_df.sort_values(by='total_award_value', ascending=False)

st.title("Contract Buyers:")
st.write(grouped_df)

import plotly.express as px

# Group by YEAR and CAE_NAME to get total values over time
yearly_cae_values = df.groupby(['YEAR', 'CAE_NAME'])['AWARD_VALUE_EURO'].sum().reset_index()
yearly_cae_values['AWARD_VALUE_EURO'] = yearly_cae_values['AWARD_VALUE_EURO'] / 1e6  # Convert to millions

# Show only the top 10 CAEs based on total award value
top_cae_values = yearly_cae_values.groupby('CAE_NAME').agg({'AWARD_VALUE_EURO': 'sum'}).nlargest(10, 'AWARD_VALUE_EURO').reset_index()
yearly_cae_values = yearly_cae_values[yearly_cae_values['CAE_NAME'].isin(top_cae_values['CAE_NAME'])]

# Check if there are any values to plot
if not yearly_cae_values.empty:
    # Create a line chart for total values over time using Plotly Express
    fig = px.line(yearly_cae_values, x='YEAR', y='AWARD_VALUE_EURO', color='CAE_NAME',
                  title='Total Value of Contracts Awarded Over Time (in million Euros)',
                  labels={'AWARD_VALUE_EURO': 'Total Value (mn)', 'YEAR': 'Year'})  # Add labels for axes

    # Display the line chart in Streamlit
    st.plotly_chart(fig, use_container_width=True)  # Use container width for better display
else:
    st.warning("No data available to display the chart.")
