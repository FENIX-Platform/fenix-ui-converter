NODE_ENV = process.env.NODE_ENV;

var distFolderPath = "dist",
    webpack = require('webpack'),
    CleanWebpackPlugin = require('clean-webpack-plugin'),
    packageJson = require("./package.json"),
    Path = require('path'),
    production = NODE_ENV === "production",
    plugins = [
        //clean dist folder before build
        new CleanWebpackPlugin([distFolderPath], {
            //root: '/full/project/path',
            //verbose: true,
            //dry: false
        }),
    ],
    entry = {};

// plugins included only in production environment
if (production) {

    plugins = plugins.concat([
        // vendor in a separate bundle, hash for long term cache
/*        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor",
            filename: "vendor.[hash].js",
            chucks: ["vendor"]
        }),*/
        //Merge small chunks that are lower than this min size (in chars)
        new webpack.optimize.MinChunkSizePlugin({
            minChunkSize: 51200, // ~50kb
        }),
        // uglify
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            output: {
                comments: false,
            },
        }),
    ]);

    // add entry for vendor bundle
    entry["vendor"] = ['jquery']; //add every vendor here

}

entry["app"] = [packageJson.main];

module.exports = {
    debug: !production, //switch loader to debug mode
    devtool: production ? false : 'eval', //source map generation
    entry: entry,
    output: {
        path: Path.join(__dirname, distFolderPath),
        //hash for long term cache
        filename: production ? 'bundle.[hash].js' : "bundle.js",
        //chunkFilename: 'chunk-[id].[hash].js'
    },
    resolve: {
        root: Path.resolve(__dirname),
        alias: {
            module : "bundle.[hash].js",
            __config :  Path.join(__dirname, "src/config"),
            handlebars: 'handlebars/dist/handlebars.min.js'
        }
    },
    module: {
        //jshint
        preLoaders: [
            //jshint
            {
                test: /\.js$/, // include .js files
                exclude: /node_modules/, // exclude any and all files in the node_modules folder
                loader: "jshint-loader"
            }
        ],
    },

    plugins: plugins.concat([
        // define global scoped variable, force JSON.stringify()
        new webpack.DefinePlugin({
            __DEVELOPMENT__: !production,
            VERSION: JSON.stringify(packageJson.version)
        }),
    ]),

    // more options in the optional jshint object
    jshint: {
        // any jshint option http://www.jshint.com/docs/options/
        // i. e.
        camelcase: true,

        // jshint errors are displayed by default as warnings
        // set emitErrors to true to display them as errors
        emitErrors: false,

        // jshint to not interrupt the compilation
        // if you want any file with jshint errors to fail
        // set failOnHint to true
        failOnHint: false,

        // custom reporter function
        reporter: function (errors) {
        }
    }
};