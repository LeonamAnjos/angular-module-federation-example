const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const mf = require("@angular-architects/module-federation/webpack");
const path = require("path");

const sharedMappings = new mf.SharedMappings();
sharedMappings.register(
  path.join(__dirname, '../../tsconfig.json'),
  ['auth-lib']
);

module.exports = {
  output: {
    uniqueName: "shell",
    publicPath: "auto"
  },
  optimization: {
    runtimeChunk: false
  },
  resolve: {
    alias: {
      ...sharedMappings.getAliases(),
    }
  },
  plugins: [
    new ModuleFederationPlugin({

      // For hosts (please adjust)
      remotes: {
          "mfe1": "mfe1@http://localhost:3000/remoteEntry.js"
      },

      shared: {
        "@angular/core": { singleton: true, strictVersion: true, requiredVersion: '12.0.0' },
        "@angular/common": { singleton: true, strictVersion: true, requiredVersion: '12.0.0' },
        "@angular/router": { singleton: true, strictVersion: true, requiredVersion: '12.0.0' },
        "@angular/common/http": { singleton: true, strictVersion: true, requiredVersion: '12.0.0' },

        // Uncomment for sharing lib of an Angular CLI or Nx workspace
        ...sharedMappings.getDescriptors()
      }

    }),
    // Uncomment for sharing lib of an Angular CLI or Nx workspace
    sharedMappings.getPlugin(),
  ],
};
