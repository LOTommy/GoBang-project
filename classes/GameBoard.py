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
        self.current_colour="b"
        self.move_position=None
        self.retract_process=False

        #theoretical board
        self.board=[["" for i in range(BOARD_SIZE)]for j in range(BOARD_SIZE)]

        #actual board
        self.window = pg.display.set_mode(SCREEN_SIZE)
        self.mouse_x=0
        self.mouse_y=0
        self.board_squares=[[Square(i,j,self.board[i][j]) for i in range(BOARD_SIZE)]for j in range(BOARD_SIZE)]




    #game running methods
    def is_move_valid(self,x,y):
        if self.board[x][y]=="":
            return True
        else:
            return False

    def move(self,x,y):

        self.board[x][y]=self.current_colour

    def is_game_over(self):
        c=self.current_colour
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
    




    def retract(self):
        x,y=self.get_last_move()
        self.board[x][y]=""
        self.update_squares()

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
        self.display_text(msg,(120,80),12)
        if self.game_type=="PvP":
            msg="player 2: "+self.players[1].name
            self.display_text(msg,(120,100),12)
        msg="start time: "+self.start_time
        self.display_text(msg,(120,120),12)
        pg.display.update()

        #display retract button
        pg.draw.rect(self.window,(255,192,0),[600,800,150,50])
        self.display_text("retract",(675,825),24)

        keep_going=True
        while keep_going:
            self.mouse_x,self.mouse_y=pg.mouse.get_pos()
            self.display_board()

            #display ellapsed time
            old_ellapsed_time=self.ellapsed_time
            self.timer()
            new_ellapsed_time=self.ellapsed_time
            if new_ellapsed_time!=old_ellapsed_time:
                msg=f"ellapsed time: {old_ellapsed_time} seconds"
                self.display_text(msg,(120,140),14,overwrite=True)

                msg=f"ellapsed time: {new_ellapsed_time} seconds"
                self.display_text(msg,(120,140),14)

            #display retract button
            if self.mouse_x>=600 and self.mouse_x<=750 and self.mouse_y>=800 and self.mouse_y<=850:
                box_colour=(166,39,217)
            else:
                box_colour=(255,192,0)
            pg.draw.rect(self.window,box_colour,[600,800,150,50])
            self.display_text("retract",(675,825),24)


            self.display_retract_msg(not self.retract_process)


            pg.display.update()

            if self.current_player!=None:
            #display current player
                chess_colour="black" if self.current_colour=="b" else "white"
                msg=self.current_player.name+" ("+chess_colour+")'s turn:"
                self.display_text(msg,(400,20),24)
                pg.display.update()

                for event in pg.event.get():
                    if event.type == pg.QUIT:
                        keep_going=False
                    elif event.type == pg.MOUSEBUTTONDOWN:
                        #retracting
                        if self.mouse_x>=600 and self.mouse_x<=750 and self.mouse_y>=800 and self.mouse_y<=850:
                            self.retract_process=True
                            continue #no need to change player
                        #waiting for retract response
                        elif self.retract_process:
                            #yes retract
                            if self.mouse_x>=900 and self.mouse_x<=1000 and self.mouse_y>=30 and self.mouse_y<=60: 
                                self.retract()
                                self.display_text("retracted!",(600,80),26)
                                time.sleep(1)
                                self.display_text("retracted!",(600,80),26,overwrite=True)
                                self.retract_process=False
                            #no retract
                            elif self.mouse_x>=1050 and self.mouse_x<=1150 and self.mouse_y>=30 and self.mouse_y<=60: 
                                msg=f"{self.current_player.name} does not allow retract!"
                                self.display_text(msg,(600,80),26)
                                time.sleep(1)
                                self.display_text(msg,(600,80),26,overwrite=True)
                                self.retract_process=False
                                continue #no need to change player

                        #put a stone
                        else:
                            x,y=self.get_pos_from_screen()
                            can_move=self.is_move_valid(x,y)
                            if not can_move:
                                continue
                            
                            self.move(x,y)
                            self.move_position=(x,y)
                            self.update_squares()
                            self.display_board()
                            pg.display.update()

                        #check game over & change current player
                        keep_going=not self.is_game_over()
                        if keep_going:
                            self.display_text(msg,(400,20),24,overwrite=True)
                            self.current_player=self.players[1] if self.current_player==self.players[0] else self.players[0]
                            self.current_colour=self.current_player.colour if self.current_player!=None else "w"
            else:
                msg="computer (white)'s turn:"
                self.display_text(msg,(400,20),24)
                pg.display.update()
                time.sleep(1)
                x,y=self.computer_move()
                self.move(x,y)
                self.move_position=(x,y)
                self.update_squares()
                self.display_board()
                pg.display.update()

                keep_going=not self.is_game_over()
                if keep_going:
                    self.display_text(msg,(400,20),24,overwrite=True)
                    self.current_player=self.players[0]
                    self.current_colour="b"

        winner=self.current_player.name if self.current_player!=None else "Computer"
        self.display_text(f"{winner} wins!",(SCREEN_SIZE[0]/2,SCREEN_SIZE[1]/2),48,final_display=True)
        time.sleep(2)
        self.display_text("Uploading game info",(SCREEN_SIZE[0]/2,SCREEN_SIZE[1]/2+200),48,final_display=True)
        time.sleep(2)
        pg.quit()

    #transform methods
    def get_pos_from_screen(self):
        col=int((self.mouse_x-WIDTH_MARGIN)/SQ_WIDTH)
        row=int((self.mouse_y-HEIGHT_MARGIN)/SQ_HEIGHT)
        return (row,col)

    def update_squares(self):
        for i in range(BOARD_SIZE):
            for j in range(BOARD_SIZE):
                if self.board[i][j]=="b":
                    self.board_squares[i][j].occupying_piece.colour=(0,0,0)
                elif self.board[i][j]=="w":
                    self.board_squares[i][j].occupying_piece.colour=(255,255,255)
                else:
                    self.board_squares[i][j].occupying_piece.colour=BG_COLOUR   


    #display methods
    def display_board(self):
        for i in range(BOARD_SIZE):
            for j in range(BOARD_SIZE):
                self.board_squares[i][j].draw(self.window)

    def display_text(self,msg,centre,size,overwrite=False,final_display=False):
        bg=None

        if overwrite:
            font_col=BG_COLOUR
            bg=BG_COLOUR
        else:
            font_col=(0, 255, 0)

        if final_display:
            bg=(255,255,255)


        font = pg.font.Font('freesansbold.ttf', size)
        text = font.render(msg, True,font_col,bg)
        text_rect = text.get_rect()
        text_rect.center=centre
        self.window.blit(text,text_rect)
        pg.display.update()

    def display_retract_msg(self,overwrite=False):
        if self.current_player==self.players[0]:
            next_player_name=self.players[1].name
        else:
            next_player_name=self.players[0].name

        msg=f"{next_player_name} wants to retract. Does {self.current_player.name} agree?"
        self.display_text(msg,(600,50),24,overwrite)

        if overwrite:
            y_box_colour=BG_COLOUR
            n_box_colour=BG_COLOUR
        else:
            if self.mouse_x>=900 and self.mouse_x<=1000 and self.mouse_y>=30 and self.mouse_y<=60: #yes button
                y_box_colour=(166,39,217)
            else:
                y_box_colour=(255,192,0)

            if self.mouse_x>=1050 and self.mouse_x<=1150 and self.mouse_y>=30 and self.mouse_y<=60: #no button
                n_box_colour=(166,39,217)
            else:
                n_box_colour=(255,192,0)


        pg.draw.rect(self.window,y_box_colour,[900,30,100,30])
        self.display_text("Yes",(950,45),24,overwrite)

        pg.draw.rect(self.window,n_box_colour,[1050,30,100,30])
        self.display_text("No",(1100,45),24,overwrite)

        pg.display.update()


    #timer
    def timer(self):
        new_time=round(time.perf_counter()-BASE_TIME)
        if new_time!=self.ellapsed_time:
            self.ellapsed_time=new_time

    #upload
    #def upload_game_info(self):
