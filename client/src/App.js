import React, { useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  // user data from api
  const [ dataToRender, setDataToRender] = useState([])
  
  const [ userFormValues, setUserFormValues ] = useState({
    id: '',
    name: ''
  })

  const [ postFormValues, setPostFormValues ] = useState({
    id: '',
    text: '',
    user_id: ''
  })

  // update form values
  const updateUserForm = event => {
    setUserFormValues({
      ...userFormValues,
      [event.target.name]: event.target.value
    })
  }

  const updatePostForm = event => {
    setPostFormValues({
      ...postFormValues,
      [event.target.name]: event.target.value
    })
  }

  // get all user data
  const getAllUsers = () => {
    axios.get('http://localhost:7000/api/users/')
      .then(response => {
        console.log(response)
        setDataToRender(response.data)
      })
      .catch(error => console.log(error))
  }

  // get a specific user by id
  const getUserById = () => {
    axios.get(`http://localhost:7000/api/users/${userFormValues.id}`)
      .then(response => {
        console.log(response)
        setDataToRender([response.data])
      })
      .catch(error => console.log(error))
  }

  // get posts for a specific user by user id
  const getPostsByUserId = () => {
    axios.get(`http://localhost:7000/api/users/${userFormValues.id || postFormValues.id}/posts`)
      .then(response => {
        console.log(response)
        setDataToRender(response.data)
      })
      .catch(error => console.log(error))
  }

  // post a new user
  const postNewUser = () => {
    axios.create({ headers: {'Content-Type': 'application/json'} })
      .post('http://localhost:7000/api/users/', {
        name: userFormValues.name,
      })
      .then(response => {
        console.log(response)
        setDataToRender([response.data])
      })
      .catch(error => console.log(error))
  }

  // post a new post by user id
  const postNewPost = () => {
    axios.create({ headers: {'Content-Type': 'application/json'} })
      .post(`http://localhost:7000/api/users/${postFormValues.user_id || userFormValues.id}/posts`, {
        text: postFormValues.text
      })
      .then(response => {
        console.log(response)
        setDataToRender([response.data])
      })
      .catch(error => console.log(error))
  }

  // delete user by id
  const deleteUser = () => {
    axios.delete(`http://localhost:7000/api/users/${userFormValues.id}`)
      .then(response => {
        console.log(response)
        setDataToRender([response.data]) // put in array as response.data is an object unlike the other responses, which are arrays
      })
      .catch(error => console.log(error))
  }

  // edit user with user id
  const editUser = () => {
    axios.create({ headers: {'Content-Type': 'application/json'} })
      .put(`http://localhost:7000/api/users/${userFormValues.id}`, {
        name: userFormValues.name
      })
      .then(response => {
        console.log(response)
        setDataToRender([response.data])
      })
      .catch(error => console.log(error))
  }

  // get all post data
  const getAllPosts = () => {
    axios.get('http://localhost:7000/api/posts/')
      .then(response => {
        console.log(response)
        setDataToRender(response.data)
      })
      .catch(error => console.log(error))
  }

  // get a specific post by id
  const getPostById = () => {
    axios.get(`http://localhost:7000/api/posts/${postFormValues.id}`)
      .then(response => {
        console.log(response)
        setDataToRender([response.data])
      })
      .catch(error => console.log(error))
  }

  // delete post by id
  const deletePost = () => {
    axios.delete(`http://localhost:7000/api/posts/${postFormValues.id}`)
      .then(response => {
        console.log(response)
        setDataToRender([response.data]) // put in array as response.data is an object unlike the other responses, which are arrays
      })
      .catch(error => console.log(error))
  }

  // edit post with post id
  const editPost = () => {
    axios.create({ headers: {'Content-Type': 'application/json'} })
      .put(`http://localhost:7000/api/posts/${postFormValues.id}`, {
        text: postFormValues.text,
        user_id: postFormValues.user_id
      })
      .then(response => {
        console.log(response)
        setDataToRender([response.data])
      })
      .catch(error => console.log(error))
  }

  return (
    <div className='App'>
      <h1>API Tester</h1>
      <div className='formAndButtons'>
        <div className='formContainer'>
          <form>
            <h2>User Form</h2>
            <input name='id' placeholder='id' value={userFormValues.id} onChange={updateUserForm}/>
            <input name='name' placeholder='name' value={userFormValues.name} onChange={updateUserForm}/>
          </form>
          <form>
            <h2>Post Form</h2>
            <input name='id' placeholder='id' value={postFormValues.id} onChange={updatePostForm}/>
            <input name='text' placeholder='text' value={postFormValues.text} onChange={updatePostForm}/>
            <input name='user_id' placeholder='user id' value={postFormValues.user_id} onChange={updatePostForm}/>
          </form>
        </div>
        <div className='buttonContainer'>
          <button onClick={getAllUsers}>Get All Users</button>
          <button onClick={getUserById}>Get User By Id</button>
          <button onClick={getPostsByUserId}>Get Posts By User Id</button>
          <button onClick={postNewUser}>Post New User</button>
          <button onClick={postNewPost}>Post New Post</button>
          <button onClick={deleteUser}>Delete User</button>
          <button onClick={editUser}>Edit User</button>
          <button onClick={getAllPosts}>Get All Posts</button>
          <button onClick={getPostById}>Get Post By Id</button>
          <button onClick={deletePost}>Delete Post</button>
          <button onClick={editPost}>Edit Post</button>
        </div>
      </div>
      {/* render data */}
      {dataToRender.map(instance => {
        // will render if instance is a user
        if (instance.name){
          return (
            <div key={instance.id} className='instance'>
              <p>Id: {instance.id}</p>
              <p>Name: {instance.name}</p>
            </div>
          )
        } else if (instance.message){ // will render if instance is a message object
          return (
            <div key={instance.message} className='instance'>
              <p>Message: {instance.message}</p>
            </div>
          )
        } else if (instance.postedBy){ // posts can have postedBy or user_id properties depending on how they are retrieved
          return (
            <div key={instance.id} className='instance'>
              <p>Id: {instance.id}</p>
              <p>Text: {instance.text}</p>
              <p>Posted By: {instance.postedBy}</p>
            </div>
          )
        } else {
          return (
            <div key={instance.id} className='instance'>
              <p>Id: {instance.id}</p>
              <p>Text: {instance.text}</p>
              <p>User Id: {instance.user_id}</p>
            </div>
          )
        }
      })}
    </div>
  )
}

export default App
