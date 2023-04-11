import pygame as pg

WIDTH_MARGIN=300
HEIGHT_MARGIN=100
BOARD_SIZE=19
SQ_WIDTH=30
SQ_HEIGHT=30

class Piece:
    def __init__(self, x, y, colour):
        self.x = x
        self.y = y
        if colour=="b":
            self.colour = (0,0,0) 
        elif colour=="w":
            self.colour = (255,255,255)
        else:
            self.colour = None
        self.centre_x= WIDTH_MARGIN + self.x * SQ_WIDTH + SQ_WIDTH / 2
        self.centre_y= HEIGHT_MARGIN + self.y * SQ_HEIGHT + SQ_HEIGHT / 2
        self.centre=(self.centre_x,self.centre_y)
        self.radius=5

    def draw(self, window):

        if self.colour != None:
            pg.draw.circle(window, self.colour, self.centre,self.radius,0)
