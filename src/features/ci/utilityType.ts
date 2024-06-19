export type CIEventBridgeDetail = {
  repositoryNames: string[];
  sourceReference: string;
  sourceCommit: string;
  pullRequestId: string;
};
export type CIEventBridgeResult = { statusCode: number } | void;
