import argparse
import importlib
import json
import os
import time

import psutil
import requests
import torch

def benchmark_model(model, device, input_tensor, iterations=50):
    # Warm up the model
    for _ in range(10):
        _ = model(input_tensor)
    
    # Measure inference latency over a number of iterations
    start_time = time.time()
    for _ in range(iterations):
        _ = model(input_tensor)
    end_time = time.time()
    
    total_time_ms = (end_time - start_time) * 1000  # total time in ms
    avg_latency = total_time_ms / iterations         # average latency per inference in ms
    throughput = iterations / (end_time - start_time)  # req/sec
    
    return avg_latency, throughput

def get_model_size(model):
    """Compute model size in MB based on its parameters."""
    param_size = sum(p.numel() * p.element_size() for p in model.parameters())
    return param_size / (1024 ** 2)  # Convert bytes to MB

def get_memory_usage():
    """Get current process memory usage in MB."""
    process = psutil.Process(os.getpid())
    mem_usage = process.memory_info().rss  # in bytes
    return mem_usage / (1024 ** 2)  # Convert to MB

def get_input_tensor(model, device):
    """
    Evaluate the model to determine an appropriate input shape.
    For many torchvision models, `default_cfg` may contain an 'input_size' key.
    Otherwise, fall back to a default shape of (1, 3, 224, 224).
    """
    input_shape = None
    if hasattr(model, "default_cfg") and isinstance(model.default_cfg, dict):
        # Some models provide input_size as (channels, height, width)
        if "input_size" in model.default_cfg:
            cfg_input_size = model.default_cfg["input_size"]
            if isinstance(cfg_input_size, (list, tuple)):
                input_shape = (1, *cfg_input_size)
    # Fallback default input shape.
    if input_shape is None:
        input_shape = (1, 3, 224, 224)
    return torch.randn(input_shape).to(device)

def main():
    parser = argparse.ArgumentParser(
        description="Benchmark a PyTorch model and send results to an API endpoint."
    )
    # Create a mutually exclusive group so only one model specification is provided.
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument(
        '--model',
        type=str,
        help="Fully qualified model class name (e.g., torchvision.models.resnet50)"
    )
    group.add_argument(
        '--model_file',
        type=str,
        help="Path to a saved PyTorch model (.pt file)"
    )
    group.add_argument(
        '--model_variable',
        type=str,
        help="Fully qualified variable name for a PyTorch model (e.g., mymodule.my_model)"
    )
    parser.add_argument(
        '--pretrained',
        action='store_true',
        help="Use pretrained weights if available (only applicable with --model)"
    )
    parser.add_argument(
        '--iterations',
        type=int,
        default=50,
        help="Number of iterations for benchmarking (default: 50)"
    )
    parser.add_argument(
        '--api_endpoint',
        type=str,
        default="http://localhost:3000/api/models",
        help="API endpoint URL to send the JSON data (default: http://localhost:3000/api/route)"
    )
    args = parser.parse_args()

    # Set up device: GPU if available, else CPU.
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = None

    if args.model_file:
        # Load the model from a .pt file.
        try:
            model = torch.load(args.model_file, map_location=device)
            print(f"Loaded model from file: {args.model_file}")
        except Exception as e:
            print("Error loading model from file:", e)
            return
    elif args.model_variable:
        # Import a model from a variable (e.g., mymodule.my_model)
        try:
            module_path, var_name = args.model_variable.rsplit(".", 1)
            module = importlib.import_module(module_path)
            model = getattr(module, var_name)
            print(f"Imported model variable: {args.model_variable}")
        except Exception as e:
            print("Error importing model variable:", e)
            return
    else:
        # Dynamically import the model class and instantiate it.
        try:
            module_path, class_name = args.model.rsplit(".", 1)
        except ValueError:
            print("Error: --model must be a fully qualified name (e.g., torchvision.models.resnet50)")
            return

        try:
            module = importlib.import_module(module_path)
            model_class = getattr(module, class_name)
        except Exception as e:
            print("Error importing model class:", e)
            return

        try:
            if args.pretrained:
                model = model_class(pretrained=True)
            else:
                model = model_class()
            print(f"Instantiated model: {class_name}")
        except Exception as e:
            print("Error instantiating model:", e)
            return

    # Set model to evaluation mode and move to the selected device.
    model.eval()
    model.to(device)

    # Create a dummy input tensor based on the model's expected input.
    input_tensor = get_input_tensor(model, device)
    print(f"Using input shape: {input_tensor.shape}")

    # Benchmark the model.
    avg_latency, throughput = benchmark_model(model, device, input_tensor, iterations=args.iterations)
    model_size = get_model_size(model)
    memory_usage = get_memory_usage()
    power_consumption = 10  # Dummy value; real measurement would require extra tools

    # Build the JSON payload.
    output_data = {
        "model_name": args.model_file if args.model_file else (args.model_variable if args.model_variable else args.model),
        "metrics": {
            "Inference Latency": {"value": round(avg_latency, 2), "unit": "ms"},
            "Throughput": {"value": round(throughput, 2), "unit": "req/sec"},
            "Memory Usage": {"value": round(memory_usage, 2), "unit": "MB"},
            "Model Size": {"value": round(model_size, 2), "unit": "MB"},
            "Power Consumption": {"value": power_consumption, "unit": "Watts"}
        }
    }

    json_output = json.dumps(output_data, indent=2)
    print("Benchmark Results:")
    print(json_output)

    # Send the JSON payload to the API endpoint.
    headers = {"Content-Type": "application/json"}
    try:
        response = requests.post(args.api_endpoint, headers=headers, data=json_output)
        print("Response from API:")
        print(response.status_code, response.text)
    except Exception as e:
        print("Failed to send data to API:", e)

if __name__ == "__main__":
    main()
