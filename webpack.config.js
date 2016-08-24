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
    entry = {},
    vendors = Object.keys(packageJson.dependencies),
    nodeModulesDir = Path.resolve(__dirname, '../node_modules');

console.log("NODE_ENV === " + NODE_ENV)


// plugins included only in production environment
if (production) {

    plugins = plugins.concat([
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
}

entry["app"] = [packageJson.main];
// add entry for vendor bundle
entry["vendors"] = vendors; //add every vendor here

console.log(entry["vendors"])

module.exports = {
    debug: !production, //switch loader to debug mode
    devtool: production ? false : 'eval', //source map generation
    entry: entry,
    output: {
        path: Path.join(__dirname, distFolderPath),
        //hash for long term cache
        filename: production ? packageJson.name + '.min.js' : packageJson.name + ".js",
        //chunkFilename: 'chunk-[id].[hash].js'
    },
    resolve: {
        root: Path.resolve(__dirname),
        alias: {
            module :  packageJson.name + ".min.js",
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
                exclude: [nodeModulesDir], // exclude any and all files in the node_modules folder
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
        new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js')
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