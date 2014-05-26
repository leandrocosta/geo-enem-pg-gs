module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            all: ['**/*.js', '!node_modules/**', '!app/components/**', '!spec/helpers/**', '!app/main-built.js'],
        },

        csslint: {
            all: {
                src: ['**/*.css', '!node_modules/**', '!app/components/**'],
            }
        },

        jsvalidate: {
            options: {
                verbose: false,
            },
            all: {
                files: {
                    src: ['<%= jshint.all %>'],
                }
            }
        },

        connect: {
            server: {
                options: {
                    base: 'app',
                    port: 8000,
                    middleware:function (connect, options) {
                        var proxy = require('grunt-connect-proxy/lib/utils').proxyRequest;
                        return [
                            proxy,
                            connect.static(options.base),
                            connect.directory(options.base)
                        ];
                    }
                },
                proxies: [
                    {
                        context: '/geoserver',
                        /*host: 'localhost',
                        port: 8090,*/
                        host: 'geo-enem.rhcloud.com',
                        port: 80,
                        changeOrigin: true
                    }
                ]
            }
        },

        watch: {
            options: {
                livereload: true,
            },
            all: {
                files: ['Gruntfile.js', 'spec/**/*.js', 'app/**/*', '!app/components/**'],
                tasks: ['jshint', 'jsvalidate'],
            }
        },

        bower: {
            target: {
                rjsConfig: 'app/main.js',
                options: {
                    exclude: ['requirejs', 'requirejs-text', 'backbone-forms']
                }
            }
        },

        requirejs: {
            compile: {
                options: {
                    baseUrl: 'app',
                    name: 'main',
                    mainConfigFile: 'app/main.js',
                    out: 'app/main-built.js',
                    preserveLicenseComments: false,
                    optimize: 'uglify',

                    /*optimizeCss: "standard.keepLines",
                    cssIn: 'app/css/main.css',*/
                    /*cssOut: 'app/css/main-built.css',*/

                    onBuildWrite: function(name, path, contents) {
                        return contents.replace(/console.log(.*);/g, '');
                    }
                }
            },
            css: {
                options: {
                    optimizeCss: 'standard',
                    cssIn: 'app/css/main.css',
                    out: 'app/css/main-built.css'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-bower-requirejs');
    grunt.loadNpmTasks('grunt-connect-proxy');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-jsvalidate');

    // Default task.
    grunt.registerTask('default', ['configureProxies:server', 'connect', 'watch']);
};
