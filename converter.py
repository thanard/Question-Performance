import math
#number of timeperiods
numTps=7
# max grade
maxG=10
minG=6

numG=maxG-minG+1

f=open('allDatasets.json','r')
g=open('dataset1.js','w')

g.write("var numTps = "+str(numTps)+";\n")
g.write("var maxG = " + str(maxG)+";\n")
g.write("var minG = "+str(minG)+";\n")

#parse string to allData object
allData=eval(f.read())

g.write("\n//In case we want to get students' answers.\n")
g.write("var dataset1Temp = [")
#Make sure that all dicts in data1 haveimestamp,username and grade and it has time data in it
data1=filter(lambda x:  x.has_key("timestamp") and x['timestamp'].find('2013-04-22')>-1 and x.has_key("question1") and x.has_key("grade") and isinstance(x["grade"],int)  ,allData["Quiz 21"])

#Create timespent attributes for each user in second
def getTimespent(d):
	return float(d["timestamp"][15])*60 + float(d["timestamp"][17:19])
M = getTimespent(max(data1,key=lambda d: d["timestamp"]))+1
m = getTimespent(min(data1,key=lambda d: d["timestamp"]))

# we separate into numTps groups, classified by grade from minG to maxG
def getTimeperiod(t):
	return int(numTps*(t-m)/(M-m))+1
def addAttributes(d):
	l={}
	l['answer']=d['question1']
	# assuming that the starting time is 20.50 and the time will be in yyyy-mm-ddTxx:xx:xx.000Z format
	l['timeperiod'] = getTimeperiod(getTimespent(d))
	l['timespent']= getTimespent(d)
	l['grade']=d['grade']
	return l
data1=map(addAttributes,data1)

#a copy of dataset1Temp in dataset1.js
dataTemp=[]
for i in xrange(minG,maxG+1):
	g.write("\n\t")
	dataTemp.append(filter(lambda d: d['grade']==i,data1))
	g.write(str(filter(lambda d: d['grade']==i,data1)))
	if i!=maxG:
		g.write(",\n")

g.write("]\n\n")

g.write("var dataset1 = [")
for j in xrange(numG):
	g.write("\n\t")
	tempL=[]
	for i in xrange(1,numTps+1):
		tempL.append({"y":reduce(lambda x,d: x+int(d['timeperiod']==i),dataTemp[j],0)})
	g.write(str(tempL))
	if j!=numG-1:
		g.write(",\n")
g.write("]\n")

g.write("var xLabels = "+str([{"starting":math.ceil(m+(x*(M-m))/numTps),"ending":math.ceil(m+((x+1)*(M-m))/numTps)-1} for x in xrange(numTps)]))

f.close()
g.close()