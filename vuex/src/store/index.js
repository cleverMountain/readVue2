import Vue from "vue"
import Vuex from "../vuex/index"
// import Vuex from "vuex"

// Vuex是一个对象，当调用use方法时会调用该方法上的install方法
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    age: 1
  },
  getters: {
    age(state) {
      return state.age + 2
    }
  },
  // 唯一修改状态的地方
  mutations: {
    add(state, payload) {

      state.age += payload
    }
  },
  actions: {
    add({ commit }, payload) {

      setTimeout(() => {
        commit.call(this, 'add', payload)
      }, 1000)
    }
  },
  modules: {
    a: {
      namespaced: true,
      state: {
        age: 11
      },
      // getters: {
      //   age(state) {
      //     return state.age + 1
      //   }
      // },
      // 唯一修改状态的地方
      mutations: {
        add(state, payload) {

          state.age += payload
        }
      },
      actions: {
        add({ commit }, payload) {
          setTimeout(() => {
            commit('add', payload)
          }, 1000)
        }
      },
      modules: {
        b: {
          namespaced: true,
          state: {
            age: 12
          },
          // getters: {
          //   age(state) {
          //     return state.age + 1
          //   }
          // },
          // 唯一修改状态的地方
          mutations: {
            add(state, payload) {

              state.age += payload
            }
          },
          actions: {
            add({ commit }, payload) {
              setTimeout(() => {
                commit('add', payload)
              }, 1000)
            }
          }
        }
      }
    }
  }
})