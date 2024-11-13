import { websites } from '../website-config.js';
import backstop from 'backstopjs';

(async () => {
    try {
        for (const siteConfig of websites) {
            const { name } = siteConfig;
            console.log(`Generating references for website ${name}`);
            const configFile = `${name}.json`;
            const options = {
                config: configFile,
            };
            await backstop('reference', options);
            console.log(`Generating references completed for website ${name}`);
        }
    } catch (error) {
        console.error('Error generating references:', error);
    }
})();
