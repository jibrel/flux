import axios from 'axios';

export default class ConfigManager {
    constructor(config = {}) {
        this.config = global.CONFIG ? { ...global.CONFIG , ...config } : { ...config };
    }

    addConfiguration(conf) {
        if (conf) {
            this.config = {
                ...this.config,
                ...conf
            };
        }
    }

    async loadConfiguration(url) {
        const response = await axios.get(url);
        if (response) {
            this.addConfiguration(response.data);
        }
    }

    get(name, defaultValue) {
        const parts = name.split('.');
        let context = this.config;
        let value = null;
        for (const i in parts) {
            const part = parts[i];
            value = context[part];
            context = value;
        }
        return value || defaultValue;
    }
}

const instance = new ConfigManager();
export { instance as ConfigManagerInstance };
