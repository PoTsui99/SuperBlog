module.exports = {
  devServer: {
      proxy: {
          '/blog': {
              target: `http://127.0.0.1:8000/blog`,
              changeOrigin: true,
              pathRewrite: {
                  '^/blog': ''
              }
            },
          '/api': {
            // 将api开头路由到后端服务器的api URL地址上
            target: `http://127.0.0.1:8000/api`,
            changeOrigin: true,
            pathRewrite: {
              '^/api': ''
            },
          },
          '/photo': {
            target: `http://127.0.0.1:8000/photo/`,
            changeOrigin: true,
            pathRewrite: {
              '^/photo/': ''
            }
          },
          '/comment': {
            target: `http://127.0.0.1:8000/comment/`,
            changeOrigin: true,
            pathRewrite: {
              '^/comment/': ''
            }
          }
      }
  }
};