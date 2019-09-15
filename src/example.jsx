import React from 'react'
import Dustbin from './Dustbin'
import Box from './Box'
const Container = () => (
  <div>
    <div style={{ overflow: 'hidden', clear: 'both', margin: '-1rem' }}>
      <Dustbin>
        <Dustbin>
          <Dustbin />
        </Dustbin>
      </Dustbin>
    </div>

    <div style={{ overflow: 'hidden', clear: 'both', marginTop: '1.5rem' }}>
      <Box text = "number 1"/>      <Box text = "number 2"/>      <Box text = "number 3"/>
    </div>
    
  </div>
)
export default Container
