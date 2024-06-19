import { CodeBuildClient, StartBuildCommand } from '@aws-sdk/client-codebuild';
import type { EventBridgeHandler } from 'aws-lambda';

const region = process.env.AWS_REGION;
// 設定が必要な環境変数一覧
const projectName = process.env.CODE_BUILD_PROJECT_NAME;

type CIEventBridgeDetail = {
  repositoryNames: string[];
  sourceCommit: string;
  pullRequestId: string;
};
type CIEventBridgeResult = { statusCode: number } | void;

/**
 *
 * @see https://zenn.dev/nekoze_climber/articles/930c40132e1d45
 */
export const handler: EventBridgeHandler<
  string,
  CIEventBridgeDetail,
  CIEventBridgeResult
> = async (event, _, callback) => {
  console.log('[INFO] create build project start.', event);

  try {
    const {
      repositoryNames,
      sourceCommit: sourceVersion,
      pullRequestId,
    } = event.detail;
    const repositoryName = repositoryNames.at(0);
    if (!repositoryName) {
      throw new Error('リポジトリ名の取得に失敗しました.');
    }

    const codeBuild = new CodeBuildClient({ region });
    await codeBuild.send(
      new StartBuildCommand({
        projectName,
        sourceVersion,
        sourceLocationOverride: `https://git-codecommit.${region}.amazonaws.com/v1/repos/${repositoryName}`,
        environmentVariablesOverride: [
          {
            name: 'REPOSITORY_NAME',
            value: repositoryName,
            type: 'PLAINTEXT',
          },
          {
            name: 'PULL_REQUEST_ID',
            value: pullRequestId,
            type: 'PLAINTEXT',
          },
        ],
      }),
    );

    return callback(null, {
      statusCode: 200,
    });
  } catch (error) {
    console.error('[ERROR] create build project failed.', error);
    return callback(error as Error);
  }
};
