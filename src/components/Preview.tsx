import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'

type PreviewProps = {
  selectedIndex?: number
  result: Result
  onClick?: (index?: number) => void
}

export const Preview = ({ result, selectedIndex, onClick }: PreviewProps) => {
  const svgRef = useRef<SVGSVGElement>(null)
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const seg =
      selectedIndex !== undefined ? result.segments[selectedIndex] : undefined
    const viewBox = seg
      ? `${seg.roi.offset.x - 5} ${seg.roi.offset.y - 5} ${
          seg.roi.size.width + 10
        } ${seg.roi.size.height + 10}`
      : `0 0 ${result.image.width} ${result.image.height}`
    gsap.to(svg, {
      duration: 0.5,
      attr: { viewBox },
      ease: 'power3.inOut',
    })
  }, [selectedIndex])
  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox={`0 0 ${result.image.width} ${result.image.height}`}
      style={{ background: 'black' }}
    >
      <image
        width={result.image.width}
        height={result.image.height}
        href={result.image.url}
        onClick={() => onClick?.()}
      />
      {result.segments
        ?.filter((_, i) => selectedIndex === undefined || i === selectedIndex)
        .map((seg, i) => {
          const color = seg.color ?? '#FF0000'
          return (
            <>
              {selectedIndex === undefined && (
                <text
                  key={`text-${Math.round(Math.random() * 1000)}-${i}`}
                  style={{ userSelect: 'none' }}
                  x={seg.roi.offset.x - 5}
                  y={seg.roi.offset.y - 5}
                  fill={color}
                  fontFamily="sans-serif"
                >
                  {seg.name ?? i + 1}
                </text>
              )}
              <polygon
                key={`polygon-${Math.round(Math.random() * 1000)}-${i}`}
                fill="#FFFFFF01"
                stroke={color}
                points={seg.contour.map((p) => `${p.x},${p.y}`).join(' ')}
                cursor="pointer"
                onClick={() =>
                  onClick?.(selectedIndex !== undefined ? selectedIndex : i)
                }
              />
            </>
          )
        })}
    </svg>
  )
}
