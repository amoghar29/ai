import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler

def preprocess_data(file_path):
    # Load data
    df = pd.read_csv(file_path)

    # Encode categorical features
    df = pd.get_dummies(df, columns=['Crop', 'Season', 'State'], drop_first=True)

    # Check for missing values
    if df.isnull().sum().any():
        print("Missing values found. Filling missing values with column means.")
        df.fillna(df.mean(), inplace=True)  # Fill missing values with mean

    # Convert all columns to numeric
    for col in df.columns:
        df[col] = pd.to_numeric(df[col], errors='coerce')

    # Scale numerical features
    scaler = MinMaxScaler()
    numerical_cols = df.columns.tolist()  # Get all columns after encoding

    # Scale all numerical columns
    df[numerical_cols] = scaler.fit_transform(df[numerical_cols])

    return df

def split_data(df):
    # Split features and target
    x = df.drop('Yield', axis=1)
    y = df['Yield']

    # Split data into train and test sets
    x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=42)

    return x_train, x_test, y_train, y_test