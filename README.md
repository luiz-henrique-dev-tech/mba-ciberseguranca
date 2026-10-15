# 🛡️ MBA em Cibersegurança da USP/Esalq

![Status](https://img.shields.io/badge/status-em%20andamento-brightgreen)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)
![Linux](https://img.shields.io/badge/Linux-FCC624?logo=linux&logoColor=black)
![License](https://img.shields.io/badge/license-educational-blue)

Repositório com o material, atividades e laboratórios práticos desenvolvidos ao longo do **MBA em Cibersegurança da USP/Esalq**. Cada módulo do curso vira uma pasta própria, com seus exercícios, materiais de apoio e, quando aplicável, um ambiente Docker pronto para praticar sem bagunçar a máquina local.

## 📖 Sobre o curso

O MBA em Cibersegurança da USP/Esalq aborda fundamentos e práticas avançadas de segurança da informação, cobrindo desde fundamentos de sistemas operacionais e redes até temas como resposta a incidentes, governança e segurança ofensiva/defensiva. Este repositório documenta minha jornada e as entregas práticas do curso.

## 🗂️ Estrutura do repositório

```
mba-ciberseguranca/
└── aulas/
    └── fundamentos-linux/
        └── mba-cyber-aula_1/
            ├── atividades/        # Exercícios práticos da aula
            ├── material/          # Material de apoio (HTML, quiz, referências)
            ├── Dockerfile         # Ambiente Kali Linux containerizado
            └── docker-compose.yml
```

À medida que novas aulas forem cursadas, novas pastas serão adicionadas dentro de `aulas/`, seguindo o padrão `tema-da-aula/`.

## 📚 Módulos

| Módulo | Tema | Ambiente | Status |
|---|---|---|---|
| 1 | [Fundamentos de Linux](aulas/fundamentos-linux/mba-cyber-aula_1/README.md) | Docker (Kali Linux) | ✅ Concluído |

## 🚀 Como usar

Cada módulo é independente e possui seu próprio `README.md` com instruções específicas. De modo geral:

```bash
git clone https://github.com/luiz-henrique-dev-tech/mba-ciberseguranca.git
cd mba-ciberseguranca/aulas/<modulo-desejado>
```

Em seguida, siga o `README.md` daquele módulo... a maioria dos laboratórios sobe com:

```bash
docker-compose up -d --build
```

## 🧰 Tecnologias utilizadas

- **Docker / Docker Compose** >> ambientes isolados e reprodutíveis para cada laboratório
- **Linux (Kali Linux)** >> sistema operacional base dos exercícios práticos
- **Git/GitHub** >> versionamento e organização do material

## 👤 Autor

**Luiz Henrique**
[GitHub](https://github.com/luiz-henrique-dev-tech)

## 📄 Licença

Conteúdo produzido para fins educacionais no âmbito do MBA USP/Esalq. Sinta-se à vontade para usar como referência de estudo.

---
*Repositório atualizado conforme avanço no curso.*
