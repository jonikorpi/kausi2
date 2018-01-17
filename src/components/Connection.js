import React from "react";
import RemoteStorage from "remotestoragejs";

export default class Connection extends React.Component {
  componentWillMount() {
    this.remoteStorage = new RemoteStorage({
      logging: process.env.NODE_ENV === "development",
      modules: [
        {
          name: "kausi",
          builder: (privateClient, publicClient) => {
            privateClient.declareType("entry", {
              type: "object",
              properties: {
                path: {
                  type: "string",
                },
                content: {
                  type: "string",
                },
                lastEdited: {
                  type: "number",
                },
              },
              required: ["path", "lastEdited"],
            });

            return {
              exports: {
                updateEntry: entry =>
                  privateClient
                    .storeObject("entry", entry.path + ".json", entry)
                    .then(entry => entry),
                getEntry: path =>
                  privateClient.getObject(path + ".json").then(entry => entry),
              },
            };
          },
        },
      ],
    });

    this.remoteStorage.access.claim("kausi", "rw");

    this.remoteStorage.setApiKeys({
      dropbox: "0cnw57tenmut8av",
      // googledrive: 'your-client-id'
    });

    this.remoteStorage.kausi
      .updateEntry({
        path: "2017/lol",
        content: "ugh",
        lastEdited: Date.now(),
      })
      .then(entry => console.log(entry));
  }

  render() {
    return this.props.children(this.remoteStorage);
  }
}
