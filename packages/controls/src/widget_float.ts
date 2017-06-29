// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
    CoreDescriptionModel
} from './widget_core';

import {
    DescriptionView
} from './widget_description';

import * as _ from 'underscore';

import {
    IntSliderView, IntRangeSliderView, IntTextView
} from './widget_int';

import {
    format
} from 'd3-format';

export
class FloatModel extends CoreDescriptionModel {
    defaults() {
        return _.extend(super.defaults(), {
            _model_name: "FloatModel",
            value: 0,
            disabled: false,
        });
    }
}

export
class BoundedFloatModel extends FloatModel {
    defaults() {
        return _.extend(super.defaults(), {
            _model_name: "BoundedFloatModel",
            max: 100.0,
            min: 0.0
        });
    }
}

export
class FloatSliderModel extends BoundedFloatModel {
    defaults() {
        return _.extend(super.defaults(), {
            _model_name: "FloatSliderModel",
            _view_name: "FloatSliderView",
            step: 1.0,
            orientation: "horizontal",
            _range: false,
            readout: true,
            readout_format: '.2f',
            slider_color: null,
            continuous_update: true
        });
    }
    initialize(attributes, options) {
        super.initialize(attributes, options);
        this.on('change:readout_format', this.update_readout_format, this);
        this.update_readout_format();
    }

    update_readout_format() {
        this.readout_formatter = format(this.get('readout_format'));
    }

    readout_formatter: any;
}

export
class FloatRangeSliderModel extends FloatSliderModel {}

export
class FloatSliderView extends IntSliderView {
    /**
     * Validate the value of the slider before sending it to the back-end
     * and applying it to the other views on the page.
     */
    _validate_slide_value(x) {
        return x;
    }

    _parse_value = parseFloat
}

export
class FloatRangeSliderView extends IntRangeSliderView {
    /**
     * Validate the value of the slider before sending it to the back-end
     * and applying it to the other views on the page.
     */
    _validate_slide_value(x) {
        return x;
    }

    _parse_value = parseFloat

    // matches: whitespace?, float, whitespace?, (hyphen, colon, or en-dash), whitespace?, float
    _range_regex = /^\s*([+-]?(?:\d*\.?\d+|\d+\.)(?:[eE][-:]?\d+)?)\s*[-:–]\s*([+-]?(?:\d*\.?\d+|\d+\.)(?:[eE][+-]?\d+)?)/
}

export
class FloatTextModel extends FloatModel {
    defaults() {
        return _.extend(super.defaults(), {
            _model_name: "FloatTextModel",
            _view_name: "FloatTextView"
        });
    }
}

export
class BoundedFloatTextModel extends BoundedFloatModel {
    defaults() {
        return _.extend(super.defaults(), {
            _model_name: "BoundedFloatTextModel",
            _view_name: "FloatTextView"
        });
    }
}

export
class FloatTextView extends IntTextView {
    _parse_value = parseFloat;
}

export
class FloatProgressModel extends BoundedFloatModel {
    defaults() {
        return _.extend(super.defaults(), {
            _model_name: 'FloatProgressModel',
            _view_name: 'ProgressView',
            orientation: 'horizontal',
            bar_style: '',
            style: null
        });
    }
}
