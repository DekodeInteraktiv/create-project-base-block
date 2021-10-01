# Create Project Base Block

Create Project Base Block is an easy way to create blocks compatible with Dekodes [Project Base template](https://github.com/dekodeInteraktiv/project-base). It generates PHP, JS, CSS, and everything else you need to get started with development.

## Usage
All of the configuration is set to all default values unless overridden with some of the options listed below. Running the script guides you through a block setup, allowing you to autofill everything from css-classes to the `block.json`-file.

Options:

```bash
<slug>                       block slug
-V, --version                output the version number
-t, --template <name>        block template type name, allowed values: "innerblocks", "plain" (default: "plain")
--namespace <value>          internal namespace for the block name
--title <value>              display title for the block
--short-description <value>  short description for the block
--category <name>            category name for the block
-h, --help                   output usage information
```

When you scaffold a block, you must provide at least a `slug` name and the `namespace` which usually corresponds to either the `theme` name or the project textdomain. In most cases, we recommended pairing blocks with plugins rather than themes, because only using plugin ensures that all blocks still work when your theme changes.

### The two templates:
The two mentioned templates, `plain` and `innerblocks`, let you chose between two server side rendering-ready block boilerplates.

The `innerblock` template comes ready with an innerblock prepped `edit`-function letting you easily define both the block template, as well as allowed blocks. The render method prints the innerblock content in a wrapper.

The `plain` template comes ready with all the files you need to get started on a custom block.

Both templates come with all the necessary `JS`, `CSS` and `PHP`-files, and the blocks follow a `<namespace>-<slug>` name structure for css classes.
