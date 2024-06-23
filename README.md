# Backend do Portfólio

Bem-vindo ao repositório do backend do meu portfólio! Este projeto serve como a API para o front-end do meu portfólio, gerenciando as informações dos meus projetos, experiências de trabalho, e muito mais.

## Tecnologias Utilizadas

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Sequelize](https://sequelize.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Zod](https://zod.dev/)

## Funcionalidades

Este backend fornece APIs para:

- Autenticação de usuários
- Gerenciamento de projetos
- Gerenciamento de experiências de trabalho
- Medidas de segurança contra SSRF (Server-Side Request Forgery)

## Sobre Mim

Estou sempre buscando aprender e me aperfeiçoar, e este backend é uma parte crucial do meu portfólio, refletindo meu compromisso com a segurança e a eficiência no desenvolvimento de software.

## Instruções de Instalação e Execução

Siga os passos abaixo para instalar e executar o backend:

1. Clone o repositório:
    ```sh
    git clone https://github.com/Tiago-Silverio-da-Costa/portfolio-backend.git
    cd portfolio-backend
    ```

2. Instale as dependências:
    ```sh
    npm install
    ```

3. Configure o banco de dados PostgreSQL. Crie um banco de dados e atualize as credenciais no arquivo `.env`:
    ```
    DB_HOST=your_database_host
    DB_USER=your_database_user
    DB_PASS=your_database_password
    DB_NAME=your_database_name
    ```

4. Execute as migrações do banco de dados:
    ```sh
    npx sequelize-cli db:migrate
    ```

5. Execute o servidor em modo de desenvolvimento:
    ```sh
    npm run dev
    ```

## Frontend do Projeto

Para conferir o código do frontend deste projeto, acesse o repositório no GitHub: [portfolio-frontend](https://github.com/Tiago-Silverio-da-Costa/portfolio).
