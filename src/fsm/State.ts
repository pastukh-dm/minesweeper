import { StateCallbacks } from "./StateCallbacks";

export class State {
    public name: string;
    private onEnterCallback?: () => void;
    private onExitCallback?: () => void;
    private onUpdateCallback?: (delta: number) => void;
  
    constructor(name: string, callbacks: StateCallbacks) {
      this.name = name;
      this.onEnterCallback = callbacks.onEnter;
      this.onExitCallback = callbacks.onExit;
      this.onUpdateCallback = callbacks.onUpdate;
    }
  
    // Called when entering the state
    onEnter() {
      console.log(`Entering state: ${this.name}`);
      this.onEnterCallback?.();
    }
  
    // Called when exiting the state
    onExit() {
      console.log(`Exiting state: ${this.name}`);
      this.onExitCallback?.();
    }
  
    // Called during each update
    onUpdate(delta: number) {
      this.onUpdateCallback?.(delta);
    }
  }
  