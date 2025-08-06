import { KeystrokePattern, BiometricProfile } from '../types';

/**
 * Real Neural Network Implementation for Keystroke Dynamics
 * Implements a multi-layer perceptron with backpropagation
 */

export interface NeuralNetworkConfig {
  inputSize: number;
  hiddenLayers: number[];
  outputSize: number;
  learningRate: number;
  epochs: number;
  batchSize: number;
  momentum?: number;
  optimizer?: 'sgd' | 'adam';
  regularization?: number;
}

export interface TrainingData {
  inputs: number[][];
  targets: number[][];
}

export interface PredictionResult {
  confidence: number;
  probability: number;
  features: number[];
  processingTime: number;
}

export class KeystrokeNeuralNetwork {
  private weights: number[][][];
  private biases: number[][];
  private previousWeightDeltas: number[][][];
  private previousBiasDeltas: number[][];
  private config: NeuralNetworkConfig;
  private activations: number[][];
  private errors: number[][];

  constructor(config: NeuralNetworkConfig) {
    this.config = {
      momentum: 0.9,
      optimizer: 'sgd',
      regularization: 0.01,
      ...config
    };
    this.initializeNetwork();
  }

  /**
   * Initialize network with random weights and biases
   */
  private initializeNetwork(): void {
    const layers = [this.config.inputSize, ...this.config.hiddenLayers, this.config.outputSize];
    
    this.weights = [];
    this.biases = [];
    this.previousWeightDeltas = [];
    this.previousBiasDeltas = [];
    this.activations = [];
    this.errors = [];

    // Initialize weights using Xavier/Glorot initialization
    for (let i = 0; i < layers.length - 1; i++) {
      const inputSize = layers[i];
      const outputSize = layers[i + 1];
      
      // Xavier initialization: sqrt(6 / (fan_in + fan_out))
      const limit = Math.sqrt(6 / (inputSize + outputSize));
      
      const layerWeights: number[][] = [];
      const layerWeightDeltas: number[][] = [];
      
      for (let j = 0; j < outputSize; j++) {
        const neuronWeights: number[] = [];
        const neuronWeightDeltas: number[] = [];
        
        for (let k = 0; k < inputSize; k++) {
          neuronWeights.push((Math.random() * 2 - 1) * limit);
          neuronWeightDeltas.push(0);
        }
        
        layerWeights.push(neuronWeights);
        layerWeightDeltas.push(neuronWeightDeltas);
      }
      
      this.weights.push(layerWeights);
      this.previousWeightDeltas.push(layerWeightDeltas);
      
      // Initialize biases
      const layerBiases: number[] = [];
      const layerBiasDeltas: number[] = [];
      
      for (let j = 0; j < outputSize; j++) {
        layerBiases.push(0);
        layerBiasDeltas.push(0);
      }
      
      this.biases.push(layerBiases);
      this.previousBiasDeltas.push(layerBiasDeltas);
    }

    // Initialize activation and error arrays
    for (let i = 0; i < layers.length; i++) {
      this.activations.push(new Array(layers[i]).fill(0));
      this.errors.push(new Array(layers[i]).fill(0));
    }
  }

  /**
   * Extract comprehensive features from keystroke pattern
   */
  extractKeystrokeFeatures(pattern: KeystrokePattern): number[] {
    const timings = pattern.timings;
    if (timings.length < 2) return new Array(this.config.inputSize).fill(0);

    const features: number[] = [];

    // 1. Dwell times (key press duration)
    const dwellTimes = timings
      .filter(t => t.duration !== null)
      .map(t => t.duration!);

    // 2. Flight times (inter-key intervals)
    const flightTimes: number[] = [];
    for (let i = 0; i < timings.length - 1; i++) {
      if (timings[i].releaseTime && timings[i + 1].pressTime) {
        flightTimes.push(timings[i + 1].pressTime - timings[i].releaseTime!);
      }
    }

    // 3. Key-specific timings
    const keyTimings: Record<string, number[]> = {};
    timings.forEach(t => {
      if (!keyTimings[t.key]) keyTimings[t.key] = [];
      if (t.duration) keyTimings[t.key].push(t.duration);
    });

    // Statistical features for dwell times
    features.push(
      this.calculateMean(dwellTimes),
      this.calculateStdDev(dwellTimes),
      this.calculateSkewness(dwellTimes),
      this.calculateKurtosis(dwellTimes),
      this.calculateMedian(dwellTimes),
      Math.min(...dwellTimes) || 0,
      Math.max(...dwellTimes) || 0
    );

    // Statistical features for flight times
    features.push(
      this.calculateMean(flightTimes),
      this.calculateStdDev(flightTimes),
      this.calculateSkewness(flightTimes),
      this.calculateKurtosis(flightTimes),
      this.calculateMedian(flightTimes),
      Math.min(...flightTimes) || 0,
      Math.max(...flightTimes) || 0
    );

    // Rhythm and tempo features
    features.push(
      this.calculateTypingRhythm(timings),
      this.calculateTypingTempo(timings),
      this.calculateVelocityVariation(timings),
      this.calculateAccelerationPattern(timings)
    );

    // Key-specific statistical features
    const commonKeys = ['e', 't', 'a', 'o', 'i', 'n', 's', 'h', 'r'];
    for (const key of commonKeys) {
      const keyDwells = keyTimings[key] || [];
      features.push(
        this.calculateMean(keyDwells),
        this.calculateStdDev(keyDwells)
      );
    }

    // Bigram and trigram timing features
    const bigramTimes = this.calculateBigramTimings(timings);
    const trigramTimes = this.calculateTrigramTimings(timings);
    
    features.push(
      this.calculateMean(bigramTimes),
      this.calculateStdDev(bigramTimes),
      this.calculateMean(trigramTimes),
      this.calculateStdDev(trigramTimes)
    );

    // Pressure and force patterns (simulated for non-touch devices)
    features.push(
      this.calculatePressurePattern(timings),
      this.calculateForceVariation(timings)
    );

    // Normalize and pad features to input size
    const normalizedFeatures = this.normalizeFeatures(features);
    
    // Pad or truncate to exact input size
    while (normalizedFeatures.length < this.config.inputSize) {
      normalizedFeatures.push(0);
    }
    
    return normalizedFeatures.slice(0, this.config.inputSize);
  }

