import React from 'react'

import { StackedCarousel, layout, transformOrigin } from 'stacked-carousel'
import 'stacked-carousel/dist/index.css'

const App = () => {
  return <StackedCarousel  option={{
    layout:layout.slide,
    selector:".container",
    transformOrigin:transformOrigin.center,
    selectedIndex:1,
    items:[
      {image:"/images/Roads.jpg",title:"Roads"},
      {image:"/images/Renewables.jpg",title:"Renewables"},
      {image:"/images/Water.jpg",title:"Water"},
      {image:"/images/Environment.jpg",title:"Environment"},
      {image:"/images/Utilities.jpg",title:"Utilities"},
      {image:"/images/Rail.jpg",title:"Rail"},
    ]
    
  }} />
}

export default App
