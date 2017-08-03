module.exports = {
    scripts: {
        default: "nps build && node .",
        test: "flow",
        fmt: "prettier --write --tab-width 4",
        build: "flow-remove-types --pretty --out-dir lib/ src/"
    }
};
