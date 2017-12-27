# -*- coding: utf-8 -*-
"""
Created on Thu Oct 26 16:54:56 2017

@author: VARUN
"""

from flask import Flask, render_template, jsonify,request
from pprint import pprint
import simplejson as json
import sys 
from nltk.corpus import brown
from nltk.corpus import reuters
import nltk
from nltk.corpus import PlaintextCorpusReader


def get_trigram_freq(tokens):
    tgs = list(nltk.trigrams(tokens))

    a,b,c = list(zip(*tgs))
    bgs = list(zip(a,b))
    return nltk.ConditionalFreqDist(list(zip(bgs, c)))

def get_bigram_freq(tokens):
    bgs = list(nltk.bigrams(tokens))

    return nltk.ConditionalFreqDist(bgs)

def appendwithcheck (preds, to_append):
    for pred in preds:
        if pred[0] == to_append[0]:
            return
    preds.append(to_append)

def incomplete_pred(words, n):
    all_succeeding = bgs_freq[(words[n-2])].most_common()
    #print (all_succeeding, file=sys.stderr)
    preds = []
    number=0
    for pred in all_succeeding:
        if pred[0].startswith(words[n-1]):
            appendwithcheck(preds, pred)
            number+=1
        if number==3:
            return preds
    if len(preds)<3:
        med=[]
        for pred in all_succeeding:
            med.append((pred[0], nltk.edit_distance(pred[0],words[n-1], transpositions=True)))
        med.sort(key=lambda x:x[1])
        index=0
        while len(preds)<3:
            print (index, len(med))
            if index<len(med):
                if med[index][1]>0:
                    appendwithcheck(preds, med[index])
                index+=1
            if index>=len(preds):
                return preds

    return preds

app = Flask(__name__)
new_corpus = PlaintextCorpusReader('./','.*')

#tokens = nltk.word_tokenize(raw)
tokens = brown.words() + new_corpus.words('my_corpus.txt')
#tokens = reuters.words()

#compute frequency distribution for all the bigrams and trigrams in the text
bgs_freq = get_bigram_freq(tokens)
tgs_freq = get_trigram_freq(tokens)


@app.route("/test")
def output():
      return render_template("index.html")


@app.route('/output', methods=['GET'])
def worker():
    #print(request, file=sys.stderr)
    string = request.args.get('string')
    work = request.args.get('work')
    words=string.split()
    #print(words, file=sys.stderr)
    n=len(words)
    if work=='pred':
        if n==1:
            #print (bgs_freq[(string)].most_common(5),file=sys.stderr)

            return json.dumps(bgs_freq[(string)].most_common(5))
          
        elif n>1:
            #print (tgs_freq[(words[n-2],words[n-1])].most_common(5),file=sys.stderr)

            return json.dumps(tgs_freq[(words[n-2],words[n-1])].most_common(5))
    else:
        return json.dumps(incomplete_pred(words, n))

     
if __name__=="__main__":
    app.run()
