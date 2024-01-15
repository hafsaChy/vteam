#!/usr/bin/env bash

url="https://docs.google.com/spreadsheets/d/1_jKoQL7XxrL84wKaFRIAOfPw35S-OIxNAEjg8WM8thU/gviz/tq?tqx=out:csv&sheet"


for target in users stations cities scooters receipts; do
    printf "%s\\n" "$target"
    curl --silent "$url=$target" > "$target.csv"
done

ls -l -- *.csv
file -- *.csv