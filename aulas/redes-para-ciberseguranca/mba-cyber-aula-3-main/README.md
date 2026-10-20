# 🌐 MBA USP ESALQ - Aula 3: Redes com Kali Linux

Este repositório contém o material, os desafios e o ambiente de prática da **Aula 3 (Redes de Computadores)** do **MBA da USP ESALQ**.

O objetivo é fornecer um ambiente seguro e isolado para você praticar comandos de rede. Utilizando o Docker, nós subimos contêineres com o Kali Linux, já configurados com as ferramentas usadas na aula, como `ping`, `dig`, `traceroute`, `whois`, `curl`, `nc`, `ss`, `tshark` e `nmap`.

O ambiente tem duas partes:

1. **Kali Linux (`linux`)**: um contêiner com acesso à internet, para os desafios de comandos de rede (descobrir IPs, testar portas, seguir o caminho até um site etc.).
2. **Laboratório fechado (`atacante` e `vitima`)**: dois contêineres numa rede **sem internet**, para praticar reconhecimento com `nmap` sem tocar em máquinas reais.

## 📁 Estrutura do Repositório

```
.
├── Dockerfile                  # Imagem do Kali Linux com as ferramentas da aula
├── docker-compose.yml          # Sobe o contêiner "linux" (Kali com internet)
└── aula-3/
    ├── quiz-teste.html         # Quiz com os desafios da aula (abra no navegador)
    └── laboratorio/
        └── docker-compose.yml  # Sobe o laboratório fechado: "atacante" e "vitima"
```

## 🛠 Pré-requisitos

Para executar este laboratório em sua máquina, primeiro garanta que você possui os seguintes softwares instalados:
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

> Antes de qualquer comando, deixe o **Docker Desktop aberto e rodando**. Se aparecer o erro `Cannot connect to the Docker daemon`, é porque ele ainda não iniciou.

Todos os comandos abaixo devem ser executados num terminal aberto **na pasta raiz do projeto** (onde ficam os arquivos `Dockerfile` e `docker-compose.yml`).

---

## 🐉 Parte 1 — Subir o Kali Linux

> ⚠️ **Fez os laboratórios das aulas anteriores?** O contêiner desta aula também se chama `linux`. Antes de subir este, remova o antigo, senão o `docker compose up` falha com o erro `Conflict. The container name "/linux" is already in use`:

```bash
docker rm -f linux
```
*Os arquivos das aulas anteriores continuam nas pastas do seu computador; só se perde o que foi criado dentro do contêiner, fora de `/workspace`.*

1. **Construa e inicie o contêiner:**
   ```bash
   docker compose up -d --build
   ```
   *`up` indica ao compose para iniciar o serviço.*
   *A flag `-d` (detached) significa que o contêiner vai rodar em segundo plano, liberando seu terminal atual.*
   *A flag `--build` garante que o Docker crie a imagem atualizada mais recente.*
   *Na primeira vez, o download e a instalação das ferramentas podem levar alguns minutos.*

2. **Confira se o contêiner está rodando:**
   ```bash
   docker ps
   ```
   *Deve aparecer um contêiner chamado `linux` com status `Up`.*

3. **Acesse o terminal interativo do Kali Linux:**
   ```bash
   docker exec -it linux bash
   ```
   *Pronto! Note que a linha de comando vai mudar. Agora você é o usuário `root` dentro do seu Linux, operando diretamente na pasta `/workspace` e pronto para praticar!*

4. **Faça um teste rápido de rede:**
   ```bash
   hostname -I
   ping -c 4 google.com
   ```
   *O primeiro mostra o IP do contêiner; o segundo deve receber respostas, pois este contêiner tem acesso à internet.*

### 💡 Dica: Estrutura de Arquivos Compartilhada

Há um volume mapeado: os arquivos da pasta do projeto no seu computador aparecem na pasta `/workspace` dentro do contêiner, e o contrário também é verdadeiro. Sinta-se à vontade para criar scripts no seu editor de código (ex: VSCode) e então executá-los no terminal do Kali.

---

## 🧪 Parte 2 — Subir o Laboratório Fechado (desafio 6)

O laboratório cria dois contêineres, `atacante` e `vitima`, numa rede **isolada** (`internal: true`): eles só enxergam um ao outro e **não alcançam a internet**. A `vitima` sobe dois "sites" (portas `80` e `8000`) e registra os acessos em `/var/log/acesso.log`.

