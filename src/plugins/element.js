import Vue from 'vue'
import { Button,
         Table,
        Message,
        MessageBox,
        


} from 'element-ui'

//将信息挂载在vue
Vue.prototype.$message = Message

Vue.prototype.$msgbox = MessageBox;
Vue.use(Button)
Vue.use(Table)


