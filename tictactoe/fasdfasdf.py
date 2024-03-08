file = open("tictactoe\\index2.html", "r")
# file2 = open("tictactoe\\index2.html", "w")

# for line in file:
#     file2.write(line[:-1] + "\\" + "n")

for line in file:
    l = line.split("\\n")

for i in l:
    print(i)
