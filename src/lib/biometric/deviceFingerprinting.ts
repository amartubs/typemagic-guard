import { supabase } from '@/integrations/supabase/client';

export interface DeviceCapabilities {
  deviceType: 'desktop' | 'mobile' | 'tablet';
  hasKeyboard: boolean;
  hasMouse: boolean;
  hasTouch: boolean;
  hasTrackpad: boolean;
  screenResolution: string;
  userAgent: string;
  platform: string;
  capabilities: {
    maxTouchPoints: number;
    devicePixelRatio: number;
    colorDepth: number;
    hardwareConcurrency: number;
    languages: string[];
    timezone: string;
    connection?: {
      effectiveType?: string;
      downlink?: number;
      rtt?: number;
    };
  };
}

export interface DeviceFingerprint {
  id: string;
  entropy: number;
  components: Record<string, any>;
}

export class DeviceFingerprintingService {
  private static instance: DeviceFingerprintingService;
  private fingerprint: DeviceFingerprint | null = null;
  private capabilities: DeviceCapabilities | null = null;

  static getInstance(): DeviceFingerprintingService {
    if (!this.instance) {
      this.instance = new DeviceFingerprintingService();
    }
    return this.instance;
  }

  async generateDeviceFingerprint(): Promise<DeviceFingerprint> {
    if (this.fingerprint) {
      return this.fingerprint;
    }

    const components = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      languages: navigator.languages,
      platform: navigator.platform,
      hardwareConcurrency: navigator.hardwareConcurrency,
      deviceMemory: (navigator as any).deviceMemory,
      screenResolution: `${screen.width}x${screen.height}`,
      screenColorDepth: screen.colorDepth,
      pixelRatio: window.devicePixelRatio,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      hasTouch: 'ontouchstart' in window,
      maxTouchPoints: navigator.maxTouchPoints,
      connection: this.getConnectionInfo(),
      webgl: this.getWebGLInfo(),
      canvas: this.getCanvasFingerprint(),
      audio: await this.getAudioFingerprint(),
      fonts: this.getAvailableFonts(),
      plugins: this.getPluginInfo(),
      localStorage: this.hasLocalStorage(),
      sessionStorage: this.hasSessionStorage(),
      indexedDB: this.hasIndexedDB(),
      webRTC: await this.getWebRTCFingerprint(),
    };

    // Generate unique fingerprint ID
    const fingerprintString = JSON.stringify(components);
    const fingerprintId = await this.hashString(fingerprintString);
    
    // Calculate entropy (measure of uniqueness)
    const entropy = this.calculateEntropy(components);

    this.fingerprint = {
      id: fingerprintId,
      entropy,
      components
    };

