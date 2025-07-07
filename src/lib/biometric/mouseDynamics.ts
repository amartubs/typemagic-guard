export interface MousePoint {
  x: number;
  y: number;
  timestamp: number;
  pressure?: number;
  buttons: number;
}

export interface MousePattern {
  type: 'movement' | 'click' | 'scroll' | 'drag';
  startTime: number;
  endTime: number;
  duration: number;
  points: MousePoint[];
  velocity?: number;
  acceleration?: number;
  distance?: number;
  context: string;
}

export interface MouseMovementPattern extends MousePattern {
  type: 'movement';
  averageVelocity: number;
  maxVelocity: number;
  acceleration: number;
  jerk: number; // Rate of change of acceleration
  curvature: number;
  straightness: number;
  pauses: number;
  directionChanges: number;
}

export interface MouseClickPattern extends MousePattern {
  type: 'click';
  button: number;
  dwellTime: number;
  preClickMovement: MousePoint[];
  postClickMovement: MousePoint[];
  clickCount: number;
  pressure?: number;
}

export interface MouseScrollPattern extends MousePattern {
  type: 'scroll';
  direction: 'up' | 'down' | 'left' | 'right';
  scrollDelta: number;
  scrollSpeed: number;
  smoothness: number;
}

export interface MouseDragPattern extends MousePattern {
  type: 'drag';
  startPosition: { x: number; y: number };
  endPosition: { x: number; y: number };
  dragDistance: number;
  dragVelocity: number;
  smoothness: number;
}

export class MouseDynamicsCapture {
  private isCapturing = false;
  private mousePoints: MousePoint[] = [];
  private patterns: MousePattern[] = [];
  private element: HTMLElement | null = null;
  private listeners: Array<() => void> = [];
  private isDragging = false;
  private dragStartPoint: MousePoint | null = null;
  private lastClickTime = 0;
  private clickCount = 0;

  constructor(element?: HTMLElement) {
    this.element = element || document.body;
  }

  startCapture(): void {
    if (this.isCapturing) return;
    
    this.isCapturing = true;
    this.patterns = [];
    this.mousePoints = [];
    this.isDragging = false;
    this.dragStartPoint = null;

    // Add mouse event listeners
    const mouseMoveListener = (e: MouseEvent) => this.handleMouseMove(e);
    const mouseDownListener = (e: MouseEvent) => this.handleMouseDown(e);
    const mouseUpListener = (e: MouseEvent) => this.handleMouseUp(e);
    const clickListener = (e: MouseEvent) => this.handleClick(e);
    const wheelListener = (e: WheelEvent) => this.handleWheel(e);

    this.element!.addEventListener('mousemove', mouseMoveListener);
    this.element!.addEventListener('mousedown', mouseDownListener);
    this.element!.addEventListener('mouseup', mouseUpListener);
    this.element!.addEventListener('click', clickListener);
    this.element!.addEventListener('wheel', wheelListener);

    // Store listeners for cleanup
    this.listeners = [
      () => this.element!.removeEventListener('mousemove', mouseMoveListener),
      () => this.element!.removeEventListener('mousedown', mouseDownListener),
      () => this.element!.removeEventListener('mouseup', mouseUpListener),
      () => this.element!.removeEventListener('click', clickListener),
      () => this.element!.removeEventListener('wheel', wheelListener),
    ];
  }

  stopCapture(): MousePattern[] {
    if (!this.isCapturing) return [];

    this.isCapturing = false;
    
    // Remove all listeners
    this.listeners.forEach(removeListener => removeListener());
    this.listeners = [];

    // Process any remaining movement data
    if (this.mousePoints.length > 1) {
      const movementPattern = this.createMovementPattern(this.mousePoints);
      if (movementPattern) {
        this.patterns.push(movementPattern);
      }
    }

    const capturedPatterns = [...this.patterns];
    this.patterns = [];
    this.mousePoints = [];

    return capturedPatterns;
  }

  private handleMouseMove(e: MouseEvent): void {
    const now = performance.now();
    const point: MousePoint = {
      x: e.clientX,
      y: e.clientY,
      timestamp: now,
      buttons: e.buttons,
      pressure: (e as any).pressure || 0.5, // Default pressure for devices that don't support it
    };

    this.mousePoints.push(point);

    // Process movement patterns periodically to avoid memory issues
    if (this.mousePoints.length > 1000) {
      const movementPattern = this.createMovementPattern(this.mousePoints.slice(0, 500));
      if (movementPattern) {
        this.patterns.push(movementPattern);
      }
      this.mousePoints = this.mousePoints.slice(500);
    }
  }

