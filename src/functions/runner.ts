import { CodeBuildClient } from '@aws-sdk/client-codebuild';
import type { EventBridgeHandler } from 'aws-lambda';

import { generateBuildProjectName } from '@/features/ci/generateBuildProjectName';
import { runBuildProject } from '@/features/ci/runBuildProject';
import type {
  CIEventBridgeDetail,
  CIEventBridgeResult,
} from '@/features/ci/utilityType';

const region = process.env.REGION;

/**
 *
 * @see https://zenn.dev/nekoze_climber/articles/930c40132e1d45
 */
export const handler: EventBridgeHandler<
  string,
  CIEventBridgeDetail,
  CIEventBridgeResult
> = async (event, _, callback) => {
  console.log('[INFO] start build project start.', event);

  try {
    const { repositoryNames, sourceReference, pullRequestId } = event.detail;
    const repositoryName = repositoryNames.at(0);
    if (!repositoryName) {
      throw new Error('リポジトリ名の取得に失敗しました.');
    }

    const branchName = sourceReference.split('/').at(-1);
    if (!branchName) {
      throw new Error('ブランチ名の取得に失敗しました.');
    }

    // FIXME: プロジェクト名をいい感じに修正する
    const projectName = generateBuildProjectName({
      repositoryName,
      pullRequestId,
    });

    const codeBuild = new CodeBuildClient({ region });

    await runBuildProject({
      codeBuild,
      projectName,
    });

    return callback(null, {
      statusCode: 200,
    });
  } catch (error) {
    console.error('[ERROR] start build project failed.', error);
    return callback(error as Error);
  }
};
