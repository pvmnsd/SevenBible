export default (id, store, getBibleModuleInfo) => {

  const changeBibleModuleDBConnection = async (bookFileName, oldBookFileName) => {
    const settings = {
      bookFileName,
      oldBookFileName,
      activeBibleModules: store.getters.getActiveWorkPlaces().fileNames
    };
    await window.electron.invoke("change-db-connection", settings)
    getBibleModuleInfo(bookFileName);
  }

  return {
    changeBibleModuleDBConnection
  }
}
