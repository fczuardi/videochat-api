module.exports = {
    scripts: {
        default: "nps build && node .",
        test: "flow",
        fmt: {
            default: "prettier --write --tab-width 4",
            all: 'prettier --write --tab-width 4 "*.js" "{src,lib}/**/*.js"'
        },
        build: "flow-remove-types --sourcemaps --pretty --out-dir lib/ src/"
    }
};
