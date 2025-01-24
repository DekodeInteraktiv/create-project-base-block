<?php
/**
 * Plugin Name: Block - Block Name
 * Description: Example block description.
 * Text Domain: project-name
 * Author:      Dekode Interaktiv
 * Version:     1.0.0
 * AuthorURI:   https://dekode.no/
 * Update URI:  false
 *
 * @package     project-name
 */

declare( strict_types = 1 );

namespace Project_name\Blocks;

\array_map( fn( $f ) => require_once $f, \glob( __DIR__ . '/build/*/block.php' ) );
