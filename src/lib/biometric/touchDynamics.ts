export interface TouchPoint {
  identifier: number;
  pageX: number;
  pageY: number;
  radiusX?: number;
  radiusY?: number;
  rotationAngle?: number;
  force?: number;
  timestamp: number;
}

export interface TouchPattern {
  type: 'tap' | 'swipe' | 'pinch' | 'rotation' | 'scroll';
  startTime: number;
  endTime: number;
  duration: number;
  touchPoints: TouchPoint[];
  velocity?: number;
  acceleration?: number;
  pressure?: number;
  area?: number;
  distance?: number;
  angle?: number;
  context: string;
}

export interface TapPattern extends TouchPattern {
  type: 'tap';
  dwellTime: number;
  maxPressure: number;
  averagePressure: number;
  contactArea: number;
  tapCount: number;
}

export interface SwipePattern extends TouchPattern {
  type: 'swipe';
  direction: 'up' | 'down' | 'left' | 'right';
  velocity: number;
  acceleration: number;
  curvature: number;
  startPosition: { x: number; y: number };
  endPosition: { x: number; y: number };
}

export interface PinchPattern extends TouchPattern {
  type: 'pinch';
  scaleChange: number;
  rotationChange: number;
  centerPoint: { x: number; y: number };
  simultaneity: number;
  velocity: number;
}

export class TouchDynamicsCapture {
  private isCapturing = false;
  private currentTouches = new Map<number, TouchPoint[]>();
  private patterns: TouchPattern[] = [];
  private element: HTMLElement | null = null;
  private listeners: Array<() => void> = [];

  constructor(element?: HTMLElement) {
    this.element = element || document.body;
  }

  startCapture(): void {
    if (this.isCapturing) return;
    
    this.isCapturing = true;
    this.patterns = [];
    this.currentTouches.clear();

    // Add touch event listeners
    const touchStartListener = (e: TouchEvent) => this.handleTouchStart(e);
    const touchMoveListener = (e: TouchEvent) => this.handleTouchMove(e);
    const touchEndListener = (e: TouchEvent) => this.handleTouchEnd(e);
    const touchCancelListener = (e: TouchEvent) => this.handleTouchCancel(e);

    this.element!.addEventListener('touchstart', touchStartListener, { passive: false });
    this.element!.addEventListener('touchmove', touchMoveListener, { passive: false });
    this.element!.addEventListener('touchend', touchEndListener, { passive: false });
    this.element!.addEventListener('touchcancel', touchCancelListener, { passive: false });

    // Store listeners for cleanup
    this.listeners = [
      () => this.element!.removeEventListener('touchstart', touchStartListener),
      () => this.element!.removeEventListener('touchmove', touchMoveListener),
      () => this.element!.removeEventListener('touchend', touchEndListener),
      () => this.element!.removeEventListener('touchcancel', touchCancelListener),
    ];
  }

  stopCapture(): TouchPattern[] {
    if (!this.isCapturing) return [];

    this.isCapturing = false;
    
    // Remove all listeners
    this.listeners.forEach(removeListener => removeListener());
    this.listeners = [];

    const capturedPatterns = [...this.patterns];
    this.patterns = [];
    this.currentTouches.clear();

    return capturedPatterns;
  }

