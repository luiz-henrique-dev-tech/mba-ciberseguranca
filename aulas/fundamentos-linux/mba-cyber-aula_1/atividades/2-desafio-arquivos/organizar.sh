#!/bin/bash

cd /workspace/atividades/2-desafio-arquivos

mkdir -p  PDFs PNGs CSVs

for arquivo in*; do
	if [ -f  "$arquivo" ]; then extensao="${arquivo##*.}" pasta="${extensao^^}s"
		mkdir -p "$pasta"
		mv "$arquivo" "$pasta/"
	fi
done
