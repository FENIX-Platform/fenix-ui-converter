var Path = require('path');

process.env.NODE_ENV = process.env.NODE_ENV || 'test';

var coverage = process.env.COVERAGE === 'true';
var ci = process.env.NODE_ENV === 'test:ci';
if (coverage) {
    console.log('-- recording coverage --');
}

var webpackConfig = require('./webpack.config')[0];
var preprocessors = {};
preprocessors['test/**/*.js'] = ['webpack'];
preprocessors['src/**/*.js'] = ['webpack'];

module.exports = function (config) {
    config.set({
        basePath: './',
        frameworks: ['chai', 'mocha'],
        reporters: getReporters(),
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatchBatchDelay: 300,
        files: [
            "./dist/**/*.js",
            "./src/**/*.js",
            "./test/**/*.js"
        ],
        exclude: [],
        preprocessors: preprocessors,
        webpack: webpackConfig,
        webpackMiddleware: {
            noInfo: true
        },
        coverageReporter: {
            reporters: [
                {type: 'lcov', dir: 'coverage/', subdir: '.'},
                {type: 'json', dir: 'coverage/', subdir: '.'},
                {type: 'text-summary'}
            ]
        },
        autoWatch: !ci,
        browsers: ['Chrome'], //['Firefox'],
        singleRun: ci,
        browserNoActivityTimeout: 180000,
        plugins: [
            'karma-webpack',
            'karma-mocha',
            'karma-chai',
            'karma-coverage',
            'karma-chrome-launcher',
            'karma-firefox-launcher'
        ]
    });
};

function getReporters() {
    var reps = ['progress'];
    if (coverage) {
        reps.push('coverage');
    }
    return reps;
}