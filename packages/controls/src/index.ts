// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

export * from "./utils";
export * from "./widget_link";
export * from "./widget_bool";
export * from "./widget_button";
export * from "./widget_box";
export * from "./widget_image";
export * from "./widget_color";
export * from "./widget_date";
export * from "./widget_int";
export * from "./widget_float";
export * from "./widget_controller";
export * from "./widget_selection";
export * from "./widget_selectioncontainer";
export * from "./widget_string";
export * from "./widget_description";

export
const version = (require('../package.json') as any).version;

// for backwards compatibility. TODO: remove this.
export * from "@jupyter-widgets/base";