    return this.fingerprint;
  }

  async detectDeviceCapabilities(): Promise<DeviceCapabilities> {
    if (this.capabilities) {
      return this.capabilities;
    }

    const userAgent = navigator.userAgent.toLowerCase();
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const screenWidth = screen.width;

    // Detect device type
    let deviceType: 'desktop' | 'mobile' | 'tablet' = 'desktop';
    if (/mobile|android|iphone|ipod|blackberry|windows phone/i.test(userAgent)) {
      deviceType = 'mobile';
    } else if (/tablet|ipad/i.test(userAgent) || (hasTouch && screenWidth >= 768)) {
      deviceType = 'tablet';
    }

    // Detect input capabilities
    const hasKeyboard = deviceType === 'desktop' || 
                       (hasTouch && screenWidth >= 768); // Tablets often have keyboards
    const hasMouse = deviceType === 'desktop' && !hasTouch;
    const hasTrackpad = /macintosh|mac os x/i.test(userAgent) && !hasTouch;

    const capabilities: DeviceCapabilities = {
      deviceType,
      hasKeyboard,
      hasMouse,
      hasTouch,
      hasTrackpad,
      screenResolution: `${screen.width}x${screen.height}`,
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      capabilities: {
        maxTouchPoints: navigator.maxTouchPoints,
        devicePixelRatio: window.devicePixelRatio,
        colorDepth: screen.colorDepth,
        hardwareConcurrency: navigator.hardwareConcurrency,
        languages: navigator.languages as string[],
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        connection: this.getConnectionInfo(),
      }
    };

    this.capabilities = capabilities;
    return capabilities;
  }

  async storeDeviceCapabilities(userId: string): Promise<void> {
    const capabilities = await this.detectDeviceCapabilities();
    const fingerprint = await this.generateDeviceFingerprint();

    const { error } = await supabase
      .from('device_capabilities')
      .upsert({
        user_id: userId,
        device_fingerprint: fingerprint.id,
        device_type: capabilities.deviceType,
        has_keyboard: capabilities.hasKeyboard,
        has_mouse: capabilities.hasMouse,
        has_touch: capabilities.hasTouch,
        has_trackpad: capabilities.hasTrackpad,
        screen_resolution: capabilities.screenResolution,
        user_agent: capabilities.userAgent,
        platform: capabilities.platform,
        capabilities: capabilities.capabilities,
      }, {
        onConflict: 'user_id,device_fingerprint'
      });

    if (error) {
      console.error('Failed to store device capabilities:', error);
    }
  }

  private getConnectionInfo() {
    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection;
    
    if (connection) {
      return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
      };
    }
    return null;
  }

  private getWebGLInfo() {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') as WebGLRenderingContext || 
                 canvas.getContext('experimental-webgl') as WebGLRenderingContext;
      if (!gl) return null;

      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      return {
        vendor: debugInfo ? gl.getParameter((debugInfo as any).UNMASKED_VENDOR_WEBGL) : null,
        renderer: debugInfo ? gl.getParameter((debugInfo as any).UNMASKED_RENDERER_WEBGL) : null,
        version: gl.getParameter(gl.VERSION),
      };
    } catch {
      return null;
    }
  }

  private getCanvasFingerprint(): string {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return '';

      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Biometric fingerprint test 🔒', 2, 2);
      
      return canvas.toDataURL();
    } catch {
      return '';
    }
  }

  private async getAudioFingerprint(): Promise<string> {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const analyser = audioContext.createAnalyser();
      const gain = audioContext.createGain();
      
      oscillator.connect(analyser);
      analyser.connect(gain);
      gain.connect(audioContext.destination);
      
      oscillator.frequency.value = 10000;
      gain.gain.value = 0;
      
      const data = new Float32Array(analyser.frequencyBinCount);
      analyser.getFloatFrequencyData(data);
      
      audioContext.close();
      return Array.from(data).slice(0, 50).join(',');
    } catch {
      return '';
    }
  }

  private getAvailableFonts(): string[] {
    const testFonts = [
      'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Verdana',
      'Courier New', 'Trebuchet MS', 'Arial Black', 'Impact', 'Comic Sans MS',
      'Palatino', 'Garamond', 'Tahoma', 'Century Gothic', 'Lucida Console'
    ];

    const availableFonts: string[] = [];
    const testString = 'mmmmmmmmmmlli';
    const testSize = '72px';
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return [];

    context.font = `${testSize} monospace`;
    const baselineWidth = context.measureText(testString).width;

    for (const font of testFonts) {
      context.font = `${testSize} ${font}, monospace`;
      const width = context.measureText(testString).width;
      if (width !== baselineWidth) {
        availableFonts.push(font);
      }
    }

    return availableFonts;
  }

  private getPluginInfo() {
    return Array.from(navigator.plugins).map(plugin => ({
      name: plugin.name,
      filename: plugin.filename,
      description: plugin.description,
    }));
  }

  private hasLocalStorage(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  private hasSessionStorage(): boolean {
    try {
      const test = '__storage_test__';
      sessionStorage.setItem(test, test);
      sessionStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  private hasIndexedDB(): boolean {
    return !!window.indexedDB;
  }

  private async getWebRTCFingerprint(): Promise<string> {
    try {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const fingerprint = offer.sdp?.match(/a=fingerprint:(\S+)/)?.[1] || '';
      pc.close();
      
      return fingerprint;
    } catch {
      return '';
    }
  }

  private async hashString(str: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private calculateEntropy(components: Record<string, any>): number {
    // Simplified entropy calculation
    const uniqueValues = new Set(Object.values(components).map(v => JSON.stringify(v)));
    return Math.log2(uniqueValues.size);
  }

  getStoredFingerprint(): DeviceFingerprint | null {
    return this.fingerprint;
  }

  getStoredCapabilities(): DeviceCapabilities | null {
    return this.capabilities;
  }
}

export const deviceFingerprinting = DeviceFingerprintingService.getInstance();