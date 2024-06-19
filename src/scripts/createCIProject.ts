import {
  CodeBuildClient,
  CreateProjectCommand,
} from '@aws-sdk/client-codebuild';

const main = async () => {
  const region = '';
  const projectName = '';
  const buildImage = '';
  const serviceRole = '';

  const codeBuild = new CodeBuildClient({ region });
  // プロジェクトの作成
  await codeBuild.send(
    // @see https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/codebuild/command/CreateProjectCommand/
    new CreateProjectCommand({
      name: projectName,
      description: `This is triggered by creating or updating CodeCommit repositories.`,
      environment: {
        computeType: 'BUILD_GENERAL1_SMALL',
        image: buildImage,
        type: 'LINUX_CONTAINER',
      },

      artifacts: {
        type: 'NO_ARTIFACTS',
      },
      source: {
        type: 'CODECOMMIT',
      },
      badgeEnabled: true,
      timeoutInMinutes: 10,
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
};

main()
  .then(() => {
    return;
  })
  .catch((e) => {
    console.error('[ERROR] create ci project failed.', e);
  });
