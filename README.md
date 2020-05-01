<big><h1 align="center">Fully Typed Vuex store for VueJs</h1></big>

<h1 align="center">
  <a href="https://www.npmjs.com/package/vuex-typed-store">
   vuex-typed-store
  </a>
</h1>

This package provides a method to make your [`vuex`](https://github.com/vuejs/vuex) store fully typed.

## Classic vuex declaration:

When you use vuex usually you declare a scope, some mutations, actions and getter. 

```javascript
import Vue from 'vue'
import Vuex from 'vuex'

...

const vuestore = new Vuex.Store({
  strict: false,
  state:{...},
  mutations:{...}, 
  actions:{...}, 
  getters:{...}
})

...

new Vue({
  vuestore,
  render: h => h(App)
}).$mount('#app'))

```

When you use the store in the application you refer to store using $store accessor. 

```javascript

let myvalue = this.$store.state.myvalue;
let mygetter = this.$store.getters.mygetter;

...

```

If you have a very large store and you are using typescript the classic store will not suggest you the store structure becouse the typing resolution structure of your ide does know nothing about $store typing. 





## Typed store decaration :


To make a store fully typed you have to instruct "something" about your objects structure. In this case we have to create 3 interfaces to do this 

and then we can create a typed store. 

```javascript
import Vue from 'vue'
import Vuex from 'vuex'
import { CreateTypedStoreProxy } from 'vuex-typed';

...

const vuestore = new Vuex.Store({
  strict: false,
  state:{
    myvalue: "", 
    myarray:[]
  },
  mutations:{...}, 
  actions:{
    changeValue(context, newvalue){ ... }, 
    changeArray(context, newarray){ ... }
  }, 
  getters:{
    getValue: (state) => () => state.myvalue,
    getAllArray: (state) => () => state.myarray,
    findInArray: (state) => (id) => state.find(i => i.id == id)
  }
})

interface IStoreState{
  myvalue:string;
  myarray: {id: string}[]
}

interface IStoreGetters{
  getValue(): state.myvalue;
  getAllArray(): state.myarray;
  findInArray(id) : { id:string};
}

interface IStoreActions{
  changeValue(newvalue: string);
  changeArray(newarray: {id:string}[]);
}


// this is the typed store
export const store = CreateTypedStoreProxy<StoreModels, StoreActions, StoreGetters>(vuestore);

...

new Vue({
  vuestore,
  render: h => h(App)
}).$mount('#app'))

```

---

## How to use it

The createTypedStoreProxy will create a fully typed proxy to access your store. 

You will not need to use $store anymore, the $store reference is automatically managed by the proxy. 

To access your store simply you can use the original syntax but referecing the new **store** variable and not the original one. 



## Differences in interface declaration

You will notice a difference between store getter declaration and interface declarations. 

Actions and Getters need a context reference and a state reference to work. The proxy will do this for you. 

so in the getter you have to declare state accessor and then provide a funtion to access your data but in the interface the *state* is not needed:

### for getters
```javascript 
{
  ...
  getters:{
    getValue: (state) => () => state.myvalue,
    getAllArray: (state) => () => state.myarray,
    findInArray: (state) => (id) => state.find(i => i.id == id)
  }
 ...
}

interface IStoreActions{
  changeValue(newvalue: string);
  changeArray(newarray: {id:string}[]);
}

```


### for actions
```javascript 
{
  ...
  actions:{
    changeValue(context, newvalue){ ... }, 
    changeArray(context, newarray){ ... }
  }
  ...
}

interface IStoreGetters{
  getValue(): state.myvalue;
  getAllArray(): state.myarray;
  findInArray(id) : { id:string};
}

```





