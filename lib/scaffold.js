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
const initPackageJSON = require( './init-package-json' );
const initWPScripts = require( './init-wp-scripts' );

module.exports = async (
	blockTemplate,
	{ namespace, slug, title, description, category, keywords, viewFiles, includeT2, npmDevDependencies }
) => {
	slug = slug.toLowerCase();
	namespace = namespace.toLowerCase();

	info( '' );
	info(
		`Creating a new WordPress block in "${ namespace }-${ slug }" folder.`
	);

	const { outputTemplates, outputAssets } = blockTemplate;
	const view = {
		namespace,
		slug,
		title,
		description,
		category,
		keywords,
		rootDirectory: join( process.cwd(), `${ namespace }-${ slug }` ),
		textdomain: namespace,
		phpnamespace: capitalize( snakeCase( namespace ) ),
		phpnamespaceslug: capitalize( snakeCase( slug ) ),
		viewFiles,
		includeT2,
		npmDevDependencies,
	};

	await Promise.all(
		Object.keys( outputTemplates ).map( async ( outputFile ) => {
			const outputFilePath = join(
				`${ namespace }-${ slug }`,
				outputFile.replace( /\$slug/g, slug )
			);

			await makeDir( dirname( outputFilePath ) );

			// skip view.js and view.css if viewFiles is false.
			if ( ! viewFiles && ( outputFile === 'src/view.js' || outputFile === 'src/view.css' ) ) {
				return;
			}

			// skip webpack.config.js if includeT2 is false.
			if ( ! includeT2 && outputFile === 'webpack.config.js' ) {
				return;
			}

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

	await initPackageJSON( view );
	await initWPScripts( view );

	info( '' );
	success(
		`Done: block "${ title }" bootstrapped in the "${ namespace }-${ slug }" folder.`
	);
	info( '' );

	info( 'Remember to add a screenshot, and install the new plugin with composer. Run:' );
	code( `	composer require ${ namespace }/${ slug }:~1.0.0` );
	info( 'To get started' );

	info( '' );
	success( 'Made @ Lillehammer Stasjon with ❤️' );
	info( '' );
};
