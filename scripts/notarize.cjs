const { notarize } = require('@electron/notarize');
const { build } = require('../package.json');

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;  
  if (electronPlatformName !== 'darwin') {
    return;
  }

  if (!process.env.APPLE_ID || !process.env.APPLE_ID_PASSWORD) {
    console.log('Skipping notarization: APPLE_ID and/or APPLE_ID_PASSWORD environment variables not set');
    return;
  }

  const appName = context.packager.appInfo.productFilename;

  console.log(`Notarizing ${appName}...`);

  return await notarize({
    appBundleId: build.appId,
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_ID_PASSWORD,
    teamId: process.env.APPLE_TEAM_ID
  });
};
