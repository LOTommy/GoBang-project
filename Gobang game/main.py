from classes.GameBoard import GameBoard

if __name__ == '__main__':
    name1="Apple"
    name2="Banana"
    #For PvP
    Board=GameBoard(name1,name2)
    #For PvC
    #Board=GameBoard(name1)
    Board.run()
