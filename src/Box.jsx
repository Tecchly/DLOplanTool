import React from 'react'
import { useDrag } from 'react-dnd'
import ItemTypes from './ItemTypes'
const style = {
  display: 'inline-block',
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  backgroundColor: 'white',
  borderRadius: '50%',
  cursor: 'move',
}
const Box = ({ text }) => {
  const [, drag] = useDrag({ item: { type: ItemTypes.BOX, text: text } })
  return (
    <div ref={drag} style={style}>
      {text}
    </div>
  )
}
export default Box