  private handleMouseDown(e: MouseEvent): void {
    const now = performance.now();
    this.isDragging = true;
    this.dragStartPoint = {
      x: e.clientX,
      y: e.clientY,
      timestamp: now,
      buttons: e.buttons,
      pressure: (e as any).pressure || 0.5,
    };
  }

  private handleMouseUp(e: MouseEvent): void {
    if (this.isDragging && this.dragStartPoint) {
      const now = performance.now();
      const endPoint: MousePoint = {
        x: e.clientX,
        y: e.clientY,
        timestamp: now,
        buttons: e.buttons,
        pressure: (e as any).pressure || 0.5,
      };

      // Create drag pattern if there was significant movement
      const distance = Math.sqrt(
        Math.pow(endPoint.x - this.dragStartPoint.x, 2) + 
        Math.pow(endPoint.y - this.dragStartPoint.y, 2)
      );

      if (distance > 5) { // Minimum drag distance
        const dragPattern = this.createDragPattern(this.dragStartPoint, endPoint);
        if (dragPattern) {
          this.patterns.push(dragPattern);
        }
      }
    }

    this.isDragging = false;
    this.dragStartPoint = null;
  }

  private handleClick(e: MouseEvent): void {
    const now = performance.now();
    
    // Detect multiple clicks
    if (now - this.lastClickTime < 500) { // 500ms window for multiple clicks
      this.clickCount++;
    } else {
      this.clickCount = 1;
    }
    this.lastClickTime = now;

    // Get movement data before and after click
    const clickIndex = this.mousePoints.length;
    const preClickMovement = this.mousePoints.slice(Math.max(0, clickIndex - 10));
    
    // Wait a bit to capture post-click movement
    setTimeout(() => {
      const postClickIndex = this.mousePoints.length;
      const postClickMovement = this.mousePoints.slice(clickIndex, Math.min(postClickIndex, clickIndex + 10));
      
      const clickPattern = this.createClickPattern(e, preClickMovement, postClickMovement);
      if (clickPattern) {
        this.patterns.push(clickPattern);
      }
    }, 100);
  }

  private handleWheel(e: WheelEvent): void {
    const now = performance.now();
    const scrollPattern = this.createScrollPattern(e, now);
    if (scrollPattern) {
      this.patterns.push(scrollPattern);
    }
  }