> ⚠️ **Só escaneie a sua própria `vitima`.** Escanear sistemas de terceiros sem autorização pode configurar crime e viola termos de uso.

1. **Construa e inicie o laboratório** (no seu computador, fora de qualquer contêiner):
   ```bash
   docker compose -f aula-3/laboratorio/docker-compose.yml up -d --build
   ```
   *A flag `-f` aponta para o arquivo do laboratório, que fica em outra pasta.*
   *O laboratório usa o mesmo `Dockerfile` do Kali, então se você já fez a Parte 1, o build é rápido.*

2. **Confira se os dois contêineres estão rodando:**
   ```bash
   docker ps
   ```
   *Devem aparecer `atacante` e `vitima` com status `Up`.*

3. **Entre no atacante:**
   ```bash
   docker exec -it atacante bash
   ```

4. **Teste a trava de segurança e descubra o IP da vítima** (dentro do atacante):
   ```bash
   ping -c 2 8.8.8.8
   getent hosts vitima
   ```
   *O `ping` deve **falhar**: é a prova de que a rede está isolada da internet.*
   *O `getent` mostra o IP por trás do nome `vitima`.*

5. **Faça o reconhecimento com `nmap`** (dentro do atacante):
   ```bash
   nmap vitima
   nmap -sV -p 80,8000 vitima
   ```
   *O primeiro lista as portas abertas; o segundo mostra o software e a versão de cada serviço.*

6. **Veja o ataque pelo lado do defensor** (abra **outro terminal** no seu computador):
   ```bash
   docker exec -it vitima bash
   cat /var/log/acesso.log
   ```
   *No log aparecem o IP do atacante e os pedidos típicos do `nmap`, como `GET /nmaplowercheck...`, `GET /HNAP1` e `GET /evox/about`.*

7. **A defesa: feche uma porta** (dentro da vítima) e **escaneie de novo** (dentro do atacante):
   ```bash
   # na vitima: desliga o serviço da porta 8000
   kill $(ss -tlnp | grep ":8000" | grep -o "pid=[0-9]*" | cut -d= -f2)

   # no atacante: a porta 8000 some do resultado
   nmap vitima
   ```
   *Menos portas abertas = menos superfície de ataque.*

---

## 📝 Quiz da Aula

Abra o arquivo [`aula-3/quiz-teste.html`](aula-3/quiz-teste.html) no navegador (duplo clique no arquivo). Tente resolver cada desafio sozinho primeiro e use o botão **"Ver o passo a passo"** para revelar a solução, uma etapa por vez. Os desafios 1 a 5 usam o Kali da Parte 1; o desafio 6 usa o laboratório da Parte 2.

---

## 🧰 Problemas comuns

- **`Conflict. The container name "/linux" is already in use`**: ficou o contêiner de uma aula anterior. Rode `docker rm -f linux` e suba de novo.
- **`Cannot connect to the Docker daemon`**: o Docker Desktop ainda não iniciou. Abra o programa e espere.
- **`traceroute` ou `mtr` só com `* * *` depois do primeiro salto**: pode acontecer no Docker Desktop. Faça o mesmo teste fora do contêiner: `tracert www.nba.com` no Prompt de Comando do Windows ou `traceroute www.nba.com` no Terminal do Mac.
- **Desafio 2: o `ss -tn` não mostra `ESTAB`**: o servidor pode ter encerrado a conexão parada. Deixe o segundo terminal aberto, rode o `nc` de novo e o `ss -tn` logo em seguida.
- **Desafio 5: a página não abre no navegador do computador**: é o esperado. A porta do contêiner não é publicada; acesse com `curl`, dentro do Kali.

---

## 🛑 Como Finalizar o Ambiente

1. Para sair de dentro de qualquer contêiner e voltar ao terminal da sua máquina:
   ```bash
   exit
   ```

2. Para desligar o **Kali Linux** (Parte 1):
   ```bash
   docker compose down
   ```

3. Para desligar o **laboratório** (Parte 2):
   ```bash
   docker compose -f aula-3/laboratorio/docker-compose.yml down
   ```
   *Ao subir o laboratório de novo, a porta 8000 da vítima volta a ficar aberta.*

---
*Bom estudo e excelente aula no MBA USP ESALQ!*
