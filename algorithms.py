def bubble_sort(arr):
    steps = []
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            steps.append({"type": "compare", "indices": [j, j+1], "array": list(arr)})
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
                steps.append({"type": "swap", "indices": [j, j+1], "array": list(arr)})
    steps.append({"type": "sorted", "array": list(arr)})
    return steps

def selection_sort(arr):
    steps = []
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            steps.append({"type": "compare", "indices": [min_idx, j], "array": list(arr)})
            if arr[j] < arr[min_idx]:
                min_idx = j
        if min_idx != i:
            arr[i], arr[min_idx] = arr[min_idx], arr[i]
            steps.append({"type": "swap", "indices": [i, min_idx], "array": list(arr)})
    steps.append({"type": "sorted", "array": list(arr)})
    return steps

def insertion_sort(arr):
    steps = []
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and key < arr[j]:
            steps.append({"type": "compare", "indices": [j, j+1], "array": list(arr)})
            arr[j + 1] = arr[j]
            steps.append({"type": "shift", "indices": [j, j+1], "array": list(arr)})
            j -= 1
        arr[j + 1] = key
        steps.append({"type": "insert", "index": j + 1, "array": list(arr)})
    steps.append({"type": "sorted", "array": list(arr)})
    return steps

def binary_search(arr, target):
    steps = []
    low = 0
    high = len(arr) - 1
    
    while low <= high:
        mid = (low + high) // 2
        steps.append({"type": "check", "index": mid, "array": list(arr)})
        
        if arr[mid] == target:
            steps.append({"type": "found", "index": mid, "array": list(arr)})
            return steps
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
            
    steps.append({"type": "not_found", "array": list(arr)})
    return steps