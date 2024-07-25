export default interface IStatus {
  status?: string;
  report?: string;
  repository?: string;
  phase?: string;
  progressInPercent?: number;
  startUpdateTime?: string;
  lastUpdateTime?: string;
}
