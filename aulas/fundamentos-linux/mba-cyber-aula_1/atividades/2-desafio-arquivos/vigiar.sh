#!/bin/bash

pasta=/workspace/atividades/2-desafio-arquivos/

echo "Vigiando a pasta $pasta (pressione control+C para sair)"

inotifywait -m -e create -e moved_from "$pasta"
	while read evento; do
		echo "Evento: $evento"
		/workspace/atividades/2-desafio-arquivos/organizar.sh
	done