  /**
   * Forward propagation through the network
   */
  private forwardPass(inputs: number[]): number[] {
    // Set input layer
    this.activations[0] = [...inputs];

    // Propagate through hidden layers and output layer
    for (let layer = 0; layer < this.weights.length; layer++) {
      const currentLayerSize = this.weights[layer].length;
      
      for (let neuron = 0; neuron < currentLayerSize; neuron++) {
        let sum = this.biases[layer][neuron];
        
        for (let input = 0; input < this.activations[layer].length; input++) {
          sum += this.activations[layer][input] * this.weights[layer][neuron][input];
        }
        
        // Apply activation function
        if (layer === this.weights.length - 1) {
          // Output layer - sigmoid for binary classification
          this.activations[layer + 1][neuron] = this.sigmoid(sum);
        } else {
          // Hidden layers - ReLU for better gradient flow
          this.activations[layer + 1][neuron] = this.relu(sum);
        }
      }
    }

    return [...this.activations[this.activations.length - 1]];
  }

  /**
   * Backward propagation for training
   */
  private backwardPass(target: number[]): void {
    const outputLayer = this.activations.length - 1;

    // Calculate output layer errors
    for (let i = 0; i < target.length; i++) {
      const output = this.activations[outputLayer][i];
      const error = target[i] - output;
      this.errors[outputLayer][i] = error * this.sigmoidDerivative(output);
    }

    // Calculate hidden layer errors
    for (let layer = outputLayer - 1; layer > 0; layer--) {
      for (let neuron = 0; neuron < this.activations[layer].length; neuron++) {
        let error = 0;
        
        for (let nextNeuron = 0; nextNeuron < this.activations[layer + 1].length; nextNeuron++) {
          error += this.errors[layer + 1][nextNeuron] * this.weights[layer][nextNeuron][neuron];
        }
        
        this.errors[layer][neuron] = error * this.reluDerivative(this.activations[layer][neuron]);
      }
    }

    // Update weights and biases
    for (let layer = 0; layer < this.weights.length; layer++) {
      for (let neuron = 0; neuron < this.weights[layer].length; neuron++) {
        // Update weights
        for (let input = 0; input < this.weights[layer][neuron].length; input++) {
          const weightDelta = this.config.learningRate * this.errors[layer + 1][neuron] * this.activations[layer][input];
          const momentumTerm = (this.config.momentum || 0.9) * this.previousWeightDeltas[layer][neuron][input];
          
          this.weights[layer][neuron][input] += weightDelta + momentumTerm;
          this.previousWeightDeltas[layer][neuron][input] = weightDelta;
        }
        
        // Update biases
        const biasDelta = this.config.learningRate * this.errors[layer + 1][neuron];
        const biasMomentum = (this.config.momentum || 0.9) * this.previousBiasDeltas[layer][neuron];
        
        this.biases[layer][neuron] += biasDelta + biasMomentum;
        this.previousBiasDeltas[layer][neuron] = biasDelta;
      }
    }
  }

