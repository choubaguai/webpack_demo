const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const uglify = require('uglifyjs-webpack-plugin');
const htmlPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const PurifyCSSPlugin = require("purifycss-webpack");
const entry = require('./webpack_config/entry_webpack.js');
const copyWebpackPlugin = require("copy-webpack-plugin");

// console.log(encodeURIComponent(process.env.type));
// if (process.env.type == "build") {
//     let website = {
//         publicPath: "http://wagon.com:1717/"
//     }
// } else {
//     let website = {
//         publicPath: "http://192.168.3.6:1717/"
//     }
// }

let website = {
    publicPath: "http://192.168.3.6:1717/"
}

module.exports = {
    devtool: 'eval-source-map',
    entry: {
        entry: './src/entry.js',
        jquery: 'jquery',
        vue: 'vue',
    },
    output: {               //出口配置
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        publicPath: website.publicPath,
    },
    module: {
        // 关于模块配置
        rules: [
            // 模块规则（配置 loader、解析器等选项）
            {
                /**它会将所有的入口 chunk(entry chunks)中引用的 *.css，
                 * 移动到独立分离的 CSS 文件。因此，你的样式将不再内嵌到 JS bundle 中，
                 * 而是会放到一个单独的 CSS 文件（即 styles.css）当中。 
                 * 如果你的样式文件大小较大，这会做更快提前加载，
                 * 因为 CSS bundle 会跟 JS bundle 并行加载。
                 * */
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {
                            loader: "css-loader",
                            options: { importLoaders: 1 }

                        },
                        {
                            loader: "postcss-loader"
                        }
                    ]
                })
            }, {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        //打包image,url-loader依赖于file-loader。所以不需要写file-loader
                        loader: 'url-loader',
                        options: {
                            limit: 8000,
                            outputPath: 'images/'
                        }
                    }
                ]
            }, {
                test: /\.(htm|html)$/i,
                use: [
                    'html-withimg-loader'
                ]
            },
            //  {
            //less打包
            //     test: /\.less$/,
            //     use: [{
            //         loader: "style-loader" // creates style nodes from JS strings
            //     }, {
            //         loader: "css-loader" // translates CSS into CommonJS
            //     }, {
            //         loader: "less-loader" // compiles Less to CSS
            //     }]
            // }
            {
                //less打包分离
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "less-loader"
                    }],
                    fallback: "style-loader"
                })
            },

            // {
            //     test: /\.scss$/,
            //     use: [{
            //         loader: "style-loader" // 将 JS 字符串生成为 style 节点
            //     }, {
            //         loader: "css-loader" // 将 CSS 转化成 CommonJS 模块
            //     }, {
            //         loader: "sass-loader" // 将 Sass 编译成 CSS
            //     }]
            // }
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "sass-loader"
                    }],
                    // 在开发环境使用 style-loader
                    fallback: "style-loader"
                })
            },
            {
                test: /\.(jsx|js)$/,
                use: {
                    loader: 'babel-loader',

                },
                exclude: /node_modules/
            }

        ]
    },
    plugins: [
        //压缩js文件,开发环境注释掉，否则无法调试
        new webpack.optimize.SplitChunksPlugin({
            cacheGroups: {
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
                //打包重复出现的代码
                vendor: {
                    chunks: 'initial',
                    minChunks: 2,
                    maxInitialRequests: 5, // The default limit is too small to showcase the effect
                    minSize: 0, // This is example is too small to create commons chunks
                    name: 'vendor'
                },
                //打包第三方类库
                commons: {
                    name: "commons",
                    chunks: "initial",
                    minChunks: Infinity
                }
            }
        }),
        // new uglify(),
        new webpack.ProvidePlugin({
            $: "jquery",

        }),
        new htmlPlugin({
            minify: {
                removeAttributeQuotes: true
            },
            //清楚缓存
            hash: true,
            //模板
            template: './src/index.html'
        }),
        //打包分离css
        new ExtractTextPlugin("css/index.css"),
        new PurifyCSSPlugin({
            paths: glob.sync(path.join(__dirname, 'src/*.html')),
        }),
        new webpack.BannerPlugin('chaoge版权所有,大吉大利晚上吃鸡。'),
        new copyWebpackPlugin([{
            from: __dirname + '/src/public',
            to: './public'
        }]),
        new webpack.HotModuleReplacementPlugin(),
    ],
    //服务操作，热更新
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        host: '192.168.3.6',
        compress: true,
        port: 1717
    },
    watchOptions: {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: /node_modules/,
    },
};
