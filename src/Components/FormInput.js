import React from 'react'
import { useState } from "react"
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Footer from './Footer';

export default function FormInput() {
  //Add ToDo Task
    const [job, setJob] = useState("")
    const [jobs, setJobs] = useState(() => {
    const storageJobs = JSON.parse(localStorage.getItem("jobs"))
    return storageJobs ?? []
  })
  const [count, setCount] = useState(0)
  const handleAdd = (e) => {
    e.preventDefault()
    setJobs((prev) => {
      const newJobs = [...prev, job]

      const jsonJobs = JSON.stringify(newJobs)
      localStorage.setItem("jobs", jsonJobs)
      setCharacters(newJobs)
      return newJobs
    });
    setJob("")
  }
    //Drop and Drag
  const [characters, setCharacters] = useState(jobs)
  function handleOnDragEnd(result) {
    if (!result.destination) return;
    const items = Array.from(characters)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    setCharacters(items)
  }
  //Update ToDo Task
  const [onEdit, setOnEdit] = useState(false)
  const [indexState, setIndexState] = useState()
  const handleEdit = (index) => {
    setOnEdit(index)
    setIndexState(jobs.indexOf(index))
  }
  const handleUpdate = () => {
    const temp = onEdit
    jobs[indexState] = temp

    setJobs(() => {
      const jsonJobs = JSON.stringify(jobs);
      localStorage.setItem("jobs", jsonJobs);
      setOnEdit(false)
      return jobs
    })
  }
  //Delete ToDo Task
  const handleDelete = (index) => {
    setCount(() => {
      let temp = count
      temp++
      return temp
    })
    const deletedJobs = jobs.filter((job) => job !== index)
    setJobs(() => {
      const jsonJobs = JSON.stringify(deletedJobs);
      localStorage.setItem("jobs", jsonJobs);
      return deletedJobs
    })
    setCharacters(deletedJobs)
    //window.location.reload();
  }
  //Return
  if(onEdit) {
    return (
    <React.Fragment>
          <form autoComplete="off" onSubmit={handleAdd}>
              <input
              type="text"
              value={job}
              placeholder="Add to do"
              onChange={(e) => setJob(e.target.value)}
              ></input>
              <button onClick={handleAdd}>Add</button>
          </form>
          <ul>
            <li>
              <input className='input_Update' type="text" onChange={(e) => setOnEdit(e.target.value)} value={onEdit}/>
              <div>
                <button onClick={handleUpdate}>Update</button>
              </div>
            </li>
          </ul>
      </React.Fragment>
    )
  }
  else {
    return (
      <React.Fragment>
          <form autoComplete="off" onSubmit={handleAdd}>
              <input
              type="text"
              value={job}
              placeholder="Add to do"
              onChange={(e) => setJob(e.target.value)}
              ></input>
              <button onClick={handleAdd}>Add</button>
          </form>
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId='characters'>
              {(provided) => (
                <ul {...provided.droppableProps} ref={provided.innerRef}>
                  {characters.map(( job, index) => (
                    <Draggable key={job} draggableId={job} index={index}>
                      {(provided) => (
                        <li className="" {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                        <lable className="lable_decor">{job}</lable>
                        <div>
                          <button onClick={() => handleEdit(job)}>Edit</button>
                          <button onClick={() => handleDelete(job)}>Delete</button>
                        </div>
                        </li>
                      )}
                    </Draggable>
                  ))}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
          <Footer count={count}/>
      </React.Fragment>
    )
  }
}
