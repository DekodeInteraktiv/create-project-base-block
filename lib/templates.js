/**
 * External dependencies
 */
const glob = require( 'fast-glob' );
const { readFile } = require( 'fs' ).promises;
const { fromPairs, isObject } = require( 'lodash' );
const { join } = require( 'path' );

/**
 * Internal dependencies
 */
const CLIError = require( './cli-error' );
const prompts = require( './prompts' );

const predefinedBlockTemplates = {
	plain: {
		defaultValues: {
			slug: 'block-name',
			namespace: 'project-name',
			title: 'Block Name',
			description: 'Example block description.',
		},
		templatesPath: join( __dirname, 'templates', 'plain' ),
	},
	plainTypeScript: {
		defaultValues: {
			slug: 'block-name',
			namespace: 'project-name',
			title: 'Block Name',
			description: 'Example block description.',
		},
		templatesPath: join( __dirname, 'templates', 'plain-typescript' ),
	},
	innerblocks: {
		defaultValues: {
			slug: 'block-name',
			namespace: 'project-name',
			title: 'Block Name',
			description: 'Example block description.',
		},
		templatesPath: join( __dirname, 'templates', 'innerblocks' ),
	},
	innerblocksTypeScript: {
		defaultValues: {
			slug: 'block-name',
			namespace: 'project-name',
			title: 'Block Name',
			description: 'Example block description.',
		},
		templatesPath: join( __dirname, 'templates', 'innerblocks-typescript' ),
	},
};

const getOutputTemplates = async ( outputTemplatesPath ) => {
	const outputTemplatesFiles = await glob( '**/*.mustache', {
		cwd: outputTemplatesPath,
		dot: true,
	} );
	return fromPairs(
		await Promise.all(
			outputTemplatesFiles.map( async ( outputTemplateFile ) => {
				const outputFile = outputTemplateFile.replace(
					/\.mustache$/,
					''
				);
				const outputTemplate = await readFile(
					join( outputTemplatesPath, outputTemplateFile ),
					'utf8'
				);
				return [ outputFile, outputTemplate ];
			} )
		)
	);
};

const getOutputAssets = async ( outputAssetsPath ) => {
	const outputAssetFiles = await glob( '**/*', {
		cwd: outputAssetsPath,
		dot: true,
	} );
	return fromPairs(
		await Promise.all(
			outputAssetFiles.map( async ( outputAssetFile ) => {
				const outputAsset = await readFile(
					join( outputAssetsPath, outputAssetFile )
				);
				return [ outputAssetFile, outputAsset ];
			} )
		)
	);
};

const configToTemplate = async ( {
	assetsPath,
	defaultValues = {},
	templatesPath,
} ) => {
	if ( ! isObject( defaultValues ) || ! templatesPath ) {
		throw new CLIError( 'Template found but invalid definition provided.' );
	}

	return {
		defaultValues,
		outputAssets: assetsPath ? await getOutputAssets( assetsPath ) : {},
		outputTemplates: await getOutputTemplates( templatesPath ),
	};
};

const getBlockTemplate = async ( templateName ) => {
	if ( predefinedBlockTemplates[ templateName ] ) {
		return await configToTemplate(
			predefinedBlockTemplates[ templateName ]
		);
	}

	try {
		return await configToTemplate( require( templateName ) );
	} catch ( error ) {
		if ( error instanceof CLIError ) {
			throw error;
		} else if ( error.code !== 'MODULE_NOT_FOUND' ) {
			throw new CLIError(
				`Invalid block template loaded. Error: ${ error.message }`
			);
		}
	}
};

const getDefaultValues = ( blockTemplate ) => {
	return {
		namespace: 'project-name',
		category: 'text',
		...blockTemplate.defaultValues,
	};
};

const getPrompts = ( blockTemplate ) => {
	const defaultValues = getDefaultValues( blockTemplate );
	return Object.keys( prompts ).map( ( promptName ) => {
		return {
			...prompts[ promptName ],
			default: defaultValues[ promptName ],
		};
	} );
};

module.exports = {
	getBlockTemplate,
	getDefaultValues,
	getPrompts,
};
