import torch
import torch.nn as nn
import torch.optim as optim
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

class CropYieldModel(nn.Module):
    def __init__(self, input_size):
        super(CropYieldModel, self).__init__()
        self.fc1 = nn.Linear(input_size, 64)
        self.fc2 = nn.Linear(64, 32)
        self.fc3 = nn.Linear(32, 1)

    def forward(self, x):
        x = torch.relu(self.fc1(x))
        x = torch.relu(self.fc2(x))
        x = self.fc3(x)
        return x

def train_model(X_train_tensor, y_train_tensor, epochs=100, lr=0.001):
    input_size = X_train_tensor.shape[1]  # Get the number of features
    model = CropYieldModel(input_size)
    criterion = nn.MSELoss()
    optimizer = optim.Adam(model.parameters(), lr=lr)

    for epoch in range(epochs):
        model.train()
        optimizer.zero_grad()
        output = model(X_train_tensor)
        loss = criterion(output, y_train_tensor)
        loss.backward()
        optimizer.step()

        if (epoch + 1) % 10 == 0:
            print(f"Epoch [{epoch+1}/{epochs}], Loss: {loss.item()}")

    return model

def evaluate_model(model, X_test_tensor, y_test_tensor):
    model.eval()
    with torch.no_grad():
        predictions = model(X_test_tensor)
        mse = mean_squared_error(y_test_tensor.numpy(), predictions.numpy())
        mae = mean_absolute_error(y_test_tensor.numpy(), predictions.numpy())
        r2 = r2_score(y_test_tensor.numpy(), predictions.numpy())
    return mae, mse, r2