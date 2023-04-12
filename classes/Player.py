import pygame as pg

SCREEN_SIZE=(1200,1000)

class Player(pg.sprite.Sprite):
    def __init__(self,name,colour):
        pg.sprite.Sprite.__init__(self)
        self.name=name
        self.colour=colour
        self.window = pg.display.set_mode(SCREEN_SIZE)

