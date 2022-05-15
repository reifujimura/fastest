from typing import List, Any


class Point:
    x: int
    y: int

    def __init__(self, x: int, y: int):
        self.x = x
        self.y = y

    def to_dict(self) -> dict[str, Any]:
        return {
            "x": self.x,
            "y": self.y
        }


class Size:
    width: int
    height: int

    def __init__(self, width: int, height: int):
        self.width = width
        self.height = height

    def to_dict(self) -> dict[str, Any]:
        return {
            "width": self.width,
            "height": self.height
        }


class Box:
    offset: Point
    size: Size

    def __init__(self, offset: Point, size: Size):
        self.offset = offset
        self.size = size

    def to_dict(self) -> dict[str, Any]:
        return {
            "offset": self.offset.to_dict(),
            "size": self.size.to_dict()
        }


class Segment:
    name: str
    color: str
    roi: Box
    contour: List[Point]
    params: dict[str, Any]

    def __init__(self, roi: Box, contour: List[Point], name: str = None, color: str = None, params: dict[str, Any] = None):
        self.roi = roi
        self.contour = contour
        self.params = params
        self.color = color
        self.name = name

    def to_dict(self) -> dict[str, Any]:
        dst = {
            "roi": self.roi.to_dict(),
            "contour": [pt.to_dict() for pt in self.contour],
            "name": self.name,
            "color": self.color,
            "params": self.params
        }
        return dst
