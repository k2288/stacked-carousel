import * as React from 'react'
import styles from './styles.module.css'

interface StackedCarouselProps {
  option: config
}

interface config {
  layout: layout // slide, fanOut
  onClick?: (el: HTMLElement) => {} // onclick event provided
  transformOrigin: transformOrigin // css transformOrigin
  selector: string
  items: Item[],
  selectedIndex:number
}

interface Item {
  image: string
  title: string
}

export enum layout {
  'slide' = 'slide',
  'fanOut' = 'fanOut'
}

export enum transformOrigin {
  'center' = 'center'
}

export const StackedCarousel = ({ option }: StackedCarouselProps) => {
  const [config, setConfig] = React.useState<config>({
    layout: layout.slide, // slide, fanOut
    onClick: undefined, // onclick event provided
    transformOrigin: transformOrigin.center, // css transformOrigin
    selector: '',
    items: [],
    selectedIndex:2
  })

  const [els, setEls] = React.useState<NodeListOf<HTMLElement>>()

  React.useEffect(() => {
    setConfig(extend(config, option))
    setEls(
      document.querySelectorAll(
        config.selector + ' li'
      ) as NodeListOf<HTMLElement>
    )
  }, [])

  React.useEffect(() => {
    if (els?.length) draw()
  }, [els])

  const extend = function (custom: config, defaults: config) {
    let key, value
    for (key in defaults) {
      value = defaults[key]
      if (custom[key] == null) {
        custom[key] = value
      }
    }
    return custom
  }

  const draw = function () {
    if (els) {
      const parent = els[0].parentNode as HTMLElement
      let getItemHeight = els[0].getBoundingClientRect().height
      if (parent) {
        parent.style.height = getItemHeight + 'px'
      }


      let activeTransform = 'translate(' + -50 + '%, 0%)  scale(1)'

      // detectSwipe()

      /*let liWidth = 0;
    for(let q = 0;q<els.length; q++) {
        liWidth = liWidth + els[q].getBoundingClientRect().width;
    }*/

      // to get the active element's position, we will have to know if elements are in even/odd count

      // oneHalf if the centerPoint - things go left and right from here

      els.forEach((el) => {
        el.style.transformOrigin = config.transformOrigin

        el.addEventListener('click', function () {
          let clickedEl = el as HTMLElement
          let nextCnt = 0
          let prevCnt = 0

          do {
            // While there is a next sibling, loop
            // let next = clickedEl.nextElementSibling as HTMLElement
            nextCnt = nextCnt + 1
          } while ((clickedEl = clickedEl.nextElementSibling as HTMLElement))

          // re-initialize the clickedEl to do the same for prev elements
          clickedEl = el

          do {
            // While there is a prev sibling, loop
            // let prev = clickedEl.previousElementSibling
            prevCnt = prevCnt + 1
          } while ((clickedEl = clickedEl.previousElementSibling as HTMLElement))

          reCalculateTransformsOnClick(nextCnt - 1, prevCnt - 1)

          // loopNodeList(els, function (el: HTMLElement) {
          //   el.classList.remove('active')
          // })
          for (let i = 0; i < els.length; i++) {
            els[i].classList.remove('active')
          }

          el.classList.add('active')
          el.classList.add(config.layout)

          el.style.zIndex = (els.length * 5).toString()
          el.style.transform = activeTransform

          if (config.onClick) {
            config.onClick(el)
          }
        })
      })

      els[config.selectedIndex].click()
    }
  }

  const reCalculateTransformsOnClick = function (
    nextCnt: number,
    prevCnt: number
  ) {
    let z = 10

    let elsArray = nodelistToArray(els)

    let scale = 1,
      translateX = 0,
      rotateVal = 0,
      rotate = ''
    // let rotateNegStart = 0 // ((75 / els.length) * (oneHalf))*-1;

    // let transformArr = []
    // let zIndexArr = []
    // let relArr = []

    let layout = config.layout

    let maxCntDivisor = Math.max(prevCnt, nextCnt)
    let prevDivisor = 100 / maxCntDivisor
    let nextDivisor = 100 / maxCntDivisor

    if (prevCnt > nextCnt) {
      scale = 0 + 100 / (prevCnt + 1) / 100
    } else {
      scale = 1 - prevCnt * (1 / (nextCnt + 1))
    }

    let rotatePrevStart = ((prevCnt * 10) / prevCnt) * prevCnt * -1
    let rotateNextStart = (nextCnt * 10) / nextCnt

    for (let i = 0; i < prevCnt; i++) {
      switch (layout) {
        case 'slide':
          if (i > 0) {
            scale = scale + 100 / (maxCntDivisor + 1) / 100
          }

          translateX = -50 - prevDivisor * (prevCnt - i)

          rotate = 'rotate(0deg)'
          break
        case 'fanOut':
          rotateVal = rotatePrevStart

          if (i > 0) {
            scale = scale + 100 / (maxCntDivisor + 1) / 100
          }
          translateX = -50 - prevDivisor * (prevCnt - i)
          rotate = 'rotate(' + rotateVal + 'deg)'

          rotatePrevStart = rotatePrevStart + (prevCnt * 10) / prevCnt

          break
        default:
          translateX = (150 - prevDivisor * 2 * i) * -1
          rotate = 'rotate(0deg)'
      }

      let styleStr =
        'translate(' + translateX + '%, 0%)  scale(' + scale + ') ' + rotate

      z = z + 1

      elsArray[i].style.transform = styleStr
      elsArray[i].style.zIndex = z
    }

    // we are going for active element, so make it higher
    z = z - 1

    let j = 0

    // rotateNegStart = 0
    scale = 1
    for (let i = prevCnt + 1; i < nextCnt + prevCnt + 1; i++) {
      j = j + 1
      switch (layout) {
        case 'slide':
          scale = scale - 100 / (maxCntDivisor + 1) / 100
          translateX = (50 - nextDivisor * j) * -1
          rotate = 'rotate(0deg)'
          break
        case 'fanOut':
          rotateVal = rotateNextStart

          scale = scale - 100 / (maxCntDivisor + 1) / 100
          translateX = (50 - nextDivisor * j) * -1
          rotate = 'rotate(' + rotateVal + 'deg)'

          rotateNextStart = rotateNextStart + (nextCnt * 10) / nextCnt
          break
        default:
          translateX = (50 - prevDivisor * 2 * i) * -1
          rotate = 'rotate(0deg)'
      }

      z = z - 1

      let styleStr =
        'translate(' + translateX + '%, 0%)  scale(' + scale + ') ' + rotate

      elsArray[i].style.transform = styleStr
      elsArray[i].style.zIndex = z
    }
  }

  const nodelistToArray = function (nodelist: any) {
    let results = []
    let i, element
    for (i = 0; i < nodelist.length; i++) {
      element = nodelist[i]
      results.push(element)
    }
    return results
  }
  const detectSwipe = function () {
    let regionEl = document.querySelector(config.selector) as HTMLElement

    detectSwipeDir(regionEl, function (swipedir: string) {
      let activeEl = document.querySelector(
        config.selector + ' li.active'
      ) as HTMLElement
      if (activeEl) {
        if (swipedir == 'left') {
          // activeEl.nextElementSibling.click()
        } else if (swipedir == 'right') {
          // activeEl.previousElementSibling.click()
        }
      }
    })
  }

  const detectSwipeDir = function (el: HTMLElement, callback: any) {
    //credits: http://www.javascriptkit.com/javatutors/touchevents2.shtml

    let touchsurface = el,
      swipedir: string,
      startX: number,
      startY: number,
      distX,
      distY,
      threshold = 75, //required min distance traveled to be considered swipe
      restraint = 100, // maximum distance allowed at the same time in perpendicular direction
      allowedTime = 300, // maximum time allowed to travel that distance
      elapsedTime,
      startTime: number,
      handleswipe = callback || function () {}

    touchsurface.addEventListener(
      'touchstart',
      function (e) {
        let touchobj = e.changedTouches[0]
        swipedir = 'none'
        // dist = 0
        startX = touchobj.pageX
        startY = touchobj.pageY
        startTime = new Date().getTime() // record time when finger first makes contact with surface
        e.preventDefault()
      },
      false
    )

    touchsurface.addEventListener(
      'touchmove',
      function () {
        //e
        // e.preventDefault() // prevent scrolling when inside DIV
      },
      false
    )

    touchsurface.addEventListener(
      'touchend',
      function (e) {
        let touchobj = e.changedTouches[0]
        distX = touchobj.pageX - startX // get horizontal dist traveled by finger while in contact with surface
        distY = touchobj.pageY - startY // get vertical dist traveled by finger while in contact with surface
        elapsedTime = new Date().getTime() - startTime // get time elapsed
        if (elapsedTime <= allowedTime) {
          // first condition for awipe met
          if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
            // 2nd condition for horizontal swipe met
            swipedir = distX < 0 ? 'left' : 'right' // if dist traveled is negative, it indicates left swipe
          } else if (
            Math.abs(distY) >= threshold &&
            Math.abs(distX) <= restraint
          ) {
            // 2nd condition for vertical swipe met
            swipedir = distY < 0 ? 'up' : 'down' // if dist traveled is negative, it indicates up swipe
          }
        }
        handleswipe(swipedir)
        e.preventDefault()
      },
      false
    )
  }
  return (
    <div
      className={`${styles['stacked-cards']} ${styles['featured']} ${config.selector} `}
    >
      <ul className={styles.slider}>
        {option.items.map((item) => {
          return <li  key={`carousel_item_${item.title}`} className={styles.item}>
            <img src={item.image} alt=""/>
            <h2 style={{position:"absolute",zIndex:100}}>{item.title}</h2>
          </li>
        })}
      </ul>
    </div>
  )
}
