type Point = {
  x: number
  y: number
}

type Size = {
  width: number
  height: number
}

type Box = {
  offset: Point
  size: Size
}

type Segment = {
  name?: string
  color?: string
  roi: Box
  contour: Point[]
  params: { [key: string]: string | number | boolean }
}

type Image = {
  url: string
  name: string
  width: number
  height: number
}

type Result = {
  image: Image
  segments: Segment[]
}
