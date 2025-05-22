import type { Config } from 'jest'

const config: Config = {
	preset: 'ts-jest',
	testEnvironment: 'jsdom',
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
	transform: {
		'^.+\\.tsx?$': ['ts-jest', { useESM: true }],
	},
	extensionsToTreatAsEsm: ['.ts', '.tsx'],
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
	},
	testMatch: ['<rootDir>/src/tests/**/*.test.(ts|tsx)'],
	globals: {
		'ts-jest': {
			useESM: true,
			tsconfig: './tsconfig.json',
		},
	},
	transformIgnorePatterns: ['node_modules/(?!(axios)/)'],
}

export default config
