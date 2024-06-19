import type { CodeBuildClient } from '@aws-sdk/client-codebuild';
import {
  CreateProjectCommand,
  StartBuildCommand,
} from '@aws-sdk/client-codebuild';

/**
 *
 * @see https://zenn.dev/nekoze_climber/articles/930c40132e1d45
 */
export const createBuildProject = async ({
  codeBuild,
  projectName,
  sourceReference,
  repositoryName,
  pullRequestId,
  serviceRole,
  region,
  buildImage,
  buildSpecPath,
}: {
  codeBuild: CodeBuildClient;
  projectName: string;
  sourceReference: string;
  repositoryName: string;
  pullRequestId: string;
  serviceRole: string;
  region?: string;
  buildImage?: string;
  buildSpecPath?: string;
}) => {
  // プロジェクトの作成
  await codeBuild.send(
    // @see https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/codebuild/command/CreateProjectCommand/
    new CreateProjectCommand({
      artifacts: {
        type: 'NO_ARTIFACTS',
      },
      badgeEnabled: true,
      description: `This is triggered by creating or updating a No.${pullRequestId} PR in ${repositoryName}.`,
      environment: {
        computeType: 'BUILD_GENERAL1_SMALL',
        image: buildImage,
        type: 'LINUX_CONTAINER',
        environmentVariables: [
          {
            name: 'PULL_REQUEST_ID',
            value: pullRequestId,
            type: 'PLAINTEXT',
          },
          // FIXME: 追加必要かを確認する
        ],
      },
      name: projectName,
      source: {
        type: 'CODECOMMIT',
        location: `https://git-codecommit.${region}.amazonaws.com/v1/repos/${repositoryName}`,
        // FIXME: 多分、指定不要な気がする。。。
        buildspec: buildSpecPath,
      },
      sourceVersion: sourceReference,
      timeoutInMinutes: 30,
      // TODO: 要確認
      logsConfig: {
        cloudWatchLogs: {
          status: 'ENABLED',
        },
      },
      serviceRole,
      // TODO: 要確認
      buildBatchConfig: {
        serviceRole,
      },
    }),
  );

  // 作成完了後にビルドを実行する
  await codeBuild.send(new StartBuildCommand({ projectName: projectName }));
};
