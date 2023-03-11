import numpy as np
import datetime as dt
import pickle
import os
from flask import Flask, render_template,make_response


# Initalize Flask
app = Flask(__name__)

SITE_ROOT = os.path.realpath(os.path.dirname(__file__))
rfcl_model_url = os.path.join(SITE_ROOT, "static/models", "rfcl.pkl")
dtcl_model_url = os.path.join(SITE_ROOT, "static/models", "dtcl.pkl")

rfmodel = pickle.load(open(rfcl_model_url, 'rb'))
# dtmodel = pickle.load(open(dtcl_model_url,'rb'))

# prediction function
def ValuePredictor(to_predict_list):
    to_predict = np.array(to_predict_list).reshape(1, 12)
    result = rfmodel.predict(to_predict)
    return result[0]

@app.route('/') # Homepage
def home():
    return render_template('index.html')
 
@app.route('/result', methods = ['POST'])
def result():
    if request.method == 'POST':
        to_predict_list = request.form.to_dict()
        to_predict_list = list(to_predict_list.values())
        to_predict_list = list(map(int, to_predict_list))
        result = ValuePredictor(to_predict_list)       
        if int(result)== 1:
            prediction ='Probable Heart Disease '
        else:
            prediction ='Heart Disease improbable'
        return render_template("index.html", prediction = prediction)

if __name__ == '__main__':
    app.run(debug=True, port=5009)