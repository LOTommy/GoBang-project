import pygame as pg
import time
import datetime
import random

from classes.Player import Player
from .Square import Square

WIDTH_MARGIN=300
HEIGHT_MARGIN=100
BOARD_SIZE=19
SQ_WIDTH=30
SQ_HEIGHT=30
BG_COLOUR=(202, 148, 94)
SCREEN_SIZE=(1200,1000)

START_TIME=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
BASE_TIME=time.perf_counter()

game_ID=1

class GameBoard(pg.sprite.Sprite):
    def __init__(self,name1,name2=None):
        global game_ID
        pg.sprite.Sprite.__init__(self)

        #game info
        self.gameID=game_ID
        game_ID+=1
        self.game_type="PvP" if name2!=None else "PvC"
        self.start_time=START_TIME
        self.ellapsed_time=0
        player1=Player(name1,"b")
        player2=Player(name2,"w") if name2!=None else None
        self.players=[player1,player2]
        self.current_player=player1
        self.move_position=None

        #theoretical board
        self.board=[["" for i in range(BOARD_SIZE)]for j in range(BOARD_SIZE)]

        #actual board
        self.window = pg.display.set_mode(SCREEN_SIZE)
        self.board_squares=[[Square(i,j,self.board[i][j]) for i in range(BOARD_SIZE)]for j in range(BOARD_SIZE)]




    #game running methods
    def is_move_valid(self,x,y):
        if self.board[x][y]=="":
            return True
        else:
            return False

    def move(self,x,y):
        self.board[x][y]=self.current_player.colour

    def is_game_over(self):
        c=self.current_player.colour
        for row in range(BOARD_SIZE):
            for col in range(BOARD_SIZE):
                if self.board[row][col]==c:
                    #horizontal
                    if col<=14:
                        if self.board[row][col+1]==c and self.board[row][col+2]==c and self.board[row][col+3]==c and self.board[row][col+4]==c:
                            return True
                    #vertical
                    if row <=14:
                        if self.board[row+1][col]==c and self.board[row+2][col]==c and self.board[row+3][col]==c and self.board[row+4][col]==c:
                            return True
                    #leftdown-rightup
                    if row >=4 and col<=14:
                        if self.board[row-1][col+1]==c and self.board[row-2][col+2]==c and self.board[row-3][col+3]==c and self.board[row-4][col+4]==c:
                            return True
                    #leftup-rightdown
                    if row <=14 and col<=14:
                        if self.board[row+1][col+1]==c and self.board[row+2][col+2]==c and self.board[row+3][col+3]==c and self.board[row+4][col+4]==c:
                            return True
        
        return False


    def get_last_move(self):
        return self.move_position
    
    def handle_retract(self,player):
        if player==self.players[0]:
            self.players[1].call_retract()
        else:
            self.players[0].call_retract()

    def retract(self):
        x,y=self.get_last_move()
        self.board[x][y]=""

    def computer_move(self):
        while True:
            x=random.randint(0,18)
            y=random.randint(0,18)

            if self.is_move_valid(x,y):
                return (x,y)

    def run(self):
        pg.init()
        self.window.fill(BG_COLOUR)

        #display game info
        msg="player 1: "+self.players[0].name if self.game_type=="PvP" else "player: "+self.players[0].name
        self.display_info(msg,(120,80),12)
        if self.game_type=="PvP":
            msg="player 2: "+self.players[1].name
            self.display_info(msg,(120,100),12)
        msg="start time: "+self.start_time
        self.display_info(msg,(120,120),12)
        pg.display.update()

        keep_going=True
        while keep_going:
            self.display_board()

            #display ellapsed time
            msg="ellapsed time: "+str(round(self.ellapsed_time))+" seconds"
            self.display_info(msg,(120,140),14,overwrite=True)

            self.timer()
            msg="ellapsed time: "+str(round(self.ellapsed_time))+" seconds"
            self.display_info(msg,(120,140),14)

            #display current player
            chess_colour="black" if self.current_player.colour=="b" else "white"
            msg=self.current_player.name+" ("+chess_colour+")'s turn:"
            self.display_info(msg,(400,20),24)
            pg.display.update()

            if self.game_type=="PvP":
                mouse_x,mouse_y=pg.mouse.get_pos()
                for event in pg.event.get():
                    if event.type == pg.QUIT:
                        keep_going=False
                    elif event.type == pg.MOUSEBUTTONDOWN:
                        if event.button == 1:
                            x,y=self.get_pos_from_screen(mouse_x,mouse_y)
                            can_move=self.is_move_valid(x,y)
                            if not can_move:
                                continue
                            
                            self.move(x,y)
                            self.move_position=(x,y)
                            self.update_squares()
                            self.display_board()
                            pg.display.update()

                            keep_going=not self.is_game_over()
                            if keep_going:
                                msg=self.current_player.name+"'s turn:"
                                self.display_info(msg,(400,20),24,overwrite=True)

                                self.current_player=self.players[1] if self.current_player==self.players[0] else self.players[0]

                    

    #transform methods
    def get_pos_from_screen(self,mouse_x,mouse_y):
        col=int((mouse_x-WIDTH_MARGIN)/SQ_WIDTH)
        row=int((mouse_y-HEIGHT_MARGIN)/SQ_HEIGHT)
        return (row,col)

    def update_squares(self):
        for i in range(BOARD_SIZE):
            for j in range(BOARD_SIZE):
                if self.board[i][j]=="b":
                    self.board_squares[i][j].occupying_piece.colour=(0,0,0)
                elif self.board[i][j]=="w":
                    self.board_squares[i][j].occupying_piece.colour=(255,255,255)
                else:
                    self.board_squares[i][j].occupying_piece.colour=None


    #display methods
    def display_board(self):
        for i in range(BOARD_SIZE):
            for j in range(BOARD_SIZE):
                self.board_squares[i][j].draw(self.window)

    def display_info(self,msg,centre,size,overwrite=False):
        if overwrite:
            font_col=BG_COLOUR
        else:
            font_col=(0, 255, 0)

        font = pg.font.Font('freesansbold.ttf', size)
        text = font.render(msg, True,font_col)
        text_rect = text.get_rect()
        text_rect.center=centre
        self.window.blit(text,text_rect)
        pg.display.update()

    #timer
    def timer(self):
        self.ellapsed_time=time.perf_counter()-BASE_TIME

    #upload
    #def upload_game_info(self):
