import pandas as pd
import torch
from scripts.preprocessing import preprocess_data, split_data
from scripts.model import train_model, evaluate_model
import matplotlib.pyplot as plt

def visualize_predictions(model, X_test_tensor, y_test_tensor):
    model.eval()
    with torch.no_grad():
        predictions = model(X_test_tensor).numpy()

    plt.figure(figsize=(10, 6))
    plt.scatter(y_test_tensor.numpy(), predictions, alpha=0.5)
    plt.plot([y_test_tensor.min(), y_test_tensor.max()], [y_test_tensor.min(), y_test_tensor.max()], 'r--')
    plt.xlabel('Actual Yield')
    plt.ylabel('Predicted Yield')
    plt.title('Actual vs Predicted Yield')
    plt.show()

def run_pipeline():
    # Step 1: Load and preprocess the data
    df = preprocess_data("./data/crop_yield.csv")

    # Step 2: Split the data into training and test sets
    x_train, x_test, y_train, y_test = split_data(df)

    # Check data types
    print("Data types in x_train:")
    print(x_train.dtypes)

    # Step 3: Convert to PyTorch tensors
    X_train_tensor = torch.tensor(x_train.values, dtype=torch.float32)
    y_train_tensor = torch.tensor(y_train.values, dtype=torch.float32).view(-1, 1)
    X_test_tensor = torch.tensor(x_test.values, dtype=torch.float32)
    y_test_tensor = torch.tensor(y_test.values, dtype=torch.float32).view(-1, 1)

    # Step 4: Train a model using the training data
    model = train_model(X_train_tensor, y_train_tensor)

    # Step 5: Evaluate the model using the test data
    mae, mse, r2 = evaluate_model(model, X_test_tensor, y_test_tensor)

    # Print out the results
    print(f"Model Evaluation Metrics:")
    print(f"Mean Absolute Error: {mae}")
    print(f"Mean Squared Error: {mse}")
    print(f"R² Score: {r2}")
    visualize_predictions(model, X_test_tensor, y_test_tensor)

if __name__ == "__main__":
    run_pipeline()
