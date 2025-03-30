import type {Config} from 'jest';
const config: Config = { 
    verbose: true,
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },
    testEnvironment: "jest-environment-jsdom",
    moduleFileExtensions: ['js', 'ts', 'jsx', 'tsx'],
  
}

export default config;