  /**
   * Train the network with batched data
   */
  async train(trainingData: TrainingData): Promise<{
    finalLoss: number;
    accuracy: number;
    epochs: number;
    trainingTime: number;
  }> {
    console.log('🧠 Starting neural network training...');
    const startTime = Date.now();
    
    let finalLoss = 0;
    let accuracy = 0;

    for (let epoch = 0; epoch < this.config.epochs; epoch++) {
      let epochLoss = 0;
      let correct = 0;

      // Shuffle training data
      const shuffledIndices = this.shuffleArray([...Array(trainingData.inputs.length).keys()]);
      
      // Process in batches
      for (let i = 0; i < shuffledIndices.length; i += this.config.batchSize) {
        const batchIndices = shuffledIndices.slice(i, i + this.config.batchSize);
        let batchLoss = 0;

        for (const idx of batchIndices) {
          const inputs = trainingData.inputs[idx];
          const target = trainingData.targets[idx];

          // Forward pass
          const outputs = this.forwardPass(inputs);

          // Calculate loss (cross-entropy for binary classification)
          const loss = this.calculateCrossEntropyLoss(outputs, target);
          batchLoss += loss;
          epochLoss += loss;

          // Check accuracy
          const predicted = outputs[0] > 0.5 ? 1 : 0;
          const actual = target[0] > 0.5 ? 1 : 0;
          if (predicted === actual) correct++;

          // Backward pass
          this.backwardPass(target);
        }

        // Learning rate decay
        if (epoch > 100 && epoch % 50 === 0) {
          this.config.learningRate *= 0.95;
        }
      }

      finalLoss = epochLoss / trainingData.inputs.length;
      accuracy = correct / trainingData.inputs.length;

      // Log progress every 10 epochs
      if (epoch % 10 === 0) {
        console.log(`Epoch ${epoch}: Loss=${finalLoss.toFixed(4)}, Accuracy=${(accuracy * 100).toFixed(2)}%`);
      }

      // Early stopping if loss is very low
      if (finalLoss < 0.001) {
        console.log(`Early stopping at epoch ${epoch}`);
        break;
      }
    }

    const trainingTime = Date.now() - startTime;
    console.log(`✅ Training complete: ${accuracy.toFixed(3)} accuracy, ${finalLoss.toFixed(4)} loss`);

    return {
      finalLoss,
      accuracy,
      epochs: this.config.epochs,
      trainingTime
    };
  }

  /**
   * Make prediction on keystroke pattern
   */
  async predict(pattern: KeystrokePattern): Promise<PredictionResult> {
    const startTime = performance.now();
    
    const features = this.extractKeystrokeFeatures(pattern);
    const outputs = this.forwardPass(features);
    
    const processingTime = performance.now() - startTime;
    
    return {
      confidence: outputs[0],
      probability: outputs[0],
      features,
      processingTime
    };
  }

