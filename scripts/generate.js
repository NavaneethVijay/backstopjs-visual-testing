import { configGenerator } from './config-generator.js';
import { websites } from '../website-config.js';

(async () => {
    try {
        for (const siteConfig of websites) {
            console.log(`Generating configuration for ${siteConfig.name}...`);
            await configGenerator(siteConfig);
            console.log(`Configuration for ${siteConfig.name} generated successfully.`);
        }
    } catch (error) {
        console.error('Error generating configurations:', error);
    }
})();
