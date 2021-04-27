import React from 'react'

import { StackedCarousel, layout, transformOrigin } from 'stacked-carousel'
import 'stacked-carousel/dist/index.css'

const App = () => {
  const items = [
    { image: '/images/Roads.jpg', title: 'Roads' },
    { image: '/images/Renewables.jpg', title: 'Renewables' },
    { image: '/images/Water.jpg', title: 'Water' },
    { image: '/images/Environment.jpg', title: 'Environment' },
    { image: '/images/Utilities.jpg', title: 'Utilities' },
    { image: '/images/Rail.jpg', title: 'Rail' }
  ]
  return (
    <>
    <StackedCarousel
      option={{
        layout: layout.slide,
        selector: 'container-test',
        transformOrigin: transformOrigin.center,
        selectedIndex: 1,
        items: items.map((item) => {
          return (
            <li key={`carousel_item_${item.title}`}>
              <img src={item.image} alt='' />
              <h2 style={{ position: 'absolute', zIndex: 100 }}>
                {item.title}
              </h2>
            </li>
          )
        })
      }}
    />
    <ul>
      <li>test</li>
      <li>test2</li>
    </ul>
    </>
  )
}

export default App
