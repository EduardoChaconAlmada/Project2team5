import numpy as np
from numpy.core.fromnumeric import reshape
import pandas as pd

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session, session
from sqlalchemy import create_engine, func


from flask import Flask, jsonify

#################################################
# Database Setup
#################################################
app = Flask(__name__)
DATABASE_URI = 'postgres+psycopg2://dbmasteruser:Team5-2021@ls-9dc0a19195512b796216f97c13965ecf3207dea1.cqt5opbeh6hz.us-east-1.rds.amazonaws.com:5432/postgres'
engine = sqlalchemy.create_engine(DATABASE_URI)


@app.route("/")
def home():
    return(
        "Hello"
    )


@app.route("/about")
def about():
    data = engine.execute(
        "SELECT cultivo, SUM(valorproduccion) FROM agr2017 GROUP BY cultivo LIMIT 20")
    #df = pd.read_sql_query(query, engine)
    # return df[['cultivo', 'sum']].to_dict()
    all_data = []
    for record in data:
        data_dict = {}
        data_dict['cultivo'] = record[0]
        data_dict['sum'] = record[1]
        all_data.append(data_dict)
    return jsonify(all_data)


@app.route("/estado")
def estado():
    data = engine.execute(
        "SELECT estado, cultivo, SUM(valorproduccion) FROM agr2017 GROUP BY estado, cultivo;")
    all_data = []
    for record in data:
        data_dict = {}
        data_dict['estado'] = record[0]
        data_dict['cultivo'] = record[1]
        data_dict['sum'] = record[2]
        all_data.append(data_dict)
    return jsonify(all_data)


@app.route("/mapa")
def mapa():
    data = engine.execute(
        "SELECT estado, municipio, cultivo, SUM(valorproduccion), AVG(latitud), AVG(longitud), MAX(altitud) FROM agr2017 GROUP BY estado, municipio , cultivo;")
    all_data = []
    for record in data:
        data_dict = {}
        data_dict['estado'] = record[0]
        data_dict['municipio'] = record[1]
        data_dict['cultivo'] = record[2]
        data_dict['sum'] = record[3]
        data_dict['lat'] = record[4]
        data_dict['lng'] = record[5]
        data_dict['alt'] = record[6]
        all_data.append(data_dict)
    return jsonify(all_data)


if __name__ == '__main__':
    app.run(debug=True)
