/*
* @Author: xyf
* @Date:   2019-04-19 22:19:26
* @Last Modified by:   xyf
* @Last Modified time: 2019-04-24 19:00:45
*/
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

//获取html-webpack-plugin参数到方法
var getHtmlConfig=function (name){
  return {
    template:'./src/view/'+name+'.html',
    filename:'view/'+name+'.html',
    inject:true,
    hash:true,
    chunks:['common',name]
  }
}

var config = {
  entry: {
        common:['./src/common.js'],//注意这里目的不是生成common.js,而是把其放入了base.js
        index:['./src/index.js'],
        login:['./src/login.js']
  },
// 在 localhost:8080 下建立服务，将 dist 目录下的文件，作为可访问文件。
  // devServer: {
  //   contentBase: './dist'
  // },

  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, 'dist')
  },

//独立通用模块到js/base.js
  optimization:{
    splitChunks:{   //分割代码块
      chunks:'all',
      minSize: 0,//代码块的最小尺寸
      minChunks: 2,//在分割之前模块的被引用次数
      // name: true,
      name:'common',//将common打包进base.js
      //If the splitChunks.name matches an entry point name, the entry point will be removed.
      cacheGroups: {
        commons: {
          // name: "common",
          filename:'js/base.js',
          chunks: "all",
          minChunks: 2
        }
        // chunks:'all',
        // vendors: {
        //   filename: 'js/base.js',
        // }
      }
    }
    },
  //不适用
//   new webpack.optimize.CommonsChunkPlugin({
//   name : 'common',
//   filename : 'js/base.js'
// }),
    devServer: {
       contentBase: './dist'
    },


    plugins: [
    //将css单独打包到文件里
        new MiniCssExtractPlugin({
          // Options similar to the same options in webpackOptions.output
          // both options are optional
        filename: 'css/[name].css',
        chunkFilename: '[id].css',
        }),
    //html模版的处理
        new HtmlWebpackPlugin(getHtmlConfig('index','首页')),
        new HtmlWebpackPlugin(getHtmlConfig('login','登录页')),
    ],

    module:{
        rules:[
        //css 处理
        {
            test:/\.css$/,
            use: [
                {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
              // you can specify a publicPath here
              // by default it uses publicPath in webpackOptions.output
                    publicPath: '../',
                    hmr: process.env.NODE_ENV === 'development',
                },
              },
              'css-loader',
            ],
        },
        //图片、字体处理
        {
          test:/\.(png|jpg|jpeg|gif|woff|svg|eot|ttf)$/,
          use:[
            {
              loader:'file-loader',
              options:{
                  name: 'resource/[name].[ext]', 
                  limit: 1000
              }
            }
          ]
        }
        //处理html模板
        // {
        //   test:/\.html$/,
        //   use:{
        //     loader:'html-loader'
        //   }
        // },
    ],
    },


};

module.exports=config;