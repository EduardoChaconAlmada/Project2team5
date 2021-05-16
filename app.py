import numpy as np
import pandas as pd

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func


from flask import Flask, jsonify

#################################################
# Database Setup
#################################################
app = Flask(__name__)
DATABASE_URI = 'postgres+psycopg2://postgres:postgres@localhost:5432/Agriculture_JB'

engine = sqlalchemy.create_engine(DATABASE_URI)


@app.route("/")
def home():
    return(
        "Hello"
    )


@app.route("/about")
def about():
    query = f"SELECT DISTINCT(municipio) FROM agr2017"
    df = pd.read_sql_query(query, engine)
    return df['municipio'].to_dict()


if __name__ == '__main__':
    app.run(debug=True)