  private handleTouchStart(e: TouchEvent): void {
    e.preventDefault();
    
    const now = performance.now();
    
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      const touchPoint: TouchPoint = {
        identifier: touch.identifier,
        pageX: touch.pageX,
        pageY: touch.pageY,
        radiusX: touch.radiusX,
        radiusY: touch.radiusY,
        rotationAngle: touch.rotationAngle,
        force: touch.force,
        timestamp: now,
      };

      if (!this.currentTouches.has(touch.identifier)) {
        this.currentTouches.set(touch.identifier, []);
      }
      this.currentTouches.get(touch.identifier)!.push(touchPoint);
    }
  }

  private handleTouchMove(e: TouchEvent): void {
    e.preventDefault();
    
    const now = performance.now();
    
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      const touchPoint: TouchPoint = {
        identifier: touch.identifier,
        pageX: touch.pageX,
        pageY: touch.pageY,
        radiusX: touch.radiusX,
        radiusY: touch.radiusY,
        rotationAngle: touch.rotationAngle,
        force: touch.force,
        timestamp: now,
      };

      if (this.currentTouches.has(touch.identifier)) {
        this.currentTouches.get(touch.identifier)!.push(touchPoint);
      }
    }
  }

  private handleTouchEnd(e: TouchEvent): void {
    e.preventDefault();
    
    const now = performance.now();
    
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      const touchHistory = this.currentTouches.get(touch.identifier);
      
      if (touchHistory && touchHistory.length > 0) {
        // Add final touch point
        const finalPoint: TouchPoint = {
          identifier: touch.identifier,
          pageX: touch.pageX,
          pageY: touch.pageY,
          radiusX: touch.radiusX,
          radiusY: touch.radiusY,
          rotationAngle: touch.rotationAngle,
          force: touch.force,
          timestamp: now,
        };
        touchHistory.push(finalPoint);

        // Analyze the touch pattern
        const pattern = this.analyzeTouchPattern(touchHistory);
        if (pattern) {
          this.patterns.push(pattern);
        }

        // Clean up
        this.currentTouches.delete(touch.identifier);
      }
    }

    // Check for multi-touch gestures
    if (e.touches.length === 0 && this.currentTouches.size === 0) {
      this.analyzeMultiTouchGestures();
    }
  }

  private handleTouchCancel(e: TouchEvent): void {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      this.currentTouches.delete(touch.identifier);
    }
  }

  private analyzeTouchPattern(touchHistory: TouchPoint[]): TouchPattern | null {
    if (touchHistory.length < 2) return null;

    const startPoint = touchHistory[0];
    const endPoint = touchHistory[touchHistory.length - 1];
    const duration = endPoint.timestamp - startPoint.timestamp;

    // Calculate movement distance
    const deltaX = endPoint.pageX - startPoint.pageX;
    const deltaY = endPoint.pageY - startPoint.pageY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Determine pattern type
    if (distance < 10 && duration < 300) {
      // Tap pattern
      return this.createTapPattern(touchHistory);
    } else if (distance > 20) {
      // Swipe pattern
      return this.createSwipePattern(touchHistory);
    }

    return null;
  }

  private createTapPattern(touchHistory: TouchPoint[]): TapPattern {
    const startPoint = touchHistory[0];
    const endPoint = touchHistory[touchHistory.length - 1];
    const duration = endPoint.timestamp - startPoint.timestamp;

    // Calculate pressure metrics
    const pressures = touchHistory
      .map(p => p.force || 0)
      .filter(f => f > 0);
    
    const maxPressure = pressures.length > 0 ? Math.max(...pressures) : 0;
    const averagePressure = pressures.length > 0 ? 
      pressures.reduce((a, b) => a + b, 0) / pressures.length : 0;

    // Calculate contact area
    const areas = touchHistory
      .map(p => (p.radiusX || 0) * (p.radiusY || 0) * Math.PI)
      .filter(a => a > 0);
    
    const contactArea = areas.length > 0 ? 
      areas.reduce((a, b) => a + b, 0) / areas.length : 0;

    return {
      type: 'tap',
      startTime: startPoint.timestamp,
      endTime: endPoint.timestamp,
      duration,
      touchPoints: touchHistory,
      dwellTime: duration,
      maxPressure,
      averagePressure,
      contactArea,
      tapCount: 1,
      context: 'touch_interaction'
    };
  }

  private createSwipePattern(touchHistory: TouchPoint[]): SwipePattern {
    const startPoint = touchHistory[0];
    const endPoint = touchHistory[touchHistory.length - 1];
    const duration = endPoint.timestamp - startPoint.timestamp;

    const deltaX = endPoint.pageX - startPoint.pageX;
    const deltaY = endPoint.pageY - startPoint.pageY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Determine direction
    const angle = Math.atan2(deltaY, deltaX);
    let direction: 'up' | 'down' | 'left' | 'right';
    if (Math.abs(angle) < Math.PI / 4) {
      direction = 'right';
    } else if (Math.abs(angle) > 3 * Math.PI / 4) {
      direction = 'left';
    } else if (angle > 0) {
      direction = 'down';
    } else {
      direction = 'up';
    }

    // Calculate velocity and acceleration
    const velocity = distance / duration;
    
    // Calculate curvature (straightness of the swipe)
    const straightLineDistance = distance;
    const actualPathDistance = this.calculatePathDistance(touchHistory);
    const curvature = actualPathDistance / straightLineDistance;

    // Simple acceleration calculation
    const midPoint = touchHistory[Math.floor(touchHistory.length / 2)];
    const firstHalfDistance = Math.sqrt(
      Math.pow(midPoint.pageX - startPoint.pageX, 2) + 
      Math.pow(midPoint.pageY - startPoint.pageY, 2)
    );
    const secondHalfDistance = Math.sqrt(
      Math.pow(endPoint.pageX - midPoint.pageX, 2) + 
      Math.pow(endPoint.pageY - midPoint.pageY, 2)
    );
    const firstHalfTime = midPoint.timestamp - startPoint.timestamp;
    const secondHalfTime = endPoint.timestamp - midPoint.timestamp;
    
    const firstHalfVelocity = firstHalfDistance / firstHalfTime;
    const secondHalfVelocity = secondHalfDistance / secondHalfTime;
    const acceleration = (secondHalfVelocity - firstHalfVelocity) / (duration / 2);

    return {
      type: 'swipe',
      startTime: startPoint.timestamp,
      endTime: endPoint.timestamp,
      duration,
      touchPoints: touchHistory,
      direction,
      velocity,
      acceleration,
      curvature,
      distance,
      angle: angle * 180 / Math.PI, // Convert to degrees
      startPosition: { x: startPoint.pageX, y: startPoint.pageY },
      endPosition: { x: endPoint.pageX, y: endPoint.pageY },
      context: 'touch_interaction'
    };
  }

  private calculatePathDistance(points: TouchPoint[]): number {
    let totalDistance = 0;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const distance = Math.sqrt(
        Math.pow(curr.pageX - prev.pageX, 2) + 
        Math.pow(curr.pageY - prev.pageY, 2)
      );
      totalDistance += distance;
    }
    return totalDistance;
  }

  private analyzeMultiTouchGestures(): void {
    // This would analyze patterns across multiple simultaneous touches
    // For now, we'll implement basic pinch detection in future iterations
  }

  getPatterns(): TouchPattern[] {
    return [...this.patterns];
  }

  clearPatterns(): void {
    this.patterns = [];
  }

  isCurrentlyCapturing(): boolean {
    return this.isCapturing;
  }
}