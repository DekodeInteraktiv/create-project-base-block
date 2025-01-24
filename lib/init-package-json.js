/**
 * External dependencies
 */
const npmPackageArg = require( 'npm-package-arg' );
const writePkg = require( 'write-pkg' );

/**
 * Internal dependencies
 */
const { info, error } = require( './log' );

module.exports = async ( {
	description,
	slug,
	rootDirectory,
	npmDependencies,
	npmDevDependencies,
} ) => {
	const { execaCommand } = await import('execa');

	info( '' );
	info( 'Creating a "package.json" file.' );
	
	await writePkg(
		rootDirectory,
		Object.fromEntries(
			Object.entries({
				name: slug,
				version: '1.0.0',
				description,
				author: 'Dekode Interaktiv',
				homepage: 'https://dekode.no',
				main: 'build/index.js',
				scripts: {
					build: 'wp-scripts build --webpack-copy-php',
					format: 'wp-scripts format',
					'lint:css': 'wp-scripts lint-style',
					'lint:js': 'wp-scripts lint-js',
					start: 'wp-scripts start --webpack-copy-php',
				},
			}).filter(([, value]) => value != null)
		)
	);

	/**
	 * Helper to determine if we can install this package.
	 *
	 * @param {string} packageArg The package to install.
	 */
	function checkDependency( packageArg ) {
		const { type } = npmPackageArg( packageArg );
		if (
			! [ 'git', 'tag', 'version', 'range', 'remote' ].includes( type )
		) {
			throw new Error(
				`Provided package type "${ type }" is not supported.`
			);
		}
	}

	if ( npmDependencies && npmDependencies.length ) {
		info( '' );
		info(
			'Installing npm dependencies. It might take a couple of minutes...'
		);
		for ( const packageArg of npmDependencies ) {
			try {
				checkDependency( packageArg );
				info( '' );
				info( `Installing "${ packageArg }".` );
				await execaCommand( `npm install ${ packageArg }`, {
					cwd: rootDirectory,
				} );
			} catch ( { message } ) {
				info( '' );
				info(
					`Skipping "${ packageArg }" npm dependency. Reason:`
				);
				error( message );
			}
		}
	}

	if ( npmDevDependencies && npmDevDependencies.length ) {
		info( '' );
		info(
			'Installing npm devDependencies. It might take a couple of minutes...'
		);
		for ( const packageArg of npmDevDependencies ) {
			try {
				checkDependency( packageArg );
				info( '' );
				info( `Installing "${ packageArg }".` );
				await execaCommand( `npm install ${ packageArg } --save-dev`, {
					cwd: rootDirectory,
				} );
			} catch ( { message } ) {
				info( '' );
				info(
					`Skipping "${ packageArg }" npm dev dependency. Reason:`
				);
				error( message );
			}
		}
	}
};