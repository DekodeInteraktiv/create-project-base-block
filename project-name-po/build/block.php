<?php
/*
 * Render block.
 *
 * @package project-name
 */

declare( strict_types = 1 );

namespace Project_name\Blocks\Po;

/**
 * Server Side render callback.
 *
 * @param  array $attributes Block attritues.
 * @return string
 */
function render( array $attributes ) : string {
	$wrapper_attributes = get_block_wrapper_attributes( [
		'class' => 'project-name-po',
	] );

	return sprintf( '
		<div %s>
			<div class="project-name-po__blocks">
				%s
			</div>
		</div>',
		$wrapper_attributes,
		$content
	);
}

/**
 * Register plugin Block Type.
 *
 * @return void
 */
function block_init() {
	\register_block_type_from_metadata( __DIR__, [
		'render_callback' => __NAMESPACE__ . '\\render',
	] );
}

\add_action( 'init', __NAMESPACE__ . '\\block_init' );
