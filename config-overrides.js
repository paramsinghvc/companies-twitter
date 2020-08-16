const {
    override,
    addWebpackAlias
} = require("customize-cra");
const path = require("path");

module.exports = override(
    addWebpackAlias({
        assets: path.resolve(__dirname, 'src/assets'),
        core: path.resolve(__dirname, 'src/core'),
        scenes: path.resolve(__dirname, 'src/scenes'),
        shared: path.resolve(__dirname, 'src/shared'),
    })
);