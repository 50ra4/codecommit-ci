declare module 'process' {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        NODE_ENV?: string;
        /** for build options */
        BUILD_PATH?: string;
        AWS_REGION: string;
        /** for code build */
        CODE_BUILD_ROLE_ARN: string;
        CODE_BUILD_BUILD_IMAGE?: string;
        // V2
        CODE_BUILD_PROJECT_NAME: string;
      }
    }
  }
}
