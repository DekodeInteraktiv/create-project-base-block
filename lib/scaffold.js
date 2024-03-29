/**
 * External dependencies
 */
const { writeFile } = require( 'fs' ).promises;
const makeDir = require( 'make-dir' );
const { render } = require( 'mustache' );
const { dirname, join } = require( 'path' );
const { snakeCase, capitalize } = require( 'lodash' );

/**
 * Internal dependencies
 */
const { code, info, success } = require( './log' );

module.exports = async (
	blockTemplate,
	{ namespace, slug, title, description, category, keywords }
) => {
	slug = slug.toLowerCase();
	namespace = namespace.toLowerCase();

	info( '' );
	info(
		`Creating a new WordPress block in "${ namespace }-block-${ slug }" folder.`
	);

	const { outputTemplates, outputAssets } = blockTemplate;
	const view = {
		namespace,
		slug,
		title,
		description,
		category,
		keywords,
		textdomain: namespace,
		phpnamespace: capitalize( snakeCase( namespace ) ),
		phpnamespaceslug: capitalize( snakeCase( slug ) ),
	};

	await Promise.all(
		Object.keys( outputTemplates ).map( async ( outputFile ) => {
			const outputFilePath = join(
				`${ namespace }-block-${ slug }`,
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
		`Done: block "${ title }" bootstrapped in the "${ namespace }-block-${ slug }" folder.`
	);
	info( '' );

	info( 'Remember to add a screenshot, and install the new plugin with composer. Run:' );
	code( `	composer require ${ namespace }/block-${ slug }:~1.0.0` );
	info( 'To get started' );

	info( '' );
	success( 'Made @ Lillehammer Stasjon with ❤️' );
	info( '' );
};
