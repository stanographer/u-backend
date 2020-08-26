import React, { Component, Fragment } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';

const sharedb = require('sharedb/lib/client');
const richText = require('rich-text');

export default class Textarea extends Component {
  constructor(props) {
    super(props);

    if (typeof window !== 'undefined') {
      this.quill = require('react-quill');
    }

    this.state = { editorHtml: '', theme: 'snow' };
    this.handleChange = this.handleChange.bind(this);
    this.doc = {};
  }

  // componentDidMount() {
  //   const collection = 'examples';
  //   const id = 'richtext';
  //   // const presenceId = new ObjectID().toString();
    
  //   // Start up a ShareDB connection.
  //   sharedb.types.register(richText.type);
  //   const socket = new ReconnectingWebSocket('ws://' + 'localhost:9999');
  //   const connection = new sharedb.Connection(socket);
 
  //   this.doc = connection.get(collection, id);

  //   // this.doc.create({}, 'ot-rich-text', err => {
  //   //   if (err) throw err;
  //   // });

  //   this.doc.subscribe(err => {
  //     if (err) throw err;
  //   })

  // }

  handleChange(html) {
    this.setState({ editorHtml: html });
    this.doc.submitOp(html);
  }

  handleThemeChange(newTheme) {
    if (newTheme === 'core') newTheme = null;
    this.setState({ theme: newTheme });
  }

  render() {
    const Quill = this.quill;
    const collection = 'examples';
    const id = 'richtext';
    // const presenceId = new ObjectID().toString();
    
    // Start up a ShareDB connection.
    sharedb.types.register(richText.type);
    const socket = new ReconnectingWebSocket('ws://localhost:9999');
    const connection = new sharedb.Connection(socket);
 
    this.doc = connection.get(collection, id);

    // this.doc.create({}, 'ot-rich-text', err => {
    //   if (err) throw err;
    // });

    this.doc.subscribe(err => {
      if (err) throw err;
    })

    console.log(this.doc);

    if (Quill) {
      return (
        <Fragment>
          <Quill
            theme={this.state.theme}
            onChange={this.handleChange}
            value={this.state.editorHtml}
          />
          <div className="themeSwitcher">
          <label>Theme </label>
          <select onChange={(e) => this.handleThemeChange(e.target.value)}>
            <option value="snow">Snow</option>
            <option value="bubble">Bubble</option>
            <option value="core">Core</option>
          </select>
        </div>
        </Fragment>
      );
    } else {
      return null;
    }

    
  }
}
