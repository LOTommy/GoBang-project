class Score:
    def __init__(self):
        self.p1score = 0            #player1 score default = 0
        self.p2score = 0            #player2 score default = 0
    
    def update(self, winner):       #update score for winner
        if winner == player1:
            self.p1score += 1
        elif winner == player2:
            self.p2score += 1
            
    def display(self):              #return the player score for displaying
        list = []
        list.append(self.p1score)
        list.append(self.p2score)
        return list