CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255),
    cpf VARCHAR(11),
    data_nascimento DATE,
    telefone VARCHAR(15),
    email VARCHAR(255),
    senha VARCHAR(255)
);

CREATE TABLE contas (
    id SERIAL PRIMARY KEY,
    numero text,
    saldo DECIMAL(10, 2),
    usuario_id INT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);