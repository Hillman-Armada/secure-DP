import numpy as np

def laplace_mechanism(value, sensitivity, epsilon):
    """
    Apply Laplace mechanism for differential privacy
    :param value: The value to which we apply DP
    :param sensitivity: Sensitivity of the query
    :param epsilon: Privacy budget
    :return: Noisy value
    """
    scale = sensitivity / epsilon
    noise = np.random.laplace(0, scale)
    return value + noise
