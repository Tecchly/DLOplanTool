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
const Box = () => {
  const [, drag] = useDrag({ item: { type: ItemTypes.BOX } })
  return (
    <div ref={drag} style={style}>
      Drag me
    </div>
  )
}
export default Box
