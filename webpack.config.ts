import * as path from "path";
import CopyPlugin from "copy-webpack-plugin";
import HtmlPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import {
  Configuration as WebpackConfiguration,
  EnvironmentPlugin,
} from "webpack";
import type { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import TerserPlugin from "terser-webpack-plugin";
import { InjectManifest } from "workbox-webpack-plugin";
import { initServerStore } from "./server";

const mode =
  process.env.NODE_ENV === "production" ? "production" : "development";

const webpackConfiguration: WebpackConfiguration = {
  mode,
  devtool: false,
  entry: path.join(__dirname, "src/index"),
  output: {
    path: path.join(__dirname, "build"),
    filename: "[contenthash].js",
    publicPath: "",
  },
  resolve: { extensions: [".tsx", ".ts", ".js"] },
  optimization: {
    minimize: mode === "production",
    minimizer: [
      new TerserPlugin({
        exclude: [/(draco|basis)\//],
      }) as any,
    ],
  },
  module: {
    rules: [
      {
        test: /\.(bmp|gif|png|jpeg|jpg|svg|glb|hdr)$/,
        loader: "file-loader",
        options: { name: "[contenthash].[ext]" },
      },

      {
        test: /\.(ts|tsx|js)$/,
        use: [
          { loader: "babel-loader" },
          { loader: "@linaria/webpack-loader" },
        ],
      },

      {
        test: /\.css$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: "css-loader" },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: "[contenthash].css" }),

    new EnvironmentPlugin({}),

    new CopyPlugin({
      patterns: [
        {
          from: path.join(
            __dirname,
            "./node_modules/three/examples/js/libs/draco"
          ),
          to: `draco/`,
          filter: (f: string) => [".js", ".wasm"].includes(path.extname(f)),
        },
        {
          from: path.join(
            __dirname,
            "./node_modules/three/examples/js/libs/basis"
          ),
          to: `basis/`,
          filter: (f: string) => [".js", ".wasm"].includes(path.extname(f)),
        },
      ],
    }) as any,

    new HtmlPlugin({
      title: "🧺",
    }),

    new InjectManifest({
      swSrc: path.join(__dirname, "src/service-worker.ts"),
      exclude: [/\.LICENSE\.txt/],
    }),

    new BundleAnalyzerPlugin({
      openAnalyzer: false,
      analyzerMode: "static",
    }),
  ],
};

const webpackDevServerConfiguration: WebpackDevServerConfiguration = {
  port: 8080,
  host: "0.0.0.0",
  useLocalIp: true,
  stats: "minimal",
  open: true,
  https: true,
  after: (app) => {
    initServerStore(app);
  },
};

export default {
  ...webpackConfiguration,
  devServer: webpackDevServerConfiguration,
};
