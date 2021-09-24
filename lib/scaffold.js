/**
 * External dependencies
 */
const { writeFile } = require( 'fs' ).promises;
const makeDir = require( 'make-dir' );
const { render } = require( 'mustache' );
const { dirname, join } = require( 'path' );

/**
 * Internal dependencies
 */
const { code, info, success } = require( './log' );

module.exports = async (
	blockTemplate,
	{
		namespace,
		slug,
		title,
		description,
		category,
	}
) => {
	slug = slug.toLowerCase();
	namespace = namespace.toLowerCase();

	info( '' );
	info( `Creating a new WordPress block in "${ slug }" folder.` );

	const { outputTemplates, outputAssets } = blockTemplate;
	const view = {
		namespace,
		slug,
		title,
		description,
		category,
		textdomain: namespace,
	};

	await Promise.all(
		Object.keys( outputTemplates ).map( async ( outputFile ) => {
			const outputFilePath = join(
				slug,
				outputFile.replace( /\$slug/g, slug )
			);
			await makeDir( dirname( outputFilePath ) );
			writeFile(
				outputFilePath,
				render( outputTemplates[ outputFile ], view )
			);
		} )
	);

	await Promise.all(
		Object.keys( outputAssets ).map( async ( outputFile ) => {
			const outputFilePath = join( slug, 'assets', outputFile );
			await makeDir( dirname( outputFilePath ) );
			writeFile( outputFilePath, outputAssets[ outputFile ] );
		} )
	);

	info( '' );
	success(
		`Done: block "${ title }" bootstrapped in the "${ slug }" folder.`
	);

	info( 'Code is Poetry' );
};
