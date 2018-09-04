import React, { PureComponent } from "react";
import debounce from "lodash.debounce";

import { database, storage } from "../utilities/remotestorage.js";

const findHashtag = (word, hashtag) => word.startsWith(hashtag);
const findHashtags = word =>
  findHashtag(word, "#daily") ||
  findHashtag(word, "#weekly") ||
  findHashtag(word, "#monthly") ||
  findHashtag(word, "#yearly");

class Data extends PureComponent {
  state = { value: "", ready: false };

  componentDidMount() {
    const { path } = this.props;

    database.on("ready", () => {
      storage.client.on("change", event => {
        if (event.relativePath === path) {
          this.handleEvent(event);
        }
      });

      this.setState({ ready: true }, () => storage.client.getFile(path));
    });
  }

  handleEvent = event => {
    const { newValue } = event;
    this.setState({ value: newValue });
  };

  commitUpdateStorage = value => {
    const lines = value.split(/\r?\n/g);
    const linesWithHashtags = lines.filter(
      line => line.split(" ").filter(findHashtags).length > 0
    );
    const normalLines = lines.filter(
      line => !line.split(" ").filter(findHashtags).length > 0
    );

    console.log(linesWithHashtags, normalLines);

    if (normalLines) {
      storage.update({ path: this.props.path, value: normalLines.join("\n") });
    } else {
      storage.remove({ path: this.props.path });
    }
  };
  updateStorage = debounce(this.commitUpdateStorage, 1000);

  update = event => {
    if (this.state.ready) {
      const value = event.nativeEvent.target.value;
      this.setState({ value: value });
      this.updateStorage(value);
    }
  };

  render() {
    return this.props.children(this.state.value, this.update);
  }
}

export default Data;
