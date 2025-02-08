
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * _Unlike_ [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * ```ts
 * import { API_KEY } from '$env/static/private';
 * ```
 * 
 * Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * 
 * ```
 * MY_FEATURE_FLAG=""
 * ```
 * 
 * You can override `.env` values from the command line like so:
 * 
 * ```bash
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module '$env/static/private' {
	export const SECRET_ALCHEMY_API_KEY: string;
	export const SECRET_ETHERSCAN_API_KEY: string;
	export const NVM_INC: string;
	export const MANPATH: string;
	export const AIDER_USER_INPUT_COLOR: string;
	export const PROPERTY_DATA_LOCAL_API_KEY: string;
	export const NODE: string;
	export const NVM_CD_FLAGS: string;
	export const INIT_CWD: string;
	export const SHELL: string;
	export const TERM: string;
	export const TMPDIR: string;
	export const HOMEBREW_REPOSITORY: string;
	export const PERPLEXITYAI_API_KEY: string;
	export const PERL5LIB: string;
	export const CONDA_SHLVL: string;
	export const npm_config_global_prefix: string;
	export const TERM_SESSION_ID: string;
	export const PERL_MB_OPT: string;
	export const COLOR: string;
	export const npm_config_noproxy: string;
	export const ZSH: string;
	export const npm_config_local_prefix: string;
	export const USER: string;
	export const NVM_DIR: string;
	export const LS_COLORS: string;
	export const COMMAND_MODE: string;
	export const npm_config_globalconfig: string;
	export const SSH_AUTH_SOCK: string;
	export const __CF_USER_TEXT_ENCODING: string;
	export const npm_execpath: string;
	export const PAGER: string;
	export const MAMBA_EXE: string;
	export const LSCOLORS: string;
	export const SUPABASE_LOCAL_ANON_KEY: string;
	export const PATH: string;
	export const TERMINAL_EMULATOR: string;
	export const npm_config_engine_strict: string;
	export const npm_package_json: string;
	export const __CFBundleIdentifier: string;
	export const DATA_FETCH_DB_STAGE_USERNAME: string;
	export const R2_ENDPOINT: string;
	export const AIDER_TOOL_OUTPUT_COLOR: string;
	export const npm_config_init_module: string;
	export const npm_config_userconfig: string;
	export const PWD: string;
	export const npm_command: string;
	export const MAMBA_ROOT_PREFIX: string;
	export const EDITOR: string;
	export const npm_lifecycle_event: string;
	export const STAGE_PROPERTY_DATA_API_KEY: string;
	export const npm_package_name: string;
	export const NODE_PATH: string;
	export const GIT_ACTOR: string;
	export const XPC_FLAGS: string;
	export const npm_config_npm_version: string;
	export const npm_config_node_gyp: string;
	export const XPC_SERVICE_NAME: string;
	export const DATA_FETCH_DB_STAGE_PASSWORD: string;
	export const npm_package_version: string;
	export const HOME: string;
	export const SHLVL: string;
	export const GIT_TOKEN: string;
	export const STAGE_PROPERTY_DATA_API_URI: string;
	export const HUGGINGFACE_API_KEY: string;
	export const HOMEBREW_PREFIX: string;
	export const PROPERTY_DATA_STAGE_API_KEY: string;
	export const PERL_LOCAL_LIB_ROOT: string;
	export const LOGNAME: string;
	export const LESS: string;
	export const npm_config_cache: string;
	export const npm_lifecycle_script: string;
	export const LC_CTYPE: string;
	export const AIDER_ASSISTANT_OUTPUT_COLOR: string;
	export const R2_ACCESS_KEY_ID: string;
	export const NVM_BIN: string;
	export const npm_config_user_agent: string;
	export const HOMEBREW_CELLAR: string;
	export const INFOPATH: string;
	export const R2_SECRET_ACCESS_KEY: string;
	export const OPEN_API_KEY: string;
	export const PERL_MM_OPT: string;
	export const npm_config_prefix: string;
	export const npm_node_execpath: string;
	export const NODE_ENV: string;
}

/**
 * Similar to [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Values are replaced statically at build time.
 * 
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module '$env/static/public' {
	
}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * This module cannot be imported into client-side code.
 * 
 * Dynamic environment variables cannot be used during prerendering.
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 * 
 * > In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module '$env/dynamic/private' {
	export const env: {
		SECRET_ALCHEMY_API_KEY: string;
		SECRET_ETHERSCAN_API_KEY: string;
		NVM_INC: string;
		MANPATH: string;
		AIDER_USER_INPUT_COLOR: string;
		PROPERTY_DATA_LOCAL_API_KEY: string;
		NODE: string;
		NVM_CD_FLAGS: string;
		INIT_CWD: string;
		SHELL: string;
		TERM: string;
		TMPDIR: string;
		HOMEBREW_REPOSITORY: string;
		PERPLEXITYAI_API_KEY: string;
		PERL5LIB: string;
		CONDA_SHLVL: string;
		npm_config_global_prefix: string;
		TERM_SESSION_ID: string;
		PERL_MB_OPT: string;
		COLOR: string;
		npm_config_noproxy: string;
		ZSH: string;
		npm_config_local_prefix: string;
		USER: string;
		NVM_DIR: string;
		LS_COLORS: string;
		COMMAND_MODE: string;
		npm_config_globalconfig: string;
		SSH_AUTH_SOCK: string;
		__CF_USER_TEXT_ENCODING: string;
		npm_execpath: string;
		PAGER: string;
		MAMBA_EXE: string;
		LSCOLORS: string;
		SUPABASE_LOCAL_ANON_KEY: string;
		PATH: string;
		TERMINAL_EMULATOR: string;
		npm_config_engine_strict: string;
		npm_package_json: string;
		__CFBundleIdentifier: string;
		DATA_FETCH_DB_STAGE_USERNAME: string;
		R2_ENDPOINT: string;
		AIDER_TOOL_OUTPUT_COLOR: string;
		npm_config_init_module: string;
		npm_config_userconfig: string;
		PWD: string;
		npm_command: string;
		MAMBA_ROOT_PREFIX: string;
		EDITOR: string;
		npm_lifecycle_event: string;
		STAGE_PROPERTY_DATA_API_KEY: string;
		npm_package_name: string;
		NODE_PATH: string;
		GIT_ACTOR: string;
		XPC_FLAGS: string;
		npm_config_npm_version: string;
		npm_config_node_gyp: string;
		XPC_SERVICE_NAME: string;
		DATA_FETCH_DB_STAGE_PASSWORD: string;
		npm_package_version: string;
		HOME: string;
		SHLVL: string;
		GIT_TOKEN: string;
		STAGE_PROPERTY_DATA_API_URI: string;
		HUGGINGFACE_API_KEY: string;
		HOMEBREW_PREFIX: string;
		PROPERTY_DATA_STAGE_API_KEY: string;
		PERL_LOCAL_LIB_ROOT: string;
		LOGNAME: string;
		LESS: string;
		npm_config_cache: string;
		npm_lifecycle_script: string;
		LC_CTYPE: string;
		AIDER_ASSISTANT_OUTPUT_COLOR: string;
		R2_ACCESS_KEY_ID: string;
		NVM_BIN: string;
		npm_config_user_agent: string;
		HOMEBREW_CELLAR: string;
		INFOPATH: string;
		R2_SECRET_ACCESS_KEY: string;
		OPEN_API_KEY: string;
		PERL_MM_OPT: string;
		npm_config_prefix: string;
		npm_node_execpath: string;
		NODE_ENV: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * Similar to [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 * 
 * Dynamic environment variables cannot be used during prerendering.
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
