    const video = document.getElementById('webcam');
    const predictionEl = document.getElementById('prediction');
    const confidenceFill = document.getElementById('confidenceFill');
    const smilePercentEl = document.getElementById('smilePercent');
    const historyGraph = document.getElementById('historyGraph');
    const historyContainer = document.getElementById('historyContainer');
    const themeToggle = document.getElementById('themeToggle');
    const helpBtn = document.getElementById('helpBtn');
    
    let model;
    let history = [];
    let smileCount = 0;
    let detectionCount = 0;
    const maxHistory = 5;
    const maxGraphBars = 20;
    
    async function init() {
      try {
        predictionEl.innerHTML = '<div class="loader"></div> Loading model...';
        model = await tf.loadLayersModel("model/model.json");
        predictionEl.innerHTML = '<i class="fas fa-check-circle" style="color: var(--success);"></i> Model Loaded';
        
        await setupWebcam();
        
        setTimeout(() => {
          predictionEl.innerHTML = '<i class="fas fa-smile" style="color: var(--neutral);"></i> Ready to detect';
          setInterval(predictLoop, 400);
        }, 1000);
      } catch (error) {
        predictionEl.innerHTML = '<i class="fas fa-exclamation-circle" style="color: #ef4444;"></i> Error loading model';
        console.error('Error loading model:', error);
      }
    }
    
    async function setupWebcam() {
      return new Promise((resolve, reject) => {
        navigator.mediaDevices.getUserMedia({ video: true })
          .then(stream => {
            video.srcObject = stream;
            video.addEventListener('loadeddata', () => {
              resolve();
            });
          })
          .catch(error => {
            predictionEl.innerHTML = '<i class="fas fa-video-slash" style="color: #ef4444;"></i> Camera access denied';
            console.error('Camera error:', error);
            reject(error);
          });
      });
    }
    
    async function predictLoop() {
      if (!model || video.readyState !== 4) return;
      
      try {
        const tensor = tf.browser.fromPixels(video)
          .resizeNearestNeighbor([224, 224])
          .toFloat()
          .expandDims();
        
        const prediction = await model.predict(tensor).data();
        
        const smileConfidence = (prediction[0] * 100).toFixed(1);
        const notSmileConfidence = (prediction[1] * 100).toFixed(1);
        const result = prediction[0] > prediction[1] ? 1 : 0;
        
        detectionCount++;
        history.push(result);
        if (history.length > maxHistory) history.shift();
        
        const avg = history.reduce((a, b) => a + b, 0) / history.length;
        const smilePercentage = (avg * 100).toFixed(0);
        
        updateUI(result, smileConfidence, notSmileConfidence, smilePercentage);
        
        tensor.dispose();
      } catch (error) {
        console.error('Prediction error:', error);
      }
    }
    
    function updateUI(result, smileConfidence, notSmileConfidence, smilePercentage) {
      const confidenceValue = result ? smileConfidence : notSmileConfidence;
      confidenceFill.style.width = `${confidenceValue}%`;
      
      if (result) {
        predictionEl.innerHTML = `<i class="fas fa-smile-beam pulse" style="color: var(--success);"></i> Smiling! (Confidence: ${smileConfidence}%)`;
        
        if (history.length === maxHistory && avg > 0.7) {
          smileCount++;
        }
      } else {
        predictionEl.innerHTML = `<i class="fas fa-meh" style="color: var(--neutral);"></i> Not Smiling (Confidence: ${notSmileConfidence}%)`;
      }
      
      smilePercentEl.textContent = `${smilePercentage}%`;
      smilePercentEl.style.color = smilePercentage >= 50 ? 'var(--success)' : 'var(--neutral)';
      
      updateHistoryGraph(result);
      
      updateDetectionLog(result, confidenceValue);
    }
    
    function updateHistoryGraph(result) {
      const bar = document.createElement('div');
      bar.className = 'graph-bar';
      bar.style.height = `${result * 100}%`;
      bar.style.background = result ? 'var(--success)' : 'var(--neutral)';
      
      historyGraph.appendChild(bar);
      
      if (historyGraph.children.length > maxGraphBars) {
        historyGraph.removeChild(historyGraph.children[0]);
      }
    }
    
    function updateDetectionLog(result, confidence) {
      const now = new Date();
      const timeString = now.toLocaleTimeString();
      
      const logItem = document.createElement('div');
      logItem.className = 'history-item';
      logItem.innerHTML = `
        <span><i class="fas ${result ? 'fa-smile-beam text-success' : 'fa-meh'}"></i> ${result ? 'Smile' : 'Neutral'}</span>
        <span>${confidence}%</span>
        <span class="history-time">${timeString}</span>
      `;
      
      historyContainer.prepend(logItem);
      
      if (historyContainer.children.length > 5) {
        historyContainer.removeChild(historyContainer.lastChild);
      }
    }
    
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      themeToggle.innerHTML = document.body.classList.contains('dark-mode') ? 
        '<i class="fas fa-sun"></i> Light Mode' : 
        '<i class="fas fa-moon"></i> Dark Mode';
    });
    
    helpBtn.addEventListener('click', () => {
      alert('Smile Detector Help:\n\n1. Allow camera access when prompted\n2. Make sure your face is clearly visible\n3. The AI will detect if you are smiling or not\n4. Results are based on the average of the last 5 detections');
    });
    
    init();