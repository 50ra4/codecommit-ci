import { CodeBuildClient } from '@aws-sdk/client-codebuild';
import type { EventBridgeHandler } from 'aws-lambda';

import { createBuildProject } from '@/features/ci/createBuildProject';
import { generateBuildProjectName } from '@/features/ci/generateBuildProjectName';
import { runBuildProject } from '@/features/ci/runBuildProject';
import type {
  CIEventBridgeDetail,
  CIEventBridgeResult,
} from '@/features/ci/utilityType';

const region = process.env.REGION;

// 設定が必要な環境変数一覧
const serviceRole = process.env.CODE_BUILD_ROLE_ARN;
const buildImage = process.env.CODE_BUILD_BUILD_IMAGE;
const buildSpecPath = process.env.BUILD_SPEC_PATH; // FIXME: 不要？

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
    const { repositoryNames, sourceReference, pullRequestId } = event.detail;
    const repositoryName = repositoryNames.at(0);
    if (!repositoryName) {
      throw new Error('リポジトリ名の取得に失敗しました.');
    }

    // FIXME: プロジェクト名をいい感じに修正する
    const projectName = generateBuildProjectName({
      repositoryName,
      pullRequestId,
    });

    const codeBuild = new CodeBuildClient({ region });

    // プロジェクトの作成
    await createBuildProject({
      codeBuild,
      projectName,
      sourceReference,
      repositoryName,
      pullRequestId,
      serviceRole,
      region,
      buildImage,
      buildSpecPath,
    });

    // プロジェクト作成後に実行
    await runBuildProject({
      codeBuild,
      projectName,
    });

    return callback(null, {
      statusCode: 200,
    });
  } catch (error) {
    console.error('[ERROR] create build project failed.', error);
    return callback(error as Error);
  }
};
