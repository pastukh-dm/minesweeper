export type StateCallbacks = {
  onEnter?: () => void;
  onExit?: () => void;
  onUpdate?: (delta: number) => void;
};
