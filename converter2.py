f=open('allDatasets.json','r')
g=open('dataAll.js','w')

#parse string to allData object
allData=eval(f.read())

#Make sure that all dicts in data1 haveimestamp,username and grade and it has time data in it
startingT=0;
def getTimespent(d):
	return float(d["timestamp"][14])*600+float(d["timestamp"][15])*60 + float(d["timestamp"][17:19])-startingT

def addAttributes(d):
	l={}
	# assuming that the starting time is xx.00.00 and the time will be in yyyy-mm-ddTxx:xx:xx.000Z format
	l['timespent']= getTimespent(d)
	l['grade']=d['grade']
	return l

dataAll=["ph"]
for i in range(5):
	dataAll.append(map(addAttributes,filter(lambda x:  x.has_key("timestamp") and x['timestamp'].find('2013')>-1 and x.has_key("question1") and x.has_key("grade") and isinstance(x["grade"],int)  ,allData["Quiz "+str(22+i)])))

g.write("var dataAll = ")
# for scatter plot
g.write(str(dataAll))
g.write(";\n")
print dataAll[4]