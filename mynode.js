const fs = require('fs');
const path = require('path');
const successColor = '\x1b[32m%s\x1b[0m';
const checkSign = '\u{2705}';

const envFile = `import { AppConfig } from '../app/app-config';
export const environment: AppConfig = {
    apiUrl: ${process.env.apiUrl},
    projectId: '${process.env.projectId}',
    graphhopperApiKey: '${process.env.graphhopperApiKey}'

};
`;
const targetPath = path.join(__dirname, './src/environments/environment.ts');
fs.writeFile(targetPath, envFile, (err) => {
  if (err) {
    console.error(err);
    throw err;
  } else {
    console.log(successColor, `${checkSign} Successfully generated environment.ts`);
  }
});
