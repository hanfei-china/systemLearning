const path = require('path')
module.exports = {
    publicPath: 'association-manage-dev',
    assetsDir: 'assets',
    devServer: {
        host: '0.0.0.0',
        hot: true,
        disableHostCheck: true,
        // https: true
    },
    configureWebpack: {
        resolve: { extensions: [".ts", ".tsx", ".js", ".json"] },
        module: {
            rules: [{
                    test: /\.tsx?$/,
                    loader: 'ts-loader',
                    options: {
                        appendTsSuffixTo: [/\.vue$/],
                    }
                },
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    include: [
                        path.resolve('node_modules/resize-detector'),
                        path.resolve('node_modules/element-ui/packages'),

                        path.resolve('node_modules/element-ui/src'),
                    ],
                },
                {
                    test: /\.ts$/,
                    loader: 'ts-loader',
                    include: [
                        path.resolve('node_modules/resize-detector')
                    ],
                }

            ]
        },
    }
}
