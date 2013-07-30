f=open('allDatasets.json','r')
g=open('dataset1.js','w')

#parse string to allData object
allData=eval(f.read())

g.write("var dataset1 = ")
data1=allData["Quiz 21"]
# assuming that the starting time is 20.50
# for i in xrange(2,len(data1)):
# 	print float(data1[i]["timestamp"][15])*60 + float(data1[i]["timestamp"][17:19])
g.write(str(data1))
f.close()
g.close()