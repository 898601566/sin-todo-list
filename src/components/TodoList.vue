<script setup>

import { ref, computed, watch, nextTick } from 'vue'

const TODO_LIST_KEY = 'sin-todo'
const SLOGAN_KEY = 'sin-slogan'

let data = localStorage.getItem(TODO_LIST_KEY) || "[]"

const todoList = ref(JSON.parse(data))

const todoListFilter = {
  all: (todoList) => { return todoList },
  active: (todoList) => { return todoList.filter((todo) => { return !todo.completed }) },
  completed: (todoList) => { return todoList.filter((todo) => { return todo.completed }) },
  uncompleted: (todoList) => { return todoList.filter((todo) => { return !todo.completed }) },
}
const vFocus = {
  mounted: (el) => el.focus()
}
const newTodoTitle = ref('')
const checkEmpty = ref(false)
const slogan = ref(localStorage.getItem(SLOGAN_KEY) || "今日事今日毕，勿将今事待明日!.☕")
const tempSlogan = ref("")
const isEditingSlogan = ref(false)
const editingTodo = ref(null)

// 编辑标语
const editSlogan = async () => {
  tempSlogan.value = slogan.value;
  isEditingSlogan.value = true;
  return
}
// 取消编辑标语
const cancelSlogan = () => {
  isEditingSlogan.value = false;
  slogan.value = tempSlogan.value;
  return
}
// 保存标语
const saveSlogan = () => {
  isEditingSlogan.value = false;
  localStorage.setItem(SLOGAN_KEY, slogan.value)
  return
}

// 标记完成
const markAsCompleted = (todo) => {
  todo.completed = true
  return
}
// 标记未完成
const markAsUncompleted = (todo) => {
  todo.completed = false
  return
}
// 全部标记已完成
const markAllAsCompleted = () => {
  if (!confirm('确定全部标记为已完成？')) {
    return
  }
  todoList.value.forEach((todo) => {
    if (!todo.completed) {
      todo.completed = true
    }
    return
  })
  return
}

// 全部标记未完成
const markAllAsUncompleted = () => {
  // 弹出确认框，询问用户是否确定将所有任务标记为未完成
  if (!confirm('确定全部标记为未完成？')) {
    // 如果用户取消，则返回
    return
  }
  // 遍历任务列表
  todoList.value.forEach((todo) => {
    // 如果任务已完成，则将其标记为未完成
    if (todo.completed) {
      todo.completed = false
    }
    // 返回
    return
  })
  // 返回
  return
}
// 是否列表全部完成
const isAllCompleted = computed(() => {
  return todoList.value.every((todo) => {
    return todo.completed === true
  })
})

// 删除
const removeTodo = (todo) => {
  const index = todoList.value.indexOf(todo)
  if (index !== -1) {
    todoList.value.splice(index, 1)
  }
  return
}

// 添加
const addTodo = (e) => {
  if (newTodoTitle.value) {
    // e.target 指向元素可能是 button ,可能是 input
    const title = newTodoTitle.value.trim()
    if (title) {
      todoList.value.push({ id: Date.now(), title: title, completed: false })
      newTodoTitle.value = ''
      checkEmpty.value = false
    }
  } else {
    checkEmpty.value = true
  }
  return
}

// 编辑todo
const editTodo = (todo) => {
  editingTodo.value = { id: todo.id, title: todo.title, completed: todo.completed }
  return
}

// 取消编辑todo
const cancelTodo = (todo) => {
  todo.title = editingTodo.value.title;
  editingTodo.value = null
  return
}
// 保存todo
const saveTodo = (todo) => {
  if (todo.title.trim() === '') { // 如果为空，则删除
    removeTodo(todo)
  }
  editingTodo.value = null
  return
}

// 检测添加时,todo标题是否为空
const emptyChecked = () => {
  return !newTodoTitle.value.trim() && checkEmpty.value
}

// 监听todoList变化，保存到本地
watch(todoList.value, (newTodoList) => {
  console.log("保存")
  localStorage.setItem(TODO_LIST_KEY, JSON.stringify(newTodoList))
})

</script>

