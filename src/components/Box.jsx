/* eslint-disable react/prop-types */
import { useDrag } from 'react-dnd'
import { ItemTypes } from '../ItemTypes.js'
import './styles.css'
import { useState } from 'react'
export const Box = ({ name,color }) => {
  const [hidden, setHidden] = useState(false)
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.BOX,
    item: { name },
    end: (item, monitor) => {      
      const dropResult = monitor.getDropResult()
      if(item?.name === dropResult?.correctAnswer){
        setHidden(true)
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }))
  const opacity = isDragging ? 0 : 1
  if(hidden) return null
  return (
    <div ref={drag} className='box' style={{ opacity,color }} data-testid={`box`}>
      {name}
    </div>
  )
}
