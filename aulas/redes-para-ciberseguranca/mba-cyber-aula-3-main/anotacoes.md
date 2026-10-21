# 📒 Anotações da aula 3: Redes para Cibersegurança I

> Notas pessoais feitas durante a aula. Instruções de como subir o ambiente estão no [`README.md`](README.md) desta pasta.

## Resumo da aula

1. **DNS**: descobrir o endereço do site
2. **TCP/IP**: abrir uma conversa com o servidor
3. **Roteadores**: atravessar o caminho até ele
4. **HTTP e HTTPS**: pedir a página, com segurança
5. **Cliente-servidor**: entender quem pede e quem responde

---

## 1. DNS: descobrir o endereço do site

- 🔗 [submarinecablemap.com](https://www.submarinecablemap.com/): site pra ver o fluxo dos cabos de rede ao redor do mundo.

**Dentro do contêiner:**
- `/etc/` → pasta que sempre guarda as configurações que o sistema está usando.
- `/etc/resolv.conf` → arquivo responsável por guardar os IPs dos servidores DNS.
- Todo IP que começa com `127` é a própria máquina local (loopback).

**Comandos:**

```bash
host www.nba.com             # mostra o(s) endereço(s) IP do site
nslookup www.nba.com         # mostra os alias (CNAMEs) usados e os IPs
dig +short www.nba.com       # versão resumida ("domain information groper")
dig +short AAAA www.nba.com  # versão resumida, mas pedindo o endereço IPv6 (AAAA)
```

**Resultado do `host www.nba.com`** (reconferido, saída real):
```
www.nba.com is an alias for www.nba.com-v1.edgekey.net.
www.nba.com-v1.edgekey.net is an alias for e8017.dscb.akamaiedge.net.
e8017.dscb.akamaiedge.net has address 23.201.217.31
```
- A Akamai é uma cloud americana que guarda cópias do site da NBA, isso é o que torna `edgekey.net`/`akamaiedge.net` visível na cadeia de nomes.
- **CDN** (Content Delivery Network) = rede de distribuição de conteúdo: são as cópias do site espalhadas pelo mundo que a gente acaba acessando.
- `dig +short AAAA www.nba.com` volta vazio: o `www.nba.com` não publica endereço IPv6 (ainda só funciona por IPv4).

**Cadeia de nomes (CNAME → A):**
```
www.nba.com                    → CNAME
www.nba.com-v1.edgekey.net     → CNAME
e8017.dscb.akamaiedge.net      → Endereço (A)
23.201.217.31                  → IP final
```

> ⚠️ **Correção:** a versão original dessa nota tinha a pasta como `/workflow/etc`. Conferi dentro do contêiner e o caminho certo é só `/etc` (pasta padrão do Linux, não fica dentro de `/workspace`). O `/workspace` é só a pasta do projeto montada no contêiner; o `/etc` é do sistema operacional.

> 💡 Dois comandos do material do professor que não chegamos a anotar, mas valem explorar: `dig +trace www.nba.com` (mostra a consulta subindo por cada servidor DNS até achar a resposta) e o conceito de **TTL** (tempo que a resposta do DNS fica guardada em cache antes de ser consultada de novo).

---

## 2. TCP/IP: abrir uma conversa com o servidor

- **IP** (Internet Protocol) → endereça e entrega cada pacote.
- **TCP** (Transmission Control Protocol) → confere a ordem dos pacotes e reenvia o que se perdeu.
- **Porta** → o "apartamento" dentro do endereço: `443` HTTPS, `80` HTTP, `53` DNS, `22` SSH.

```bash
hostname -I               # mostra o IP da própria máquina/contêiner
ping -c 4 www.nba.com     # envia 4 pacotes de teste e mostra quantos voltaram

nc -4 -zv -w 3 www.nba.com 443
# nc    → abre a conexão de um lado pro outro
# -4    → usa só IPv4
# -zv   → só testa a porta (sem mandar dado) e mostra o resultado na tela
# -w 3  → timeout de 3 segundos

ss -tn                     # lista as conexões TCP ativas da máquina
```

> **HTTP + TLS = base técnica do HTTPS.** TLS (Transport Layer Security) é a camada de criptografia que, somada ao HTTP, resulta no HTTP protegido por criptografia.

---

## 3. Roteadores: atravessar o caminho até ele

- **Roteador** liga redes entre si.
- **Gateway** = o primeiro roteador no caminho.
- Cada entrega de um roteador ao próximo é um **salto (hop)**.

```
Casa (roteador Wi-Fi) >> Provedor (Vivo, Claro) >> Redes internacionais >> Akamai (CDN da NBA)
```

- **Ponto de troca de tráfego no Brasil:** [ix.br](https://ix.br)

**Descobrindo o próprio gateway:**

```bash
ip r
# default via 172.23.0.1 dev eth0    → esse é o gateway

ip neigh
# lista as máquinas da rede com quem o Kali "conversou" recentemente
# STALE = a informação não é tão recente
```

**Seguindo o caminho até o destino:**

```bash
traceroute -m 15 www.nba.com
```

> 📌 Ver [troubleshooting do traceroute no Docker](#️-troubleshooting-traceroute-no-docker), no fim deste arquivo.

> ⚠️ **Pendência:** o objetivo da aula era descobrir três coisas: o meu gateway, os roteadores até a NBA e o dono da rede do site. Só os dois primeiros ficaram anotados. O comando que faltou é o `whois`, que consulta quem é o dono (a organização registrante) de um IP ou domínio, por exemplo `whois 23.201.217.31 | grep -i orgname`. O material do professor também cita o `mtr`, que é um traceroute contínuo (repete os saltos em loop e mostra a taxa de perda de cada um ao vivo).

---

## 4. HTTP e HTTPS: pedir a página, com segurança

**HTTP** é a "língua" da web (arquitetura cliente-servidor).

**Códigos de status:**

| Código | Significado |
|---|---|
| 200 | deu bom |
| 301 | endereço mudou |
| 403 | servidor recusou |
| 404 | página não existe |
| 500 | erro no servidor |

- 🐱 [http.cat](https://http.cat/): cada código com um gato
- 🐶 [http.dog](https://http.dog/): cada código com um cachorro
- ⭐ Vale a pena estudar as **categorias** de status (2xx, 3xx, 4xx, 5xx), ajudam a entender rápido o que aconteceu numa requisição.

**HTTPS = HTTP + cadeado.** Sem criptografia (HTTP puro), dava pra ver o conteúdo de um pacote fragmentado; o HTTPS garante que o site é quem diz ser e que a conversa com o servidor é criptografada.

```bash
curl www.nba.com                             # acessa a página inteira
curl -I www.nba.com                          # acessa só o cabeçalho (headers) da resposta
curl -I -A "Mozilla/5.0" www.nba.com         # acessa se passando por um navegador (User-Agent)
curl -I -A "Mozilla/5.0" https://www.nba.com # mesma coisa, mas via HTTPS
```

Sem `User-Agent` de navegador, `www.nba.com` devolveu `403 Forbidden`; com `-A "Mozilla/5.0"` via HTTP devolveu `301 Moved Permanently` (redireciona pra HTTPS); e via HTTPS devolveu `HTTP/2 200` (deu bom).

**Cabeçalhos vistos no `curl -I www.nba.com`** (reconferidos, com o significado de cada um):

| Cabeçalho | O que significa |
|---|---|
| `Mime-Version: 1.0` | versão do padrão MIME usado pra descrever o tipo de conteúdo, cabeçalho antigo, hoje meio redundante com o `Content-Type` |
| `Content-Type: text/html` | tipo de mídia do corpo da resposta, aqui diz que é uma página HTML |
| `Content-Length: 363` | tamanho do corpo da resposta, em bytes |
| `Expires` | data a partir da qual a resposta deve ser considerada velha pra fins de cache |
| `Date` | data e hora em que o servidor gerou essa resposta |
| `Connection: close` | avisa que o servidor vai fechar a conexão TCP depois dessa resposta, sem manter aberta pra próxima requisição |
| `X-Frame-Options: sameorigin` | impede que a página seja carregada dentro de um `<iframe>` de outro site, proteção contra clickjacking |
| `X-XSS-Protection: 1; mode=block` | liga um filtro antigo do navegador contra ataques de XSS refletido, hoje foi substituído pelo `Content-Security-Policy` |
| `X-Content-Type-Options: nosniff` | impede que o navegador tente "adivinhar" o tipo real do conteúdo, evitando MIME sniffing usado em alguns ataques |

> 💡 Material complementar do professor: `curl -v https://www.nba.com` mostra, além dos cabeçalhos, o handshake TLS e o certificado digital do site (quem emitiu, validade), que é o que garante que o `https://` não é só um cadeado de mentira.

---

## 5. Cliente-servidor: entender quem pede e quem responde

Estrutura criada para a prática:

```
.
├── Dockerfile
├── README.md
├── docker-compose.yml
└── aula-3/
    ├── quiz-teste.html
    ├── laboratorio/
    │   └── docker-compose.yml
    └── pratica/
        └── meu-site/
            └── index.html
```

**Subindo um servidor HTTP simples dentro do contêiner:**

```bash
python3 --version              # Python 3.14.8
python3 -m http.server 8000    # sobe um servidor na porta 8000, servindo a pasta atual
```

Saída:
```
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
127.0.0.1 - - [21/Oct/2026 01:21:30] "GET / HTTP/1.1" 200 -
```

> 💡 Material complementar do professor: `ss -tuln` lista as portas que a própria máquina está escutando (o `-u` inclui UDP, além do TCP) e `nc -l 8000` sobe um servidor cru na porta 8000. Com ele, dá pra ver a requisição HTTP exatamente como o navegador manda, cabeçalho por cabeçalho, sem nenhum servidor web interpretando nada.

---

## 🧪 Laboratório (atacante x vítima)

> ⚠️ Só escanear a própria `vitima`. Escanear sistemas de terceiros sem autorização é crime.

```bash
docker compose -f aula-3/laboratorio/docker-compose.yml up -d --build
docker ps
docker exec -it atacante bash

ping -c 2 8.8.8.8        # deve falhar, rede isolada, sem internet
getent hosts vitima      # descobre o IP da vítima
```

**Reconhecimento com `nmap`:**

```bash
nmap vitima
```
```
Nmap scan report for vitima (172.24.0.2)     # confirma a vítima
Host is up (0.000038s latency).
Not shown: 998 closed tcp ports (reset)      # 998 portas: ninguém atendeu
PORT     STATE SERVICE
80/tcp   open  http
8000/tcp open  http-alt
```

```bash
nmap -sV -p 80,8000 vitima
```
- `nmap` (**n**etwork **map**per) → ferramenta de reconhecimento de rede: descobre hosts ativos e portas abertas.
- a família de flags `-s*` define o **tipo de escaneamento** (`-sS` escaneamento SYN, não completa o aperto de mão TCP, mais discreto; `-sT` conexão TCP completa). O escaneamento simples (`nmap vitima`, sem flag de tipo) já usa um desses por padrão.
- `-sV` → não é escaneamento de porta, é detecção de versão: tenta descobrir qual software e qual versão está rodando em cada porta aberta.
- `-p 80,8000` → limita o escaneamento a essas portas específicas, em vez das ~1000 portas mais comuns que o `nmap` varre por padrão.

Resultado:
```
80/tcp   open  http  SimpleHTTPServer 0.6 (Python 3.14.8)
8000/tcp open  http  SimpleHTTPServer 0.6 (Python 3.14.8)
```

> 💡 Com a versão exata do serviço em mãos, o próximo passo seria pesquisar `"SimpleHTTPServer 0.6 vulnerability"` ou `"python 3.14.8 falhas ou vulnerabilidades"`. É assim que um reconhecimento vira o ponto de partida pra buscar uma vulnerabilidade conhecida.

---

## 🛠️ Troubleshooting: traceroute no Docker

Rodando `traceroute -m 15 www.nba.com` de dentro do contêiner Kali no Docker Desktop (Windows), o resultado veio só com `* * *` em quase todos os saltos. Causa: o tráfego passa por várias camadas de NAT (contêiner → rede do Docker → WSL2 → Windows → rede real), e as respostas ICMP de "Time Exceeded" (que o traceroute usa pra descobrir cada salto) se perdem no meio do caminho.

**Alternativas que funcionaram dentro do contêiner:**

```bash
traceroute -I -m 15 www.nba.com          # modo ICMP, menos bloqueado que o padrão (UDP)
traceroute -T -p 443 -m 15 www.nba.com   # modo TCP, na porta 443 (HTTPS)
```

Ou, pra ver a rota completa com todos os saltos: rodar o traceroute **fora** do contêiner, direto no sistema operacional:

```powershell
tracert -h 15 www.nba.com     # Windows (PowerShell / Prompt de Comando)
```
```bash
traceroute www.nba.com        # Mac / Linux
```

---

## 📚 Material extra do professor

- [Aula 3, material HTML completo](https://guilhermeonrails.github.io/aula-3-html/#p1-historia)

A página segue a mesma viagem dos 5 tópicos acima (DNS, TCP/IP, roteadores, HTTP/HTTPS, cliente-servidor), mais um laboratório final, só que com alguns comandos extras que não chegaram a entrar nessa anotação: `dig +trace`, TTL de cache, `whois`, `mtr`, `curl -v` (certificado TLS), `ss -tuln` e `nc -l` (servidor cru pra ver a requisição HTTP bruta). Os destaques de cada um já foram marcados como "material complementar" nas seções correspondentes acima.
