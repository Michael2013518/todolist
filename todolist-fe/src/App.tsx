import { gql, useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import dayjs from 'dayjs'
import './App.css'
const getTodoList = gql`
  query Query {
  todoList {
  id
  content,
  createTime,
  updateTime
  }
  }
`
const createTodoItem = gql` 
  mutation Mutation($todoItem: CreateTodoItemInput!) {
  addTodoItem(todoItem: $todoItem) {
    id
    content
    createTime
  }
}
`
const updateTodoItem = gql`
  mutation Mutation($todoItem: UpdateTodoItemInput!) {
  updateTodoItem(todoItem: $todoItem) {
    id
    content
  }
}
`
const deleteTodoItem = gql`
mutation Mutation($id: Int!) {
  deleteTodoItem(id: $id) {
    id
    content
  }
}
`
type TodoItem = {
  id: number,
  content: string,
  createTime: string,
}
type TodoList = {
  todoList: TodoItem[]
}
function App() {
  // const [todoList, setTodoList] = useState<TodoList>()
  const { data } = useQuery<TodoList>(getTodoList)
  const [content, setContent] = useState('')
  const [editContent, setEditContent] = useState('')
  const [todoId, setTodoId] = useState(-1)
  const [isEditing, setIsEditing] = useState(false);
  const [deleteTodoIds, setDeleteTodoIds] = useState<number[]>([])
  const [createTodo] = useMutation(createTodoItem, {
    refetchQueries: [getTodoList]
  })
  const [updateTodo] = useMutation(updateTodoItem, {
    refetchQueries: [getTodoList]
  })
  const [deleteTodo] = useMutation(deleteTodoItem, {
    refetchQueries: [getTodoList]
  })
  async function addTodo() {
    const todoItem = {
      content: content
    }
    await createTodo({ variables: { todoItem } })
    setContent('')
  }
  async function updateTodoItems() {
    const todoItem = {
      id: todoId,
      content: editContent
    }
    await updateTodo({ variables: { todoItem } }) // 添加更新待办事项的逻辑
    setIsEditing(false) // 结束编辑状态
  }

  async function deleteAllTodoItems() {
    if (deleteTodoIds.length === 0) return
    deleteTodoIds.forEach(async (todoId) => {
      await deleteTodo({ variables: { id: todoId } })
    })
    setDeleteTodoIds([])
  }
  return (
    <>
      <h1 className='text-2xl mb-4 text-left underline -underline-offset-8 decoration-2 decoration-wavy decoration-blue-500'>TodoList - Graphql + React Hooks + Prisma</h1>
      <div className='flex flex-row justify-between items-center mb-4'>
        <input
          type='text'
          className='w-1/2'
          placeholder='请输入待办事项'
          name='todo' value={content}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && content.length) {
              addTodo()
            }
          }
          }
          onChange={(e) => {
            setContent(e.target.value)
          }} />
        <button
          onClick={() => addTodo()}
          className='primary'
        >
          添加待办
        </button>
        <button
          onClick={() => deleteAllTodoItems()}
        >
          删除待办
        </button>
      </div>
      <ul>
        {
          data?.todoList?.map((item: TodoItem) => {
            return <li key={item.id} className='text-left'>
              <div className='flex flex-row justify-between items-center'>
                <div className='flex flex-row items-start w-auto min-w-80'>
                  <input type='checkbox' id={item.id + ''} name={item.content} className='mr-2 mt-1' onChange={(e) => {
                    if (e.target.checked) {
                      deleteTodoIds.push(item.id);
                    } else {
                      setDeleteTodoIds(deleteTodoIds.filter((id) => id !== item.id));
                    }
                  }
                  } />
                  <span title={item.content}
                    className='text-gray-600 inline-block w-4/5 overflow-hidden text-ellipsis cursor-pointer'
                    onDoubleClick={(e) => {
                      e.preventDefault()
                      setTodoId(item.id)
                      setEditContent(item.content)
                      setIsEditing(true)
                    }}
                  >
                    {isEditing && todoId === item.id ?
                      <input
                        type='text'
                        value={editContent} // 直接使用 item.content
                        onChange={(e) => setEditContent(e.target.value)}
                        onBlur={() => {
                          setIsEditing(false)
                          updateTodoItems()
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setIsEditing(false)
                            updateTodoItems()
                          }
                        }}
                      />
                      : item.content}
                  </span>
                </div>
                <div className="date text-gray-400 flex items-start"><i className='inline-block mr-2'>{dayjs(+item.createTime).format('YYYY-MM-DD HH:mm')}</i></div>
              </div>

            </li>
          })
        }
      </ul>
    </>
  )
}

export default App
