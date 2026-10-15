FROM kalilinux/kali-rolling

# Evitar interações manuais durante a instalação de pacotes
ENV DEBIAN_FRONTEND=noninteractive

# Atualiza os pacotes e instala ferramentas básicas de linha de comando
RUN apt-get update && apt-get install -y \
    curl \
    vim \
    nano \
    git \
    wget \
    man-db \
    cron \
    iputils-ping \
    net-tools \
    htop \
    tree \
    iproute2 \
    dnsutils \
    nmap \
    tshark \
    dnsenum \
    dnsrecon \
    traceroute \
    net-tools \
    inotify-tools \
    libcap2-bin \
    && rm -rf /var/lib/apt/lists/*

RUN setcap -r /usr/lib/nmap/nmap || true

# Define o diretório de trabalho padrão dentro do container
WORKDIR /workspace

# Mantém o container executando para que você possa acessá-lo via exec
CMD ["tail", "-f", "/dev/null"]
