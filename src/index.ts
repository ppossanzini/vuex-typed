
export function CreateTypedStoreProxy<TStoreModel, TStoreActions, TStoreGetters>(store: any, prefix: any = null) {

  return {
    // _store: store,
    state: store.state as TStoreModel,
    actions: createActionProxy(store, prefix) as TStoreActions,
    getters: createGetterProxy(store, prefix) as TStoreGetters,
  }
}


function createActionProxy(obj: any, parentPath: any = null) {
  return new Proxy(obj, {
    get(target: any, key: string) {
      let methodpath = parentPath ? `${parentPath}/${key}` : key;

      if (target._actions[methodpath]) return (...args) => target.dispatch(methodpath, ...args);
      return createActionProxy(obj, methodpath);
    }
  })
}

function createGetterProxy(obj: any, parentPath: any = null) {
  return new Proxy(obj, {
    get(target: any, key: string) {
      let methodpath = parentPath ? `${parentPath}/${key}` : key;
      if (target.getters[methodpath]) return (...args) => target.getters[methodpath](...args);
      return createGetterProxy(obj, methodpath);
    }
  })
}