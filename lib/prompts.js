/**
 * External dependencies
 */
const { upperFirst } = require( 'lodash' );

const slug = {
	type: 'input',
	name: 'slug',
	message: 'The block slug used for identification:',
	validate( input ) {
		if ( ! /^[a-z][a-z0-9\-]*$/.test( input ) ) {
			return 'Invalid block slug specified. Block slug can contain only lowercase alphanumeric characters or dashes, and start with a letter.';
		}

		return true;
	},
};

const namespace = {
	type: 'input',
	name: 'namespace',
	message:
		'The internal namespace for the block name (often project name or text domain):',
	validate( input ) {
		if ( ! /^[a-z][a-z0-9\-]*$/.test( input ) ) {
			return 'Invalid block namespace specified. Block namespace can contain only lowercase alphanumeric characters or dashes, and start with a letter.';
		}

		return true;
	},
};

const title = {
	type: 'input',
	name: 'title',
	message: 'The display title for your block:',
	filter( input ) {
		return input && upperFirst( input );
	},
};

const description = {
	type: 'input',
	name: 'description',
	message: 'The short description for your block (optional):',
	filter( input ) {
		return input && upperFirst( input );
	},
};

const category = {
	type: 'list',
	name: 'category',
	message: 'The category name to help users browse and discover your block:',
	choices: [ 'text', 'media', 'design', 'widgets', 'theme', 'embed' ],
};

const template = {
	type: 'list',
	name: 'template',
	message:
		'Start off with an innerblock pattern, or a SSR-friendly boilerplate:',
	choices: [ 'innerblocks', 'plain' ],
};

module.exports = {
	namespace,
	slug,
	title,
	description,
	category,
};