  private createMovementPattern(points: MousePoint[]): MouseMovementPattern | null {
    if (points.length < 5) return null;

    const startPoint = points[0];
    const endPoint = points[points.length - 1];
    const duration = endPoint.timestamp - startPoint.timestamp;

    if (duration < 50) return null; // Too short to be meaningful

    // Calculate velocities
    const velocities: number[] = [];
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const distance = Math.sqrt(
        Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2)
      );
      const timeDelta = curr.timestamp - prev.timestamp;
      if (timeDelta > 0) {
        velocities.push(distance / timeDelta);
      }
    }

    const averageVelocity = velocities.reduce((a, b) => a + b, 0) / velocities.length;
    const maxVelocity = Math.max(...velocities);

    // Calculate acceleration
    const accelerations: number[] = [];
    for (let i = 1; i < velocities.length; i++) {
      const timeDelta = points[i + 1].timestamp - points[i].timestamp;
      if (timeDelta > 0) {
        accelerations.push((velocities[i] - velocities[i - 1]) / timeDelta);
      }
    }
    const averageAcceleration = accelerations.length > 0 ? 
      accelerations.reduce((a, b) => a + b, 0) / accelerations.length : 0;

    // Calculate jerk (rate of change of acceleration)
    const jerks: number[] = [];
    for (let i = 1; i < accelerations.length; i++) {
      const timeDelta = points[i + 1].timestamp - points[i].timestamp;
      if (timeDelta > 0) {
        jerks.push((accelerations[i] - accelerations[i - 1]) / timeDelta);
      }
    }
    const averageJerk = jerks.length > 0 ? 
      jerks.reduce((a, b) => a + b, 0) / jerks.length : 0;

    // Calculate total distance and straight-line distance
    let totalDistance = 0;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      totalDistance += Math.sqrt(
        Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2)
      );
    }

    const straightLineDistance = Math.sqrt(
      Math.pow(endPoint.x - startPoint.x, 2) + 
      Math.pow(endPoint.y - startPoint.y, 2)
    );

    const curvature = totalDistance / Math.max(straightLineDistance, 1);
    const straightness = straightLineDistance / Math.max(totalDistance, 1);

    // Count pauses (low velocity periods)
    const pauses = velocities.filter(v => v < averageVelocity * 0.1).length;

    // Count direction changes
    let directionChanges = 0;
    for (let i = 2; i < points.length; i++) {
      const prev2 = points[i - 2];
      const prev1 = points[i - 1];
      const curr = points[i];
      
      const angle1 = Math.atan2(prev1.y - prev2.y, prev1.x - prev2.x);
      const angle2 = Math.atan2(curr.y - prev1.y, curr.x - prev1.x);
      const angleDiff = Math.abs(angle2 - angle1);
      
      if (angleDiff > Math.PI / 4) { // 45 degree threshold
        directionChanges++;
      }
    }

    return {
      type: 'movement',
      startTime: startPoint.timestamp,
      endTime: endPoint.timestamp,
      duration,
      points,
      averageVelocity,
      maxVelocity,
      acceleration: averageAcceleration,
      jerk: averageJerk,
      curvature,
      straightness,
      pauses,
      directionChanges,
      distance: totalDistance,
      context: 'mouse_movement'
    };
  }

  private createClickPattern(
    event: MouseEvent, 
    preClick: MousePoint[], 
    postClick: MousePoint[]
  ): MouseClickPattern {
    const now = performance.now();
    
    return {
      type: 'click',
      startTime: now - 50, // Approximate start
      endTime: now,
      duration: 50, // Typical click duration
      points: [{
        x: event.clientX,
        y: event.clientY,
        timestamp: now,
        buttons: event.buttons,
        pressure: (event as any).pressure || 0.5,
      }],
      button: event.button,
      dwellTime: 50,
      preClickMovement: preClick,
      postClickMovement: postClick,
      clickCount: this.clickCount,
      pressure: (event as any).pressure || 0.5,
      context: 'mouse_click'
    };
  }

  private createScrollPattern(event: WheelEvent, timestamp: number): MouseScrollPattern {
    const direction = event.deltaY > 0 ? 'down' : event.deltaY < 0 ? 'up' : 
                     event.deltaX > 0 ? 'right' : 'left';
    
    const scrollDelta = Math.abs(event.deltaY || event.deltaX);
    const scrollSpeed = scrollDelta; // Simplified speed calculation
    
    return {
      type: 'scroll',
      startTime: timestamp,
      endTime: timestamp + 50,
      duration: 50,
      points: [{
        x: event.clientX,
        y: event.clientY,
        timestamp,
        buttons: 0,
      }],
      direction,
      scrollDelta,
      scrollSpeed,
      smoothness: 1.0, // Would need more sophisticated calculation
      context: 'mouse_scroll'
    };
  }

  private createDragPattern(startPoint: MousePoint, endPoint: MousePoint): MouseDragPattern {
    const duration = endPoint.timestamp - startPoint.timestamp;
    const distance = Math.sqrt(
      Math.pow(endPoint.x - startPoint.x, 2) + 
      Math.pow(endPoint.y - startPoint.y, 2)
    );
    const velocity = distance / duration;

    return {
      type: 'drag',
      startTime: startPoint.timestamp,
      endTime: endPoint.timestamp,
      duration,
      points: [startPoint, endPoint],
      startPosition: { x: startPoint.x, y: startPoint.y },
      endPosition: { x: endPoint.x, y: endPoint.y },
      dragDistance: distance,
      dragVelocity: velocity,
      smoothness: 1.0, // Simplified calculation
      distance,
      context: 'mouse_drag'
    };
  }

  getPatterns(): MousePattern[] {
    return [...this.patterns];
  }

  clearPatterns(): void {
    this.patterns = [];
    this.mousePoints = [];
  }

  isCurrentlyCapturing(): boolean {
    return this.isCapturing;
  }
}