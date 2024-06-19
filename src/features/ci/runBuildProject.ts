import {
  StartBuildCommand,
  type CodeBuildClient,
} from '@aws-sdk/client-codebuild';

/**
 *
 * @see https://zenn.dev/nekoze_climber/articles/930c40132e1d45
 */
export const runBuildProject = async ({
  codeBuild,
  projectName,
}: {
  codeBuild: CodeBuildClient;
  projectName: string;
}) => {
  await codeBuild.send(new StartBuildCommand({ projectName }));
};
