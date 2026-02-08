-- ============================================================================
-- MIGRAÇÃO: Adicionar relação entre utilizadores e funcionarios
-- ============================================================================

-- 1. Adicionar campo utilizador_id na tabela funcionarios
ALTER TABLE funcionarios
ADD COLUMN utilizador_id BIGINT UNSIGNED NULL
AFTER id,
ADD UNIQUE KEY funcionarios_utilizador_id_unique (utilizador_id),
ADD KEY funcionarios_utilizador_id_index (utilizador_id),
ADD CONSTRAINT funcionarios_utilizador_id_foreign FOREIGN KEY (utilizador_id) REFERENCES utilizadores (id) ON DELETE CASCADE ON UPDATE NO ACTION;

-- 2. Popular departamentos (setores hospitalares)
INSERT INTO
    departamentos (
        nome,
        sigla,
        tipo,
        descricao,
        activo
    )
VALUES (
        'Direção Geral',
        'DG',
        'ADMINISTRATIVO',
        'Direção Geral do Hospital - Acesso total ao sistema',
        true
    ),
    (
        'Direção Clínica',
        'DC',
        'CLINICO',
        'Coordenação médica e gestão clínica',
        true
    ),
    (
        'Serviço de Bloco Operatório / Sala de Cirurgia',
        'SBU_SC',
        'CLINICO',
        'Bloco operatório e salas cirúrgicas',
        true
    ),
    (
        'Serviço de Consultas Externas',
        'SCE',
        'CLINICO',
        'Atendimento ambulatorial e consultas',
        true
    ),
    (
        'Serviço Médico',
        'SM',
        'CLINICO',
        'Serviço médico geral',
        true
    ),
    (
        'Serviço de Enfermagem',
        'SE',
        'ENFERMAGEM',
        'Coordenação de enfermagem e cuidados',
        true
    ),
    (
        'Serviço de Farmácia',
        'SF',
        'FARMACIA',
        'Gestão farmacêutica e dispensação',
        true
    ),
    (
        'Banco de Órgãos',
        'BO',
        'CLINICO',
        'Gestão de banco de órgãos',
        true
    ),
    (
        'Serviço de Laboratório',
        'SL',
        'DIAGNOSTICO',
        'Análises clínicas e laboratoriais',
        true
    ),
    (
        'Serviço de Estomatologia e Saúde Oral',
        'SESH',
        'CLINICO',
        'Odontologia e saúde oral',
        true
    ),
    (
        'Departamento de Psicologia Clínica',
        'DPC',
        'CLINICO',
        'Atendimento psicológico',
        true
    ),
    (
        'Departamento de Psiquiatria Geral',
        'DPG',
        'CLINICO',
        'Psiquiatria e saúde mental',
        true
    ),
    (
        'Departamento de Fisioterapia',
        'DFP',
        'CLINICO',
        'Fisioterapia e reabilitação',
        true
    ),
    (
        'Departamento de Estética',
        'DE',
        'CLINICO',
        'Procedimentos estéticos',
        true
    ),
    (
        'Serviço de Almoxarifado',
        'SA',
        'LOGISTICA',
        'Gestão de stock e materiais',
        true
    ),
    (
        'Serviço de Internamento',
        'SI',
        'CLINICO',
        'Gestão de internamentos e leitos',
        true
    ),
    (
        'Departamento Administrativo',
        'DA',
        'ADMINISTRATIVO',
        'Administração geral',
        true
    ),
    (
        'Recursos Humanos',
        'RH',
        'ADMINISTRATIVO',
        'Gestão de pessoal',
        true
    ),
    (
        'Direção Geral de TI',
        'DGITI',
        'TECNOLOGIA',
        'Tecnologia da informação',
        true
    ),
    (
        'Direção Geral Financeira',
        'DGF',
        'FINANCEIRO',
        'Gestão financeira',
        true
    ),
    (
        'Casa Mortuária',
        'CM',
        'APOIO',
        'Serviço de morgue',
        true
    ),
    (
        'Serviços Gerais',
        'SG',
        'APOIO',
        'Manutenção e serviços gerais',
        true
    );

-- 3. Criar funcionário para o utilizador admin existente (Direção Geral)
INSERT INTO
    funcionarios (
        utilizador_id,
        nomeCompleto,
        numeroMecanografico,
        cargo,
        departamentoId,
        nivelAcesso,
        emailInstitucional,
        status,
        dataAdmissao
    )
SELECT u.id, u.name, 'ADM-001', 'Administrador do Sistema', (
        SELECT id
        FROM departamentos
        WHERE
            sigla = 'DG'
        LIMIT 1
    ), 'SUPER_ADMIN', u.email, 'ACTIVO', NOW()
FROM utilizadores u
WHERE
    u.username = 'admin'
LIMIT 1;

-- 4. Adicionar campo codigo na tabela departamentos (para facilitar identificação)
ALTER TABLE departamentos
ADD COLUMN codigo VARCHAR(20) NULL
AFTER id;

-- 5. Atualizar códigos dos departamentos
UPDATE departamentos SET codigo = 'DG' WHERE sigla = 'DG';

UPDATE departamentos SET codigo = 'DC' WHERE sigla = 'DC';

UPDATE departamentos SET codigo = 'SBU_SC' WHERE sigla = 'SBU_SC';

UPDATE departamentos SET codigo = 'SCE' WHERE sigla = 'SCE';

UPDATE departamentos SET codigo = 'SM' WHERE sigla = 'SM';

UPDATE departamentos SET codigo = 'SE' WHERE sigla = 'SE';

UPDATE departamentos SET codigo = 'SF' WHERE sigla = 'SF';

UPDATE departamentos SET codigo = 'BO' WHERE sigla = 'BO';

UPDATE departamentos SET codigo = 'SL' WHERE sigla = 'SL';

UPDATE departamentos SET codigo = 'SESH' WHERE sigla = 'SESH';

UPDATE departamentos SET codigo = 'DPC' WHERE sigla = 'DPC';

UPDATE departamentos SET codigo = 'DPG' WHERE sigla = 'DPG';

UPDATE departamentos SET codigo = 'DFP' WHERE sigla = 'DFP';

UPDATE departamentos SET codigo = 'DE' WHERE sigla = 'DE';

UPDATE departamentos SET codigo = 'SA' WHERE sigla = 'SA';

UPDATE departamentos SET codigo = 'SI' WHERE sigla = 'SI';

UPDATE departamentos SET codigo = 'DA' WHERE sigla = 'DA';

UPDATE departamentos SET codigo = 'RH' WHERE sigla = 'RH';

UPDATE departamentos SET codigo = 'DGITI' WHERE sigla = 'DGITI';

UPDATE departamentos SET codigo = 'DGF' WHERE sigla = 'DGF';

UPDATE departamentos SET codigo = 'CM' WHERE sigla = 'CM';

UPDATE departamentos SET codigo = 'SG' WHERE sigla = 'SG';

-- 6. Tornar o campo codigo obrigatório e único
ALTER TABLE departamentos MODIFY COLUMN codigo VARCHAR(20) NOT NULL,
ADD UNIQUE KEY departamentos_codigo_unique (codigo);