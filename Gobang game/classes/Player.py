import pygame as pg

class Player(pg.sprite.Sprite):
    def __init__(self,name,colour):
        pg.sprite.Sprite.__init__(self)
        self.name=name
        self.colour=colour





    def new_position():
        mousex,mousey=pg.mouse.get_pos()
        return (mousex,mousey)
    
    #def call_retract():

    #def response_retract():