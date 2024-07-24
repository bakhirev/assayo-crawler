export default interface IStatus {
  status?: string;
  task?: string;
  repository?: string;
  phase?: string;
  progressInPercent?: number;
  startUpdateTime?: string;
  lastUpdateTime?: string;
}
