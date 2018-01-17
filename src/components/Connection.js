import React from "react";
import RemoteStorage from "remotestoragejs";

export default class Connection extends React.Component {
  componentWillMount() {
    this.remoteStorage = new RemoteStorage({
      // logging: process.env.NODE_ENV === "development",
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
                    .storeObject("entry", entry.path, entry)
                    .then(entry => entry),
                subscribe: (path, callback) => {
                  privateClient.on("change", callback);
                  privateClient.getObject(path);
                },
                unsubscribe: (path, callback) => {
                  privateClient.off("change", callback);
                },
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
  }

  render() {
    return this.props.children(this.remoteStorage, this.remoteStorage.kausi);
  }
}
