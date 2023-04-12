import pygame as pg
from .Piece import Piece

WIDTH_MARGIN=300
HEIGHT_MARGIN=100
SQ_WIDTH=40
SQ_HEIGHT=40

class Square:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.width = SQ_WIDTH
        self.height = SQ_HEIGHT
        self.screen_x = x * self.width + WIDTH_MARGIN
        self.screen_y = y * self.height + HEIGHT_MARGIN
        self.actual_coord = (self.screen_x, self.screen_y)
        self.colour = (164, 55, 0)
        self.rect = pg.Rect(
            self.screen_x,
            self.screen_y,
            self.width,
            self.height
        )

    def draw(self, window):
        pg.draw.rect(window, self.colour, self.rect,1)
