export type CIEventBridgeDetail = {
  repositoryNames: string[];
  sourceReference: string;
  pullRequestId: string;
};
export type CIEventBridgeResult = { statusCode: number } | void;