<template>
  <div class="container header ">
    <div class="todo-input">
      <h1 class="title">
        <img src="/img/todo.svg" alt="" class="title-1">
        <div class="ani-vector">
          <span></span>
          <span></span>
        </div>
        <div class="pendulums">
          <div class="pendulum">
            <div class="bar"></div>
            <div class="motion">
              <div class="string"></div>
              <div class="weight"></div>
            </div>
          </div>
          <div class="pendulum shadow">
            <div class="bar"></div>
            <div class="motion">
              <div class="string"></div>
              <div class="weight"></div>
            </div>
          </div>
        </div>
      </h1>
      <div class="add-content-wrapper">
        <input type="text" rows="3" class="add-content" placeholder="新增待办事项..." v-model="newTodoTitle"
          @keyup.enter="addTodo" :class='{ empty: emptyChecked }' />
        <transition name="tips">
          <div class="tips" v-if='emptyChecked()' style="color:red">💡请输入内容！</div>
        </transition>
        <button class="btn submit-btn" type="button" @click="addTodo">提交</button>
      </div>
    </div>
  </div>
  <div class="container main">
    <div class="todo-list-box">
      <!-- 全部完成和slogan -->
      <div class="bar-message">
        <!-- 全部标为完成 -->
        <input type="button" class="btn btn-label btn-allFinish" value="全部标为完成" @click="markAllAsCompleted"
          v-if="todoList.length && !isAllCompleted" />
        <!-- 全部标为未完成 -->
        <input type="button" class="btn btn-label btn-allFinish" value="全部标为未完成" @click="markAllAsUncompleted"
          v-else-if="todoList.length && isAllCompleted" />
        <!-- <template> -->
        <div>
          <div v-if="!isEditingSlogan" @dblclick="editSlogan" class="bar-message-text">
            {{ slogan }}
          </div>
          <div v-else>
            <input v-model="slogan" v-focus class="slogan-input" @keyup.enter="saveSlogan" @keyup.esc="cancelSlogan" />
            <div class="todo-btn btn-edit-submit slogan-btn" @click="saveSlogan"><img
                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAxOSAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE2LjUwODQgMTAuMzEwOUMxNy4yMzI0IDEwLjU4MjMgMTguMDM5NCAxMC4yMTU1IDE4LjMxMDkgOS40OTE1N0MxOC41ODIzIDguNzY3NiAxOC4yMTU1IDcuOTYwNjMgMTcuNDkxNiA3LjY4OTE0TDE2LjUwODQgMTAuMzEwOVpNOC45OTk5IDJMMTAuMTMyMSAxLjE3NjU1QzkuODU1OCAwLjc5NjYxOCA5LjQwNzM1IDAuNTgwNjA1IDguOTM4MDIgMC42MDEzNjhDOC40Njg3IDAuNjIyMTMgOC4wNDEwNyAwLjg3Njg5OSA3Ljc5OTM4IDEuMjc5NzRMOC45OTk5IDJaTTcuNjcxNzUgMTcuNTU3MkM3LjQyNzIyIDE4LjI5MDcgNy44MjM2MiAxOS4wODM2IDguNTU3MTMgMTkuMzI4MUM5LjI5MDY0IDE5LjU3MjcgMTAuMDgzNSAxOS4xNzYzIDEwLjMyOCAxOC40NDI4TDcuNjcxNzUgMTcuNTU3MlpNMS4wOTk2MyA3LjkyNzkzQzAuNTA3NTQxIDguNDI1MTkgMC40MzA2NjkgOS4zMDgyOCAwLjkyNzkzMSA5LjkwMDM3QzEuNDI1MTkgMTAuNDkyNSAyLjMwODI4IDEwLjU2OTMgMi45MDAzNyAxMC4wNzIxTDEuMDk5NjMgNy45Mjc5M1pNMTcuNDkxNiA3LjY4OTE0QzE1LjgwMjMgNy4wNTU2NSAxMy45ODQxIDUuNTAzNiAxMi41MDk5IDMuOTY3OTVDMTEuNzkzIDMuMjIxMjIgMTEuMTkzOSAyLjUxNzQgMTAuNzc0NCAyLjAwMDU2QzEwLjU2NTEgMS43NDI2OSAxMC40MDE3IDEuNTMyNzYgMTAuMjkxOSAxLjM4OTA4QzEwLjIzNyAxLjMxNzI3IDEwLjE5NTYgMS4yNjIxMSAxMC4xNjg2IDEuMjI1OUMxMC4xNTUxIDEuMjA3OCAxMC4xNDUzIDEuMTk0NDQgMTAuMTM5MSAxLjE4NjEyQzEwLjEzNjEgMS4xODE5NSAxMC4xMzQgMS4xNzkwNSAxMC4xMzI4IDEuMTc3NDRDMTAuMTMyMiAxLjE3NjY0IDEwLjEzMTggMS4xNzYxNiAxMC4xMzE3IDEuMTc2MDFDMTAuMTMxNyAxLjE3NTkzIDEwLjEzMTcgMS4xNzU5NCAxMC4xMzE3IDEuMTc2MDNDMTAuMTMxOCAxLjE3NjA3IDEwLjEzMTkgMS4xNzYyIDEwLjEzMTkgMS4xNzYyM0MxMC4xMzIgMS4xNzYzNyAxMC4xMzIxIDEuMTc2NTUgOC45OTk5IDJDNy44Njc2NyAyLjgyMzQ1IDcuODY3ODMgMi44MjM2NyA3Ljg2OCAyLjgyMzlDNy44NjgwOCAyLjgyNDAxIDcuODY4MjYgMi44MjQyNiA3Ljg2ODQyIDIuODI0NDdDNy44Njg3MiAyLjgyNDkgNy44NjkwOSAyLjgyNTQgNy44Njk1MyAyLjgyNTk5QzcuODcwMzkgMi44MjcxOCA3Ljg3MTUgMi44Mjg2OSA3Ljg3Mjg1IDIuODMwNTRDNy44NzU1NCAyLjgzNDIzIDcuODc5MjIgMi44MzkyNCA3Ljg4Mzg1IDIuODQ1NTNDNy44OTMxIDIuODU4MTEgNy45MDYxOSAyLjg3NTgyIDcuOTIyOTggMi44OTgzN0M3Ljk1NjU2IDIuOTQzNDUgOC4wMDQ5OSAzLjAwNzkyIDguMDY3MyAzLjA4OTQ0QzguMTkxODUgMy4yNTIzOSA4LjM3MjE3IDMuNDgzODcgOC42MDAzOCAzLjc2NTA2QzkuMDU1OTMgNC4zMjYzNSA5LjcwNjg1IDUuMDkxMjggMTAuNDkgNS45MDcwNUMxMi4wMTU4IDcuNDk2NCAxNC4xOTc3IDkuNDQ0MzUgMTYuNTA4NCAxMC4zMTA5TDE3LjQ5MTYgNy42ODkxNFpNNy42MTM5NyAyLjE5ODAxQzguMTA2NjkgNS42NDY2OSA4LjM0OTk3IDguODI5MjYgOC4zNDk5NyAxMS41QzguMzQ5OTcgMTQuMjAxNSA4LjEwMDE0IDE2LjI3MjIgNy42NzE3NSAxNy41NTcyTDEwLjMyOCAxOC40NDI4QzEwLjg5OTggMTYuNzI3OCAxMS4xNSAxNC4yOTg2IDExLjE1IDExLjVDMTEuMTUgOC42NzA3NiAxMC44OTMyIDUuMzUzMzEgMTAuMzg1OCAxLjgwMTk5TDcuNjEzOTcgMi4xOTgwMVpNMi45MDAzNyAxMC4wNzIxQzMuODgyMjggOS4yNDc0MiA1LjI5NjM2IDguMDkwMzMgNi42NDM3OSA2LjgzMDFDNy45NzY2NCA1LjU4MzUyIDkuMzQ1ODcgNC4xNDQ1OCAxMC4yMDA0IDIuNzIwMjZMNy43OTkzOCAxLjI3OTc0QzcuMTU0MDIgMi4zNTU0MiA2LjAyMzMxIDMuNTc2NjMgNC43MzExOCA0Ljc4NTEzQzMuNDUzNjQgNS45Nzk5OCAyLjExNzcyIDcuMDcyODkgMS4wOTk2MyA3LjkyNzkzTDIuOTAwMzcgMTAuMDcyMVoiIGZpbGw9IiMzMzMyMkUiLz4KPC9zdmc+Cg=="
                alt="Finish"></div>
          </div>
        </div>
        <!-- </template> -->
      </div>
      <!-- 首次使用(todoList为空)时的说明文档 -->
      <ul v-if="!todoList.length && showEmptyTips" class="empty-tips">
        <li> 添加你的第一个待办事项！📝</li>
        <li>食用方法💡：</li>
        <li>✔️ 所有提交操作支持Enter回车键提交</li>
        <li>✔️ 拖拽Todo上下移动可排序(仅支持PC)</li>
        <li>✔️ 双击上面的标语和 Todo 可进行编辑</li>
        <li>✔️ 右侧的小窗口是快捷操作哦</li>
        <li>🔒 所有的Todo数据存储在浏览器本地</li>
        <li>📝 支持下载和导入，导入追加到当前序列</li>
      </ul>
      <!-- 列表 -->
      <transition-group name="drag" class="todo-list" tag="ul" mode="in-out" :css="false" appear>
        <li v-for="todo in todoList" :key="todo.id" class='todo-item'>
          <div class="todo-content" :class='{ completed: todo.completed }' @dblclick="editTodo(todo)">
            {{ todo.title }}</div>
          <!-- 标记完成 -->
          <div class="todo-btn btn-finish" v-if="!todo.completed" @click="markAsCompleted(todo)">
          </div>
          <!-- 标为未完成 -->
          <div class="todo-btn btn-unfinish" v-if="todo.completed" @click="markAsUncompleted(todo)">
            <img
              src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAyNCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIuMzYzMTcgOS42NzUwNkMxLjU1OTM5IDkuNDc0NDkgMC43NDUyMDQgOS45NjM0OCAwLjU0NDYyOSAxMC43NjczQzAuMzQ0MDU0IDExLjU3MSAwLjgzMzA0NyAxMi4zODUyIDEuNjM2ODMgMTIuNTg1OEwyLjM2MzE3IDkuNjc1MDZaTTguMTU4NzMgMTZMNi43ODA0MSAxNi41OTE4QzcuMDMwOTggMTcuMTc1NCA3LjYyMTk1IDE3LjUzNzkgOC4yNTU3NSAxNy40OTY5QzguODg5NTQgMTcuNDU1OCA5LjQyODc3IDE3LjAyIDkuNjAxOTEgMTYuNDA4OUw4LjE1ODczIDE2Wk0yMi4zMjYxIDMuNDY0MTNDMjMuMTM0NyAzLjI4NDA2IDIzLjY0NDIgMi40ODI1NyAyMy40NjQxIDEuNjczOTVDMjMuMjg0MSAwLjg2NTMyOCAyMi40ODI2IDAuMzU1NzkxIDIxLjY3MzkgMC41MzU4NjZMMjIuMzI2MSAzLjQ2NDEzWk0xLjYzNjgzIDEyLjU4NThDMi4wMjc2NCAxMi42ODMzIDMuMTIyOTkgMTMuMTUxIDQuMjc3OCAxMy45NDI2QzUuNDM5ODggMTQuNzM5MyA2LjM4OTA2IDE1LjY4MDMgNi43ODA0MSAxNi41OTE4TDkuNTM3MDUgMTUuNDA4MkM4LjgxMDk0IDEzLjcxNzEgNy4zMDE1NyAxMi4zNzgzIDUuOTc0MDYgMTEuNDY4MkM0LjYzOTI3IDEwLjU1MzIgMy4yMTM5OSA5Ljg4NzM4IDIuMzYzMTcgOS42NzUwNkwxLjYzNjgzIDEyLjU4NThaTTkuNjAxOTEgMTYuNDA4OUMxMC4xMzU5IDE0LjUyNDQgMTEuNDk0OCAxMS42NTg1IDEzLjY3MjcgOS4wNjM5NUMxNS44NDQ1IDYuNDc2NzUgMTguNzQxNyA0LjI2MjM1IDIyLjMyNjEgMy40NjQxM0wyMS42NzM5IDAuNTM1ODY2QzE3LjI1ODMgMS41MTkyIDEzLjgyNzUgNC4yMTM0MiAxMS4zNzQ5IDcuMTM1MTRDOC45Mjg1MiAxMC4wNDk1IDcuMzY2NzQgMTMuMjkyOSA2LjcxNTU1IDE1LjU5MTFMOS42MDE5MSAxNi40MDg5WiIgZmlsbD0iIzMzMzIyRSIvPgo8L3N2Zz4K"
              alt="标为未完成" class="icon-finish">
          </div>
          <!-- 还原 -->
          <div v-if="todo.removed" class="todo-btn btn-restore" @click="restoreTodo(todo)">
            <img
              src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkiIGhlaWdodD0iMTkiIHZpZXdCb3g9IjAgMCAxOSAxOSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTcuMzQ3OTggMi42NTc5MkM3LjcxMTM0IDEuOTEzNDQgNy40MDIzOCAxLjAxNTM1IDYuNjU3OSAwLjY1MTk4OEM1LjkxMzQxIDAuMjg4NjI3IDUuMDE1MzIgMC41OTc1OSA0LjY1MTk2IDEuMzQyMDhMNy4zNDc5OCAyLjY1NzkyWk0xLjUyNiA5LjA4MzMzTDAuMzc1NTcxIDguMTIwNzhDMC4wNzc5NTE2IDguNDc2NDkgLTAuMDM4MzgyIDguOTQ5ODcgMC4wNjA0NjEyIDkuNDAzMDFDMC4xNTkzMDQgOS44NTYxNSAwLjQ2MjIwNiAxMC4yMzgxIDAuODgwOTI0IDEwLjQzNzVMMS41MjYgOS4wODMzM1pNMTQuNTcyNCAxNi41ODkzQzE0LjM0NTYgMTcuMzg2IDE0LjgwNzYgMTguMjE1OCAxNS42MDQ0IDE4LjQ0MjZDMTYuNDAxMiAxOC42Njk0IDE3LjIzMSAxOC4yMDczIDE3LjQ1NzggMTcuNDEwNkwxNC41NzI0IDE2LjU4OTNaTTYuMjUxOTIgMTQuMzMyMUM2LjcxMTQ1IDE1LjAyMTMgNy42NDI3NiAxNS4yMDc2IDguMzMyMDUgMTQuNzQ4MUM5LjAyMTM0IDE0LjI4ODUgOS4yMDc2IDEzLjM1NzIgOC43NDgwOCAxMi42Njc5TDYuMjUxOTIgMTQuMzMyMVpNNC42NTE5NiAxLjM0MjA4QzMuNjc2NiAzLjM0MDQ3IDIuNjAwMzMgNS4wNDUyNSAxLjc2NjU4IDYuMjUxMDhDMS4zNTA1OSA2Ljg1MjcyIDAuOTk3MjYzIDcuMzI2ODUgMC43NTAzODQgNy42NDc2MkMwLjYyNzAwNSA3LjgwNzkzIDAuNTMwMzkyIDcuOTI5NyAwLjQ2NjA0NyA4LjAwOTY5QzAuNDMzODggOC4wNDk2NyAwLjQwOTc5NiA4LjA3OTIgMC4zOTQ0ODIgOC4wOTc4NkMwLjM4NjgyNiA4LjEwNzE4IDAuMzgxMzY0IDguMTEzNzkgMC4zNzgxODMgOC4xMTc2M0MwLjM3NjU5MiA4LjExOTU1IDAuMzc1NTcyIDguMTIwNzcgMC4zNzUxMzMgOC4xMjEzQzAuMzc0OTE0IDguMTIxNTcgMC4zNzQ4NCA4LjEyMTY1IDAuMzc0OTEyIDguMTIxNTdDMC4zNzQ5NDggOC4xMjE1MiAwLjM3NTAyMSA4LjEyMTQ0IDAuMzc1MTMxIDguMTIxM0MwLjM3NTE4NiA4LjEyMTI0IDAuMzc1Mjk2IDguMTIxMTEgMC4zNzUzMjMgOC4xMjEwN0MwLjM3NTQ0MiA4LjEyMDkzIDAuMzc1NTcxIDguMTIwNzggMS41MjYgOS4wODMzM0MyLjY3NjQzIDEwLjA0NTkgMi42NzY1OCAxMC4wNDU3IDIuNjc2NzMgMTAuMDQ1NUMyLjY3NjggMTAuMDQ1NCAyLjY3Njk2IDEwLjA0NTIgMi42NzcwOSAxMC4wNDUxQzIuNjc3MzUgMTAuMDQ0OCAyLjY3NzY1IDEwLjA0NDQgMi42Nzc5OCAxMC4wNDRDMi42Nzg2NSAxMC4wNDMyIDIuNjc5NDYgMTAuMDQyMyAyLjY4MDQyIDEwLjA0MTFDMi42ODIzNCAxMC4wMzg4IDIuNjg0ODYgMTAuMDM1OCAyLjY4Nzk0IDEwLjAzMkMyLjY5NDEyIDEwLjAyNDYgMi43MDI2MSAxMC4wMTQzIDIuNzEzMzMgMTAuMDAxM0MyLjczNDc1IDkuOTc1MTYgMi43NjUwOCA5LjkzNzk1IDIuODAzNjIgOS44OTAwNUMyLjg4MDY3IDkuNzk0MjYgMi45OTA2IDkuNjU1NjEgMy4xMjc3OCA5LjQ3NzM4QzMuNDAyMDEgOS4xMjEwNiAzLjc4NTg3IDguNjA1NjIgNC4yMzQxNyA3Ljk1NzI1QzUuMTI5IDYuNjYzMDggNi4yODk3MiA0LjgyNjIgNy4zNDc5OCAyLjY1NzkyTDQuNjUxOTYgMS4zNDIwOFpNMi4wNDcwNCAxMC40ODk5QzMuNzc2MTcgOS44NDk0MiA1LjczMzE5IDkuMTcyMzEgNy42MzggOC43MjEzN0M5LjU3MDA4IDguMjYzOTkgMTEuMzAyNSA4LjA3NjMxIDEyLjYyODggOC4zMDE3QzEzLjg3NTIgOC41MTM1MiAxNC42Mjg0IDkuMDUwMDggMTUuMDE2MyAxMC4wNDA1QzE1LjQ2MjggMTEuMTgwNyAxNS41MzgzIDEzLjE5NTYgMTQuNTcyNCAxNi41ODkzTDE3LjQ1NzggMTcuNDEwNkMxOC40ODQzIDEzLjgwNDIgMTguNjE2NiAxMS4wMDY3IDE3LjgwOTcgOC45NDY0NkMxNi45NDQyIDYuNzM2MzQgMTUuMTMzNyA1LjY4NDM3IDEzLjEzMTQgNS4zNDQxMUMxMS4yMDkyIDUuMDE3NDMgOS4wMDc5OSA1LjMxNDEzIDYuOTQ2OSA1LjgwMjA2QzQuODU4NTYgNi4yOTY0NCAyLjc2MjgzIDcuMDI1NTggMS4wMDQ5NiA3LjY3NjczTDIuMDQ3MDQgMTAuNDg5OVpNOC43NDgwOCAxMi42Njc5QzcuNTIzMTIgMTAuODMwNSA1LjIyOTM0IDkuMTg1OTMgMi4xNzEwOCA3LjcyOTEzTDAuODgwOTI0IDEwLjQzNzVDMy43NzA2NiAxMS44MTQxIDUuNDc2ODggMTMuMTY5NSA2LjI1MTkyIDE0LjMzMjFMOC43NDgwOCAxMi42Njc5WiIgZmlsbD0iIzMzMzIyRSIvPgo8L3N2Zz4K"
              alt="还原">
          </div>
          <!-- 删除 -->
          <div class="todo-btn btn-delete" v-else="todo.removed" @click="removeTodo(todo)">
            <img
              src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNS4wOTkzIDE3Ljc1OTdDMTUuNzk0OSAxOC4yMDk4IDE2LjcyMzUgMTguMDEwOCAxNy4xNzM2IDE3LjMxNTJDMTcuNjIzNiAxNi42MTk3IDE3LjQyNDYgMTUuNjkxMSAxNi43MjkxIDE1LjI0MUMxMy4zMDc5IDEzLjAyNzMgMTAuODIwOSAxMC45OTU5IDguOTIyNTEgOS4wMzczOUM5LjA5NzQyIDguODQ5ODIgOS4yNzI5MSA4LjY2NTcxIDkuNDQ4ODggOC40ODUzNEMxMS44ODY0IDUuOTg2OTIgMTQuMjQ3MiA0LjM4MDY2IDE2LjI5NDQgMy45NzEyMkMxNy4xMDY3IDMuODA4NzUgMTcuNjMzNSAzLjAxODUyIDE3LjQ3MTEgMi4yMDYxOEMxNy4zMDg2IDEuMzkzODQgMTYuNTE4NCAwLjg2NzAxMyAxNS43MDYgMS4wMjk0OEMxMi43NTMyIDEuNjIwMDUgOS44NjQwNiAzLjc2Mzc5IDcuMzAxNTQgNi4zOTAzN0M3LjE4MTUxIDYuNTEzNCA3LjA2MTgxIDYuNjM3ODkgNi45NDI0OSA2Ljc2Mzc1QzUuNDIwMDEgNC44MDQzMyA0LjM3MDU4IDIuODc2MzIgMy40MjU5MSAwLjg2MzE2NEMzLjA3Mzk5IDAuMTEzMjAyIDIuMTgwNzMgLTAuMjA5NDc1IDEuNDMwNzcgMC4xNDI0NDVDMC42ODA4MDkgMC40OTQzNjUgMC4zNTgxMzIgMS4zODc2MiAwLjcxMDA1MSAyLjEzNzU4QzEuODIwODggNC41MDQ4MSAzLjA3ODk5IDYuNzY1MTEgNC45MjkzMiA5LjA1MzA2QzMuMjIyMDYgMTEuMTM0MSAxLjYyNjY5IDEzLjQzMjggMC4yMjI3MjMgMTUuNzE0MkMtMC4yMTE0NTMgMTYuNDE5NyAwLjAwODUyNzUyIDE3LjM0MzcgMC43MTQwNjQgMTcuNzc3OEMxLjQxOTYgMTguMjEyIDIuMzQzNTIgMTcuOTkyIDIuNzc3NyAxNy4yODY1QzQuMDQ4MTkgMTUuMjIyIDUuNDY0MDUgMTMuMTcyNiA2Ljk1NTU5IDExLjMxNjhDOC45ODUgMTMuMzc2NSAxMS41OTU5IDE1LjQ5MjggMTUuMDk5MyAxNy43NTk3WiIgZmlsbD0iIzMzMzIyRSIvPgo8L3N2Zz4K"
              alt="删除">
          </div>
          <!-- 编辑 -->
          <div class="edit-todo-wrapper" v-if="editingTodo !== null && editingTodo.id === todo.id">
            <input type="text" class="edit-todo" value="编辑 Todo..."
              v-if="editingTodo !== null && editingTodo.id === todo.id" v-model="todo.title" v-focus
              @keyup.enter="saveTodo(todo)" @keyup.esc="cancelTodo(todo)" />
            <div class="todo-btn btn-edit-submit" @click="saveTodo(todo)">
              <img
                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAxOSAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE2LjUwODQgMTAuMzEwOUMxNy4yMzI0IDEwLjU4MjMgMTguMDM5NCAxMC4yMTU1IDE4LjMxMDkgOS40OTE1N0MxOC41ODIzIDguNzY3NiAxOC4yMTU1IDcuOTYwNjMgMTcuNDkxNiA3LjY4OTE0TDE2LjUwODQgMTAuMzEwOVpNOC45OTk5IDJMMTAuMTMyMSAxLjE3NjU1QzkuODU1OCAwLjc5NjYxOCA5LjQwNzM1IDAuNTgwNjA1IDguOTM4MDIgMC42MDEzNjhDOC40Njg3IDAuNjIyMTMgOC4wNDEwNyAwLjg3Njg5OSA3Ljc5OTM4IDEuMjc5NzRMOC45OTk5IDJaTTcuNjcxNzUgMTcuNTU3MkM3LjQyNzIyIDE4LjI5MDcgNy44MjM2MiAxOS4wODM2IDguNTU3MTMgMTkuMzI4MUM5LjI5MDY0IDE5LjU3MjcgMTAuMDgzNSAxOS4xNzYzIDEwLjMyOCAxOC40NDI4TDcuNjcxNzUgMTcuNTU3MlpNMS4wOTk2MyA3LjkyNzkzQzAuNTA3NTQxIDguNDI1MTkgMC40MzA2NjkgOS4zMDgyOCAwLjkyNzkzMSA5LjkwMDM3QzEuNDI1MTkgMTAuNDkyNSAyLjMwODI4IDEwLjU2OTMgMi45MDAzNyAxMC4wNzIxTDEuMDk5NjMgNy45Mjc5M1pNMTcuNDkxNiA3LjY4OTE0QzE1LjgwMjMgNy4wNTU2NSAxMy45ODQxIDUuNTAzNiAxMi41MDk5IDMuOTY3OTVDMTEuNzkzIDMuMjIxMjIgMTEuMTkzOSAyLjUxNzQgMTAuNzc0NCAyLjAwMDU2QzEwLjU2NTEgMS43NDI2OSAxMC40MDE3IDEuNTMyNzYgMTAuMjkxOSAxLjM4OTA4QzEwLjIzNyAxLjMxNzI3IDEwLjE5NTYgMS4yNjIxMSAxMC4xNjg2IDEuMjI1OUMxMC4xNTUxIDEuMjA3OCAxMC4xNDUzIDEuMTk0NDQgMTAuMTM5MSAxLjE4NjEyQzEwLjEzNjEgMS4xODE5NSAxMC4xMzQgMS4xNzkwNSAxMC4xMzI4IDEuMTc3NDRDMTAuMTMyMiAxLjE3NjY0IDEwLjEzMTggMS4xNzYxNiAxMC4xMzE3IDEuMTc2MDFDMTAuMTMxNyAxLjE3NTkzIDEwLjEzMTcgMS4xNzU5NCAxMC4xMzE3IDEuMTc2MDNDMTAuMTMxOCAxLjE3NjA3IDEwLjEzMTkgMS4xNzYyIDEwLjEzMTkgMS4xNzYyM0MxMC4xMzIgMS4xNzYzNyAxMC4xMzIxIDEuMTc2NTUgOC45OTk5IDJDNy44Njc2NyAyLjgyMzQ1IDcuODY3ODMgMi44MjM2NyA3Ljg2OCAyLjgyMzlDNy44NjgwOCAyLjgyNDAxIDcuODY4MjYgMi44MjQyNiA3Ljg2ODQyIDIuODI0NDdDNy44Njg3MiAyLjgyNDkgNy44NjkwOSAyLjgyNTQgNy44Njk1MyAyLjgyNTk5QzcuODcwMzkgMi44MjcxOCA3Ljg3MTUgMi44Mjg2OSA3Ljg3Mjg1IDIuODMwNTRDNy44NzU1NCAyLjgzNDIzIDcuODc5MjIgMi44MzkyNCA3Ljg4Mzg1IDIuODQ1NTNDNy44OTMxIDIuODU4MTEgNy45MDYxOSAyLjg3NTgyIDcuOTIyOTggMi44OTgzN0M3Ljk1NjU2IDIuOTQzNDUgOC4wMDQ5OSAzLjAwNzkyIDguMDY3MyAzLjA4OTQ0QzguMTkxODUgMy4yNTIzOSA4LjM3MjE3IDMuNDgzODcgOC42MDAzOCAzLjc2NTA2QzkuMDU1OTMgNC4zMjYzNSA5LjcwNjg1IDUuMDkxMjggMTAuNDkgNS45MDcwNUMxMi4wMTU4IDcuNDk2NCAxNC4xOTc3IDkuNDQ0MzUgMTYuNTA4NCAxMC4zMTA5TDE3LjQ5MTYgNy42ODkxNFpNNy42MTM5NyAyLjE5ODAxQzguMTA2NjkgNS42NDY2OSA4LjM0OTk3IDguODI5MjYgOC4zNDk5NyAxMS41QzguMzQ5OTcgMTQuMjAxNSA4LjEwMDE0IDE2LjI3MjIgNy42NzE3NSAxNy41NTcyTDEwLjMyOCAxOC40NDI4QzEwLjg5OTggMTYuNzI3OCAxMS4xNSAxNC4yOTg2IDExLjE1IDExLjVDMTEuMTUgOC42NzA3NiAxMC44OTMyIDUuMzUzMzEgMTAuMzg1OCAxLjgwMTk5TDcuNjEzOTcgMi4xOTgwMVpNMi45MDAzNyAxMC4wNzIxQzMuODgyMjggOS4yNDc0MiA1LjI5NjM2IDguMDkwMzMgNi42NDM3OSA2LjgzMDFDNy45NzY2NCA1LjU4MzUyIDkuMzQ1ODcgNC4xNDQ1OCAxMC4yMDA0IDIuNzIwMjZMNy43OTkzOCAxLjI3OTc0QzcuMTU0MDIgMi4zNTU0MiA2LjAyMzMxIDMuNTc2NjMgNC43MzExOCA0Ljc4NTEzQzMuNDUzNjQgNS45Nzk5OCAyLjExNzcyIDcuMDcyODkgMS4wOTk2MyA3LjkyNzkzTDIuOTAwMzcgMTAuMDcyMVoiIGZpbGw9IiMzMzMyMkUiLz4KPC9zdmc+Cg=="
                alt="提交">
            </div>
          </div>
        </li>
      </transition-group>
      <div class="bar-message bar-bottom">
        <div class="bar-message-text">
          <span v-if="todoListFilter.uncompleted(todoList).length > 0">剩余 {{ todoListFilter.uncompleted(
            todoList).length }} 项未完成</span>
          <span v-else>全部完成, 继续加油!</span>
        </div>
      </div>
    </div>
  </div>
</template>
