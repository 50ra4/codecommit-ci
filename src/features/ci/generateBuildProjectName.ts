export const generateBuildProjectName = ({
  repositoryName,
  pullRequestId,
}: {
  repositoryName: string;
  pullRequestId: string;
}) => `${repositoryName}-${pullRequestId}`;