  // Activation functions
  private sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, x))));
  }

  private sigmoidDerivative(x: number): number {
    return x * (1 - x);
  }

  private relu(x: number): number {
    return Math.max(0, x);
  }

  private reluDerivative(x: number): number {
    return x > 0 ? 1 : 0;
  }

  // Loss functions
  private calculateCrossEntropyLoss(outputs: number[], targets: number[]): number {
    let loss = 0;
    for (let i = 0; i < outputs.length; i++) {
      const y = targets[i];
      const yHat = Math.max(1e-15, Math.min(1 - 1e-15, outputs[i])); // Clip to prevent log(0)
      loss -= y * Math.log(yHat) + (1 - y) * Math.log(1 - yHat);
    }
    return loss;
  }

  // Utility functions
  private shuffleArray(array: number[]): number[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private normalizeFeatures(features: number[]): number[] {
    const mean = this.calculateMean(features);
    const stdDev = this.calculateStdDev(features);
    
    if (stdDev === 0) return features.map(() => 0);
    
    return features.map(f => (f - mean) / stdDev);
  }

  // Statistical calculations
  private calculateMean(values: number[]): number {
    return values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0;
  }

  private calculateStdDev(values: number[]): number {
    if (values.length < 2) return 0;
    const mean = this.calculateMean(values);
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }

  private calculateMedian(values: number[]): number {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
  }

  private calculateSkewness(values: number[]): number {
    if (values.length < 3) return 0;
    const mean = this.calculateMean(values);
    const stdDev = this.calculateStdDev(values);
    if (stdDev === 0) return 0;
    
    const skew = values.reduce((sum, val) => {
      return sum + Math.pow((val - mean) / stdDev, 3);
    }, 0) / values.length;
    
    return skew;
  }

  private calculateKurtosis(values: number[]): number {
    if (values.length < 4) return 0;
    const mean = this.calculateMean(values);
    const stdDev = this.calculateStdDev(values);
    if (stdDev === 0) return 0;
    
    const kurt = values.reduce((sum, val) => {
      return sum + Math.pow((val - mean) / stdDev, 4);
    }, 0) / values.length;
    
    return kurt - 3; // Excess kurtosis
  }

  private calculateTypingRhythm(timings: Array<{pressTime: number}>): number {
    if (timings.length < 3) return 0;
    const intervals: number[] = [];
    for (let i = 1; i < timings.length; i++) {
      intervals.push(timings[i].pressTime - timings[i - 1].pressTime);
    }
    const mean = this.calculateMean(intervals);
    return mean > 0 ? this.calculateStdDev(intervals) / mean : 0;
  }

  private calculateTypingTempo(timings: Array<{pressTime: number}>): number {
    if (timings.length < 2) return 0;
    const totalTime = timings[timings.length - 1].pressTime - timings[0].pressTime;
    return totalTime > 0 ? (timings.length - 1) / totalTime * 60000 : 0; // Characters per minute
  }

  private calculateVelocityVariation(timings: Array<{pressTime: number}>): number {
    if (timings.length < 4) return 0;
    const velocities: number[] = [];
    for (let i = 2; i < timings.length; i++) {
      const dt1 = timings[i - 1].pressTime - timings[i - 2].pressTime;
      const dt2 = timings[i].pressTime - timings[i - 1].pressTime;
      if (dt1 > 0 && dt2 > 0) {
        velocities.push(Math.abs(1/dt2 - 1/dt1));
      }
    }
    return this.calculateMean(velocities);
  }

  private calculateAccelerationPattern(timings: Array<{pressTime: number}>): number {
    if (timings.length < 5) return 0;
    const accelerations: number[] = [];
    for (let i = 3; i < timings.length; i++) {
      const dt1 = timings[i - 2].pressTime - timings[i - 3].pressTime;
      const dt2 = timings[i - 1].pressTime - timings[i - 2].pressTime;
      const dt3 = timings[i].pressTime - timings[i - 1].pressTime;
      
      if (dt1 > 0 && dt2 > 0 && dt3 > 0) {
        const v1 = 1000 / dt2;
        const v2 = 1000 / dt3;
        accelerations.push(v2 - v1);
      }
    }
    return this.calculateMean(accelerations);
  }

  private calculateBigramTimings(timings: Array<{key: string; pressTime: number}>): number[] {
    const bigramTimes: number[] = [];
    for (let i = 1; i < timings.length; i++) {
      bigramTimes.push(timings[i].pressTime - timings[i - 1].pressTime);
    }
    return bigramTimes;
  }

  private calculateTrigramTimings(timings: Array<{key: string; pressTime: number}>): number[] {
    const trigramTimes: number[] = [];
    for (let i = 2; i < timings.length; i++) {
      trigramTimes.push(timings[i].pressTime - timings[i - 2].pressTime);
    }
    return trigramTimes;
  }

  private calculatePressurePattern(timings: Array<{duration: number | null}>): number {
    const durations = timings.filter(t => t.duration !== null).map(t => t.duration!);
    if (durations.length === 0) return 0;
    
    // Simulate pressure based on key duration
    const avgDuration = this.calculateMean(durations);
    return Math.min(1, avgDuration / 150); // Normalize to 0-1 range
  }

  private calculateForceVariation(timings: Array<{duration: number | null}>): number {
    const durations = timings.filter(t => t.duration !== null).map(t => t.duration!);
    if (durations.length < 2) return 0;
    
    // Simulate force variation based on duration consistency
    const stdDev = this.calculateStdDev(durations);
    const mean = this.calculateMean(durations);
    return mean > 0 ? stdDev / mean : 0;
  }

  /**
   * Save network state
   */
  exportModel(): {
    config: NeuralNetworkConfig;
    weights: number[][][];
    biases: number[][];
    metadata: {
      version: string;
      timestamp: number;
      trainingCompleted: boolean;
    };
  } {
    return {
      config: { ...this.config },
      weights: this.weights.map(layer => layer.map(neuron => [...neuron])),
      biases: this.biases.map(layer => [...layer]),
      metadata: {
        version: '1.0.0',
        timestamp: Date.now(),
        trainingCompleted: true
      }
    };
  }

  /**
   * Load network state
   */
  importModel(modelData: {
    config: NeuralNetworkConfig;
    weights: number[][][];
    biases: number[][];
  }): void {
    this.config = { ...modelData.config };
    this.weights = modelData.weights.map(layer => layer.map(neuron => [...neuron]));
    this.biases = modelData.biases.map(layer => [...layer]);
    
    // Reinitialize delta arrays
    this.previousWeightDeltas = this.weights.map(layer => 
      layer.map(neuron => new Array(neuron.length).fill(0))
    );
    this.previousBiasDeltas = this.biases.map(layer => new Array(layer.length).fill(0));
    
    console.log('📥 Neural network model imported successfully');
  }
}