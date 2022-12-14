import MyTable from './myTable/MyTable.vue'

const components = {
    MyTable
}

export {
    MyTable
}

export default {
    install (app) {
        for (let c in components) {
            app.component(c, components[c])
        }
    }
}