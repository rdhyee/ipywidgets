// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import * as outputWidget from '@jupyter-widgets/output';

import {
  IDisposable
} from '@phosphor/disposable';

import {
  Panel, Widget
} from '@phosphor/widgets';

import {
  WidgetManager
} from './manager';

import {
  OutputAreaModel, OutputArea
} from '@jupyterlab/outputarea';

import {
  nbformat
} from '@jupyterlab/coreutils';

import {
  KernelMessage
} from '@jupyterlab/services';

import * as _ from 'underscore';
import * as $ from 'jquery';


export
class OutputModel extends outputWidget.OutputModel {
  defaults() {
    return _.extend(super.defaults(), {
      msg_id: ''
    });
  }

  initialize(attributes: any, options: any) {
    super.initialize(attributes, options)
    this._outputs = new OutputAreaModel();
    this.listenTo(this, 'change:msg_id', this.reset_msg_id);
    this.widget_manager.context.session.kernelChanged.connect((sender, kernel) => {
      this._msgHook.dispose();
    });
    this.reset_msg_id();
  }

  reset_msg_id() {
    if (this._msgHook) {
      this._msgHook.dispose();
    }
    this._msgHook = null;

    let kernel = this.widget_manager.context.session.kernel;
    let msgId = this.get('msg_id');
    if (msgId && kernel) {
      this._msgHook = kernel.registerMessageHook(this.get('msg_id'), msg => {
        this.add(msg);
        return false;
      });
    }
  }

  add(msg: KernelMessage.IIOPubMessage) {
    let msgType = msg.header.msg_type;
    switch (msgType) {
    case 'execute_result':
    case 'display_data':
    case 'stream':
    case 'error':
      let model = msg.content as nbformat.IOutput;
      model.output_type = msgType as nbformat.OutputType;
      this._outputs.add(model);
      break;
    case 'clear_output':
        this.clear_output((msg as KernelMessage.IClearOutputMsg).content.wait);
        break;
    default:
      break;
    }
  }

  clear_output(wait: boolean = false) {
    this._outputs.clear(wait);
  }

  get outputs() {
    return this._outputs;
  }
  widget_manager: WidgetManager;

  private _msgHook: IDisposable = null;
  private _outputs: OutputAreaModel;
}


export
class OutputView extends outputWidget.OutputView {

    _createElement(tagName: string) {
        this.pWidget = new Panel();
        return this.pWidget.node;
    }

    _setElement(el: HTMLElement) {
        if (this.el || el !== this.pWidget.node) {
            // Boxes don't allow setting the element beyond the initial creation.
            throw new Error('Cannot reset the DOM element.');
        }

        this.el = this.pWidget.node;
        this.$el = $(this.pWidget.node);
     }

  /**
   * Called when view is rendered.
   */
  render() {
    this._outputView = new OutputArea({
      rendermime: this.model.widget_manager.rendermime,
      contentFactory: OutputArea.defaultContentFactory,
      model: this.model.outputs
    });
    // TODO: why is this a readonly property now?
    //this._outputView.model = this.model.outputs;
    // TODO: why is this on the model now?
    //this._outputView.trusted = true;
    this.pWidget.insertWidget(0, this._outputView);

    this.pWidget.addClass('jupyter-widgets');
    this.pWidget.addClass('widget-output');
    this.update(); // Set defaults.
  }

  /**
   * Update the contents of this view
   *
   * Called when the model is changed.  The model may have been
   * changed by another view or by a state update from the back-end.
   */
  update() {
    return super.update();
  }

  remove() {
    this._outputView.dispose();
    return super.remove();
  }

  model: OutputModel;
  _outputView: OutputArea;
  pWidget: Panel
}
