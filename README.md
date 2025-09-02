# SON
Smile or Not AI Model in Web Project
# Smile Detector (SON Model) 😁

Real-time smile detection in the browser using **TensorFlow.js** and **Teachable Machine**.

> **SON = Smile Or Not** — a lightweight deep learning model trained to classify whether a person is smiling or not directly from the webcam feed.

---

## 🚀 Project Overview
This project allows users to open a simple webpage, grant access to their webcam, and instantly see whether they are smiling.  
The AI model runs **entirely in the browser** (on-device), which means:
- No images are uploaded to any server.
- Privacy is preserved.
- Performance is fast and responsive.

---

## ✨ Features
- 🔴 **Live Webcam Detection** — detects smiles in real-time.  
- 📊 **Confidence Meter** — shows how confident the model is.  
- 📈 **History Graph** — visualizes recent detection results.  
- 📝 **Detection Log** — keeps track of the last few detections with timestamps.  
- 🌙 **Light/Dark Mode** — toggle between themes for better UX.  
- ⚡ **Runs fully client-side** — no backend needed.  

---

## 🧠 How SON Model Works
The SON (Smile Or Not) model was trained using **Google Teachable Machine**.  

It consists of:
1. **`model.json`** → Defines the **architecture** of the model (layers, connections, input size).  
2. **`weights.bin`** → Contains the **learned weights** (knowledge the model gained during training).  
3. **`metadata.json`** → Provides extra info such as **class labels** (`Smiling`, `Not Smiling`) and input specifications.  

When the webpage loads:
- TensorFlow.js reads `model.json` to reconstruct the network.

- Loads the learned weights from `weights.bin`.
- Uses `metadata.json` to map outputs into human-readable labels.  

  Developed By Zeyad Zahran
