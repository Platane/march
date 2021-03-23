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
import { GenerateSW } from "workbox-webpack-plugin";

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
    }),

    new HtmlPlugin({
      title: "🧺",
    }),

    new GenerateSW({
      swDest: "service-worker.js",
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
    const cache = new Map<string, Buffer>();

    app.post("/upload", (req, res) => {
      const key = Math.random().toString(36).slice(2, 8);

      const url = new URL(
        `/get/${key}`,
        req.headers.origin || req.headers.referer
      ).toString();

      const chunks: Buffer[] = [];
      req.on("data", (c) => chunks.push(c));
      req.on("end", () => {
        cache.set(key, Buffer.concat(chunks));

        res.write(url);
        res.end();
      });
    });

    app.get("/get/:key", (req, res) => {
      const key = req.params.key as string;

      if (!cache.has(key)) {
        res.writeHead(404);
        res.end();
      } else {
        res.writeHead(200, {
          ["content-type"]: "application/octet-stream",
          ["Access-Control-Allow-Origin"]: "*",
        });
        res.write(cache.get(key));
        res.end();
      }
    });
  },
};

export default {
  ...webpackConfiguration,
  devServer: webpackDevServerConfiguration,
};
