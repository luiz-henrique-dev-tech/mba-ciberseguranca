# 🌐 MBA USP ESALQ - Fundamentos do Kali Linux

Este repositório contém todo o material, desafios e o ambiente de prática para a aula de **Linux** do **MBA da USP ESALQ**.

O objetivo deste laboratório é fornecer um ambiente seguro e isolado para você praticar comandos Linux. Utilizando o Docker, nós subimos um contêiner com o Kali Linux, já configurado com as principais ferramentas de linha de comando como `vim`, `nano`, `git`, `curl`, `wget`, `htop` e `tree`.

## 📁 Estrutura do Repositório

O repositório está dividido nas seguintes pastas principais:

- **`atividades/`**: Contém os roteiros e desafios práticos da aula.
  - `1-primeiros-arquivos/`: Exercícios iniciais de manipulação de arquivos e diretórios.
  - `2-desafio-arquivos/`: Desafio prático focado em permissões e manipulação avançada.
  - `3-desafio-inotify/`: Desafio sobre monitoramento de eventos de arquivos no Linux (inotify).
  - `4-logs/`: Atividade focada em leitura, manipulação e extração de informações de logs de sistema.

- **`material/`**: Material de apoio teórico e de consulta.
  - `comandos-linux.html`: Guia de referência rápida dos principais comandos.
  - `permissoes.html`: Documentação sobre o sistema de permissões de arquivos no Linux.
  - `quiz/`: Teste de conhecimentos básicos sobre o ambiente.

## 🛠 Pré-requisitos

Para executar este laboratório em sua máquina, primeiro garanta que você possui os seguintes softwares instalados:
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## 🚀 Como Subir e Acessar o Projeto

Siga os passos abaixo, abrindo um terminal ou prompt de comando diretamente na pasta onde você descompactou/clonou este projeto (onde ficam os arquivos `Dockerfile` e `docker-compose.yml`):

1. **Construa e inicie o ambiente (contêiner):**
   ```bash
   docker-compose up -d --build
   ```
   *`up` indica ao compose para iniciar o serviço.*
   *A flag `-d` (detached) significa que o contêiner vai rodar em segundo plano, liberando seu terminal atual.*
   *A flag `--build` garante que o Docker crie a imagem atualizada mais recente.*

2. **Acesse o terminal interativo do Kali Linux:**
   Para começar a digitar seus comandos no seu ambiente Linux recém-criado, execute:
   ```bash
   docker exec -it linux bash
   ```
   *Pronto! Note que a linha de comando vai mudar. Agora você é o usuário `root` dentro do seu Linux, operando diretamente na pasta `/workspace` e pronto para praticar!*

### 💡 Dica: Estrutura de Arquivos Compartilhada

É importante notar que há um volume mapeado: os arquivos da pasta atual do seu computador são visualizados na pasta `/workspace` dentro do contêiner Linux, e o contrário também é verdadeiro. Sinta-se à vontade para criar scripts no seu editor de código padrão da sua máquina (ex: VSCode) e então testá-los e executá-los no terminal interativo.

## 🛑 Como Finalizar o Ambiente

1. Quando tiver de fato concluído seus testes e estudos no terminal do contêiner, basta digitar:
   ```bash
   exit
   ```
   *(Isso o removerá de dentro do contêiner voltando ao terminal padrão da sua máquina).*

2. Para encerrar o serviço e desligar o ambiente adequadamente (liberando memória do sistema), digite:
   ```bash
   docker-compose down
   ```

---
*Bom estudo e excelente aula no MBA USP ESALQ!*
