import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/Login'
import Layout from '@/pages/Layout'
import Index from '@/pages/Index'
import Menu from '@/pages/Menu'
import role from '@/pages/second/role'
import user from '@/pages/second/user'
import category from '@/pages/second/category'
import specs from '@/pages/second/specs'
import goods from '@/pages/second/goods'
import member from '@/pages/second/member'
import banner from '@/pages/second/banner'
import seckill from '@/pages/second/seckill'

Vue.use(Router)
let router = new Router({
    routes: [{
        path: '/login',
        component: Login
    }, {
        path: '/',
        component: Layout,
        children: [{
            path: 'index',
            component: Index
        }, {
            path: 'menu',
            component: Menu
        }, {
            path: 'role',
            component: role
        }, {
            path: 'user',
            component: user
        }, {
            path: 'category',
            component: category
        }, {
            path: 'specs',
            component: specs
        }, {
            path: 'goods',
            component: goods
        }, {
            path: 'member',
            component: member
        }, {
            path: 'banner',
            component: banner
        }, {
            path: 'seckill',
            component: seckill
        }, {
            path: '*',
            redirect: '/index'
        },]
    }]
})
router.beforeEach((to, from, next) => {//权限控制
    let islogin = JSON.parse(sessionStorage.getItem('user'));
    if (islogin) {
        if (to.path == '/login') {
            next('/home')
        } else if (to.path == '/' || to.path == '/index') {
            next()
        } else { //判断用户的访问权限
            let flag = islogin.menus_url.some(item => item == to.path);
            // 具有访问权限
            if (flag) {
                next()
            } else {
                // 不具有访问权限
                next(false)
            }
        }

    } else {
        if (to.path == '/login') {
            next()
        } else {
            next('/login')
        }
    }
})
export default router