/**
 * External dependencies
 */

/**
 * Internal dependencies
 */
const { info } = require( './log' );

module.exports = async ( { rootDirectory } ) => {
    const { execaCommand } = await import('execa');

	info( '' );
	info(
		'Installing `@wordpress/scripts` package. It might take a couple of minutes...'
	);
	await execaCommand( 'npm install @wordpress/scripts --save-dev', {
		cwd: rootDirectory,
	} );

	info( '' );
	info( 'Formatting JavaScript files.' );
	await execaCommand( 'npm run format', {
		cwd: rootDirectory,
	} );

	info( '' );
	info( 'Compiling block.' );
	await execaCommand( 'npm run build', {
		cwd: rootDirectory,
	} );
};