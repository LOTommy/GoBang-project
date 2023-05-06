import pygame as pg

WIDTH_MARGIN=300
HEIGHT_MARGIN=100
SQ_WIDTH=40
SQ_HEIGHT=40

BG_COLOUR=(202, 148, 94)
class Piece:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.colour = BG_COLOUR #bg colour = no piece
        self.centre_x= WIDTH_MARGIN + self.x * SQ_WIDTH# + SQ_WIDTH / 2
        self.centre_y= HEIGHT_MARGIN + self.y * SQ_HEIGHT# + SQ_HEIGHT / 2
        self.centre=(self.centre_x,self.centre_y)
        self.radius=5

    def draw(self, window):
        pg.draw.circle(window, self.colour, self.centre,self.radius,0)

    def update_colour(self,colour):
        #"b":  black,  "w": white, "r": retracted (use bg to cover stone), "": empty
        self.radius=15
        self.colour = BG_COLOUR
        if colour=="b":
            self.colour = (0,0,0)
        elif colour=="w":
            self.colour = (255,255,255)
        elif colour=="":
            self.radius=5
