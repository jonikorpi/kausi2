import RemoteStorage from "remotestoragejs";

const model = {
  name: "kausi",
  builder: privateClient => {
    return {
      exports: {
        update: entry => {
          return privateClient
            .storeFile("text/plain", entry.path, entry.value)
            .then(() => entry);
        },
        remove: entry => {
          return privateClient.remove(entry.path);
        },
        client: privateClient,
      },
    };
  },
};

const database = new RemoteStorage({
  // logging: true,
  modules: [model],
  changeEvents: {
    local: true,
    window: true,
    remote: true,
    conflict: true,
  },
});

database.setApiKeys({
  dropbox: "0cnw57tenmut8av",
  googledrive:
    "550466432289-m3h005moio5hhgpi18no6npnublfsrp2.apps.googleusercontent.com",
});

database.access.claim("kausi", "rw");
const storage = database.kausi;

database.on("ready", async () => {
  storage.client.on("change", event => {
    if (event.origin === "conflict") {
      console.log(event);
    }
  });
});

export { database, storage };
