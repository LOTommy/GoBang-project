import asyncio
from classes.GameBoard import GameBoard

COUNT_DOWN = 3

async def main():
    global COUNT_DOWN

    COUNT_DOWN = 0

    while True:

        name1="Apple"
        name2="Banana"
        
        #For PvP
        Board=GameBoard(name1,name2)
        #For PvC
        #Board=GameBoard(name1)

        Board.run()

        await asyncio.sleep(0)  # Very important, and keep it 0

        if not COUNT_DOWN:
            return

        COUNT_DOWN = COUNT_DOWN - 1

asyncio.run(main())
