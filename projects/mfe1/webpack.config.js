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
    uniqueName: "mfe1", // name - has to be unique.
    publicPath: "auto"  // optional. example of public path: http://localhost:3000/
  },
  optimization: {
    runtimeChunk: false  // only needed to bypass a temporary bug
  },
  resolve: {
    alias: {
      ...sharedMappings.getAliases(),
    }
  },
  plugins: [
    new ModuleFederationPlugin({

      // For remotes (please adjust)
      name: "mfe1",
      filename: "remoteEntry.js",  // 2-3K w/ Meta Data
      exposes: {
          './Module': './projects/mfe1/src/app/flights/flights.module.ts',
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
