import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  extraBabelPlugins: [
    [
      'babel-plugin-import',
      { libraryName: '@formily/antd', libraryDirectory: 'lib', style: true },
    ],
  ],
  layout: {},
  antd: {},
  dva: false,
  fastRefresh: {},
  esbuild: {},
  // mfsu: {},
  webpack5: {},
  dynamicImport: {},
  locale: {
    antd: true,
    title: true,
  },
  hash: true,
  // openAPI: {
  //   projectName: "openApi",
  //   requestLibPath: "import { request } from 'umi'",
  //   // 或者使用在线的版本
  //   schemaPath: "http://localhost:44356/swagger/v1/swagger.json",
  //   mock: false,
  // }
});
