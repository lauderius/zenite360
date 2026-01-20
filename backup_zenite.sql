-- MySQL dump 10.13  Distrib 8.0.44, for Linux (x86_64)
--
-- Host: localhost    Database: Hospital360_Ultra
-- ------------------------------------------------------
-- Server version	8.0.44-0ubuntu0.24.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `agendamentos`
--

DROP TABLE IF EXISTS `agendamentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `agendamentos` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `paciente_id` bigint unsigned NOT NULL,
  `medico_id` bigint unsigned NOT NULL,
  `sala_id` bigint unsigned DEFAULT NULL,
  `tipo_agendamento` enum('Consulta Externa','Consulta de Urgência','Exame Laboratorial','Exame Radiológico','Procedimento Cirúrgico','Vacinação','Consulta Pré-Natal','Retorno') COLLATE utf8mb4_unicode_ci NOT NULL,
  `especialidade` enum('Clínica Geral','Pediatria','Ginecologia/Obstetrícia','Cardiologia','Ortopedia','Oftalmologia','Dermatologia','Neurologia','Psiquiatria','Urologia','Cirurgia Geral','Medicina Interna','Estomatologia') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `data_agendamento` date NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fim` time DEFAULT NULL COMMENT 'Calculado automaticamente (30-60min)',
  `duracao_minutos` int NOT NULL DEFAULT '30',
  `status` enum('Agendado','Confirmado','Em Atendimento','Concluído','Cancelado pelo Paciente','Cancelado pelo Hospital','Faltou','Remarcado') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Agendado',
  `prioridade` enum('Emergência','Muito Urgente','Urgente','Pouco Urgente','Não Urgente') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `motivo_consulta` text COLLATE utf8mb4_unicode_ci,
  `observacoes` text COLLATE utf8mb4_unicode_ci,
  `hora_chegada_paciente` timestamp NULL DEFAULT NULL,
  `hora_inicio_atendimento` timestamp NULL DEFAULT NULL,
  `hora_fim_atendimento` timestamp NULL DEFAULT NULL,
  `diagnostico` text COLLATE utf8mb4_unicode_ci,
  `prescricao_medica` text COLLATE utf8mb4_unicode_ci,
  `exames_solicitados` text COLLATE utf8mb4_unicode_ci,
  `requer_retorno` tinyint(1) NOT NULL DEFAULT '0',
  `data_retorno_sugerida` date DEFAULT NULL,
  `agendamento_origem_id` bigint unsigned DEFAULT NULL,
  `valor_consulta` decimal(10,2) NOT NULL DEFAULT '0.00',
  `pago` tinyint(1) NOT NULL DEFAULT '0',
  `numero_recibo` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `agendado_por` bigint unsigned NOT NULL,
  `atendido_por` bigint unsigned DEFAULT NULL,
  `ip_agendamento` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_medico_horario` (`medico_id`,`data_agendamento`,`hora_inicio`),
  KEY `agendamentos_agendamento_origem_id_foreign` (`agendamento_origem_id`),
  KEY `agendamentos_agendado_por_foreign` (`agendado_por`),
  KEY `agendamentos_atendido_por_foreign` (`atendido_por`),
  KEY `agendamentos_data_agendamento_status_index` (`data_agendamento`,`status`),
  KEY `agendamentos_medico_id_data_agendamento_hora_inicio_index` (`medico_id`,`data_agendamento`,`hora_inicio`),
  KEY `agendamentos_sala_id_data_agendamento_index` (`sala_id`,`data_agendamento`),
  KEY `agendamentos_paciente_id_index` (`paciente_id`),
  KEY `agendamentos_status_index` (`status`),
  CONSTRAINT `agendamentos_agendado_por_foreign` FOREIGN KEY (`agendado_por`) REFERENCES `utilizadores` (`id`),
  CONSTRAINT `agendamentos_agendamento_origem_id_foreign` FOREIGN KEY (`agendamento_origem_id`) REFERENCES `agendamentos` (`id`),
  CONSTRAINT `agendamentos_atendido_por_foreign` FOREIGN KEY (`atendido_por`) REFERENCES `utilizadores` (`id`),
  CONSTRAINT `agendamentos_medico_id_foreign` FOREIGN KEY (`medico_id`) REFERENCES `utilizadores` (`id`),
  CONSTRAINT `agendamentos_paciente_id_foreign` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `agendamentos_sala_id_foreign` FOREIGN KEY (`sala_id`) REFERENCES `salas_consultorio` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agendamentos`
--

LOCK TABLES `agendamentos` WRITE;
/*!40000 ALTER TABLE `agendamentos` DISABLE KEYS */;
/*!40000 ALTER TABLE `agendamentos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `anamneses`
--

DROP TABLE IF EXISTS `anamneses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `anamneses` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `consulta_id` bigint unsigned NOT NULL,
  `paciente_id` bigint unsigned NOT NULL,
  `queixa_principal` text COLLATE utf8mb4_unicode_ci COMMENT 'Motivo da consulta',
  `historia_doenca_atual` text COLLATE utf8mb4_unicode_ci COMMENT 'HDA - História detalhada',
  `revisao_sistemas` json DEFAULT NULL,
  `historia_patologica_pregressa` text COLLATE utf8mb4_unicode_ci COMMENT 'Doenças anteriores',
  `historia_cirurgica` text COLLATE utf8mb4_unicode_ci COMMENT 'Cirurgias realizadas',
  `historia_traumatica` text COLLATE utf8mb4_unicode_ci COMMENT 'Acidentes, fraturas',
  `historia_alergica` text COLLATE utf8mb4_unicode_ci COMMENT 'Alergias medicamentosas/alimentares',
  `historia_familiar` text COLLATE utf8mb4_unicode_ci COMMENT 'Doenças na família',
  `habitos_vida` json DEFAULT NULL,
  `medicacoes_uso` text COLLATE utf8mb4_unicode_ci COMMENT 'Medicamentos que usa atualmente',
  `gestacoes` int DEFAULT NULL,
  `partos` int DEFAULT NULL,
  `cesarianas` int DEFAULT NULL,
  `abortos` int DEFAULT NULL,
  `data_ultima_menstruacao` date DEFAULT NULL COMMENT 'DUM',
  `idade_menarca` int DEFAULT NULL,
  `idade_menopausa` int DEFAULT NULL,
  `profissao_atual` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `exposicao_ocupacional` text COLLATE utf8mb4_unicode_ci COMMENT 'Riscos no trabalho',
  `observacoes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `anamneses_consulta_id_index` (`consulta_id`),
  KEY `anamneses_paciente_id_index` (`paciente_id`),
  CONSTRAINT `anamneses_consulta_id_foreign` FOREIGN KEY (`consulta_id`) REFERENCES `consultas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `anamneses_paciente_id_foreign` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `anamneses`
--

LOCK TABLES `anamneses` WRITE;
/*!40000 ALTER TABLE `anamneses` DISABLE KEYS */;
/*!40000 ALTER TABLE `anamneses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `artigos_stock`
--

DROP TABLE IF EXISTS `artigos_stock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `artigos_stock` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `codigo_artigo` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Código interno ou código de barras',
  `nome_artigo` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descricao` text COLLATE utf8mb4_unicode_ci,
  `categoria` enum('Medicamento','Material Clínico Descartável','Material Clínico Reutilizável','Equipamento Médico','Material de Limpeza','Material de Escritório','Peças de Manutenção','EPI - Equipamento de Protecção Individual','Reagentes Laboratoriais') COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo_medicamento` enum('Antibiótico','Analgésico','Anti-inflamatório','Antitérmico','Anti-hipertensivo','Antidiabético','Vacina','Soro/Solução','Outro') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `localizacao_stock` enum('Farmácia Central','Farmácia Ambulatório','Armazém Geral','Urgência','Bloco Cirúrgico','Laboratório','Manutenção','Quarentena') COLLATE utf8mb4_unicode_ci NOT NULL,
  `prateleira` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lote_atual` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `data_validade` date DEFAULT NULL,
  `quantidade_stock` decimal(10,2) NOT NULL DEFAULT '0.00',
  `unidade_medida` enum('Unidade','Caixa','Frasco','Ampola','Comprimido','Litro','Mililitro','Grama','Kilograma','Metro','Rolo') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Unidade',
  `stock_minimo` decimal(10,2) NOT NULL DEFAULT '10.00',
  `stock_maximo` decimal(10,2) NOT NULL DEFAULT '1000.00',
  `preco_compra` decimal(10,2) NOT NULL DEFAULT '0.00',
  `preco_venda` decimal(10,2) NOT NULL DEFAULT '0.00',
  `valor_total_stock` decimal(12,2) GENERATED ALWAYS AS ((`quantidade_stock` * `preco_compra`)) VIRTUAL,
  `fornecedor_principal` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `codigo_fornecedor` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `requer_receita_medica` tinyint(1) NOT NULL DEFAULT '0',
  `controlado_anvisa` tinyint(1) NOT NULL DEFAULT '0',
  `refrigeracao_necessaria` tinyint(1) NOT NULL DEFAULT '0',
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `total_entradas` int NOT NULL DEFAULT '0',
  `total_saidas` int NOT NULL DEFAULT '0',
  `data_ultima_entrada` date DEFAULT NULL,
  `data_ultima_saida` date DEFAULT NULL,
  `registado_por` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `artigos_stock_codigo_artigo_unique` (`codigo_artigo`),
  KEY `artigos_stock_registado_por_foreign` (`registado_por`),
  KEY `artigos_stock_codigo_artigo_index` (`codigo_artigo`),
  KEY `artigos_stock_categoria_index` (`categoria`),
  KEY `artigos_stock_localizacao_stock_index` (`localizacao_stock`),
  KEY `artigos_stock_data_validade_index` (`data_validade`),
  FULLTEXT KEY `artigos_stock_nome_artigo_fulltext` (`nome_artigo`),
  CONSTRAINT `artigos_stock_registado_por_foreign` FOREIGN KEY (`registado_por`) REFERENCES `utilizadores` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `artigos_stock`
--

LOCK TABLES `artigos_stock` WRITE;
/*!40000 ALTER TABLE `artigos_stock` DISABLE KEYS */;
INSERT INTO `artigos_stock` (`id`, `codigo_artigo`, `nome_artigo`, `descricao`, `categoria`, `tipo_medicamento`, `localizacao_stock`, `prateleira`, `lote_atual`, `data_validade`, `quantidade_stock`, `unidade_medida`, `stock_minimo`, `stock_maximo`, `preco_compra`, `preco_venda`, `fornecedor_principal`, `codigo_fornecedor`, `requer_receita_medica`, `controlado_anvisa`, `refrigeracao_necessaria`, `activo`, `total_entradas`, `total_saidas`, `data_ultima_entrada`, `data_ultima_saida`, `registado_por`, `created_at`, `updated_at`, `deleted_at`) VALUES (1,'MED-000001','Paracetamol 500mg','Medicamento para uso hospitalar','Medicamento','Analgésico','Farmácia Central','A4','LOT-2024-001','2026-12-31',500.00,'Comprimido',50.00,1000.00,0.50,1.00,'Farmacêutica Angolana Lda.',NULL,0,0,0,1,0,0,NULL,NULL,7,'2026-01-17 07:45:57','2026-01-17 07:45:57',NULL),(2,'MED-000002','Amoxicilina 500mg','Medicamento para uso hospitalar','Medicamento','Antibiótico','Farmácia Central','A3','LOT-2024-002','2025-06-30',300.00,'Comprimido',50.00,1000.00,2.00,4.50,'Farmacêutica Angolana Lda.',NULL,1,0,0,1,0,0,NULL,NULL,7,'2026-01-17 07:45:57','2026-01-17 07:45:57',NULL),(3,'MED-000003','Ibuprofeno 400mg','Medicamento para uso hospitalar','Medicamento','Anti-inflamatório','Farmácia Central','A1','LOT-2024-003','2026-03-15',450.00,'Comprimido',50.00,1000.00,0.80,1.80,'Farmacêutica Angolana Lda.',NULL,0,0,0,1,0,0,NULL,NULL,7,'2026-01-17 07:45:58','2026-01-17 07:45:58',NULL),(4,'MED-000004','Soro Fisiológico 500ml','Medicamento para uso hospitalar','Medicamento','Soro/Solução','Farmácia Central','A1','LOT-2024-004','2027-01-31',200.00,'Frasco',50.00,1000.00,3.00,6.00,'Farmacêutica Angolana Lda.',NULL,0,0,0,1,0,0,NULL,NULL,7,'2026-01-17 07:45:58','2026-01-17 07:45:58',NULL);
/*!40000 ALTER TABLE `artigos_stock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `consultas`
--

DROP TABLE IF EXISTS `consultas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `consultas` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `agendamento_id` bigint unsigned NOT NULL,
  `paciente_id` bigint unsigned NOT NULL,
  `medico_id` bigint unsigned NOT NULL,
  `numero_consulta` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Ex: CONS-2026-000001',
  `data_consulta` date NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fim` time DEFAULT NULL,
  `tipo_consulta` enum('Primeira Consulta','Retorno','Urgência','Emergência') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Primeira Consulta',
  `status` enum('Em Andamento','Concluída','Cancelada') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Em Andamento',
  `motivo_consulta` text COLLATE utf8mb4_unicode_ci,
  `observacoes_gerais` text COLLATE utf8mb4_unicode_ci,
  `conduta_medica` text COLLATE utf8mb4_unicode_ci COMMENT 'Plano terapêutico',
  `orientacoes_paciente` text COLLATE utf8mb4_unicode_ci,
  `retorno_necessario` tinyint(1) NOT NULL DEFAULT '0',
  `data_retorno_sugerida` date DEFAULT NULL,
  `motivo_retorno` text COLLATE utf8mb4_unicode_ci,
  `criado_por` bigint unsigned NOT NULL,
  `atualizado_por` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `consultas_numero_consulta_unique` (`numero_consulta`),
  KEY `consultas_agendamento_id_foreign` (`agendamento_id`),
  KEY `consultas_criado_por_foreign` (`criado_por`),
  KEY `consultas_atualizado_por_foreign` (`atualizado_por`),
  KEY `consultas_data_consulta_status_index` (`data_consulta`,`status`),
  KEY `consultas_paciente_id_data_consulta_index` (`paciente_id`,`data_consulta`),
  KEY `consultas_medico_id_index` (`medico_id`),
  KEY `consultas_numero_consulta_index` (`numero_consulta`),
  CONSTRAINT `consultas_agendamento_id_foreign` FOREIGN KEY (`agendamento_id`) REFERENCES `agendamentos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `consultas_atualizado_por_foreign` FOREIGN KEY (`atualizado_por`) REFERENCES `utilizadores` (`id`) ON DELETE SET NULL,
  CONSTRAINT `consultas_criado_por_foreign` FOREIGN KEY (`criado_por`) REFERENCES `utilizadores` (`id`) ON DELETE CASCADE,
  CONSTRAINT `consultas_medico_id_foreign` FOREIGN KEY (`medico_id`) REFERENCES `utilizadores` (`id`) ON DELETE CASCADE,
  CONSTRAINT `consultas_paciente_id_foreign` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `consultas`
--

LOCK TABLES `consultas` WRITE;
/*!40000 ALTER TABLE `consultas` DISABLE KEYS */;
/*!40000 ALTER TABLE `consultas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `diagnosticos`
--

DROP TABLE IF EXISTS `diagnosticos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `diagnosticos` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `consulta_id` bigint unsigned NOT NULL,
  `paciente_id` bigint unsigned NOT NULL,
  `cid10_codigo` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Ex: I10, E11.9, J18.9',
  `cid10_descricao` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Descrição do CID-10',
  `cid10_categoria` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tipo_diagnostico` enum('Principal','Secundário','Diferencial','Presumível','Confirmado') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Principal',
  `gravidade` enum('Leve','Moderada','Grave','Crítica') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `doenca_cronica` tinyint(1) NOT NULL DEFAULT '0',
  `doenca_infectocontagiosa` tinyint(1) NOT NULL DEFAULT '0',
  `notificacao_compulsoria` tinyint(1) NOT NULL DEFAULT '0',
  `observacoes` text COLLATE utf8mb4_unicode_ci,
  `justificativa` text COLLATE utf8mb4_unicode_ci,
  `data_diagnostico` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `diagnosticos_consulta_id_index` (`consulta_id`),
  KEY `diagnosticos_paciente_id_index` (`paciente_id`),
  KEY `diagnosticos_cid10_codigo_index` (`cid10_codigo`),
  KEY `diagnosticos_paciente_id_cid10_codigo_index` (`paciente_id`,`cid10_codigo`),
  CONSTRAINT `diagnosticos_consulta_id_foreign` FOREIGN KEY (`consulta_id`) REFERENCES `consultas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `diagnosticos_paciente_id_foreign` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `diagnosticos`
--

LOCK TABLES `diagnosticos` WRITE;
/*!40000 ALTER TABLE `diagnosticos` DISABLE KEYS */;
/*!40000 ALTER TABLE `diagnosticos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exames_fisicos`
--

DROP TABLE IF EXISTS `exames_fisicos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exames_fisicos` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `consulta_id` bigint unsigned NOT NULL,
  `paciente_id` bigint unsigned NOT NULL,
  `peso` decimal(5,2) DEFAULT NULL COMMENT 'Peso em kg',
  `altura` decimal(3,2) DEFAULT NULL COMMENT 'Altura em metros',
  `imc` decimal(4,2) DEFAULT NULL COMMENT 'Índice de Massa Corporal (calculado)',
  `classificacao_imc` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pressao_arterial` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Ex: 120/80 mmHg',
  `frequencia_cardiaca` int DEFAULT NULL COMMENT 'bpm',
  `frequencia_respiratoria` int DEFAULT NULL COMMENT 'rpm',
  `temperatura` decimal(3,1) DEFAULT NULL COMMENT '°C',
  `saturacao_oxigenio` int DEFAULT NULL COMMENT '% - SpO2',
  `perimetro_abdominal` decimal(5,2) DEFAULT NULL COMMENT 'cm',
  `perimetro_cefalico` decimal(5,2) DEFAULT NULL COMMENT 'cm',
  `estado_geral` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado_consciencia` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `postura_atitude` text COLLATE utf8mb4_unicode_ci,
  `hidratacao` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `coloracao_pele` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `exame_segmentar` json DEFAULT NULL,
  `observacoes_exame` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `exames_fisicos_consulta_id_index` (`consulta_id`),
  KEY `exames_fisicos_paciente_id_index` (`paciente_id`),
  CONSTRAINT `exames_fisicos_consulta_id_foreign` FOREIGN KEY (`consulta_id`) REFERENCES `consultas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `exames_fisicos_paciente_id_foreign` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exames_fisicos`
--

LOCK TABLES `exames_fisicos` WRITE;
/*!40000 ALTER TABLE `exames_fisicos` DISABLE KEYS */;
/*!40000 ALTER TABLE `exames_fisicos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exames_solicitados`
--

DROP TABLE IF EXISTS `exames_solicitados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exames_solicitados` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `consulta_id` bigint unsigned NOT NULL,
  `paciente_id` bigint unsigned NOT NULL,
  `medico_solicitante_id` bigint unsigned NOT NULL,
  `numero_pedido` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `data_solicitacao` date NOT NULL,
  `tipo_exame` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `categoria` enum('Laboratorial','Imagiologia','Cardiológico','Endoscópico','Anatomopatológico','Outro') COLLATE utf8mb4_unicode_ci NOT NULL,
  `prioridade` enum('Normal','Urgente','Emergência') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Normal',
  `material_necessario` text COLLATE utf8mb4_unicode_ci,
  `preparo_paciente` text COLLATE utf8mb4_unicode_ci,
  `indicacao_clinica` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `informacoes_clinicas_relevantes` text COLLATE utf8mb4_unicode_ci,
  `status` enum('Pendente','Agendado','Em Análise','Concluído','Cancelado') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Pendente',
  `data_agendamento` date DEFAULT NULL,
  `data_realizacao` date DEFAULT NULL,
  `data_resultado` date DEFAULT NULL,
  `resultado_texto` text COLLATE utf8mb4_unicode_ci,
  `interpretacao` text COLLATE utf8mb4_unicode_ci,
  `arquivo_resultado` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `realizado_por` bigint unsigned DEFAULT NULL,
  `laudado_por` bigint unsigned DEFAULT NULL,
  `local_realizacao` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `observacoes` text COLLATE utf8mb4_unicode_ci,
  `motivo_cancelamento` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `exames_solicitados_numero_pedido_unique` (`numero_pedido`),
  KEY `exames_solicitados_consulta_id_foreign` (`consulta_id`),
  KEY `exames_solicitados_realizado_por_foreign` (`realizado_por`),
  KEY `exames_solicitados_laudado_por_foreign` (`laudado_por`),
  KEY `exames_solicitados_numero_pedido_index` (`numero_pedido`),
  KEY `exames_solicitados_paciente_id_status_index` (`paciente_id`,`status`),
  KEY `exames_solicitados_medico_solicitante_id_data_solicitacao_index` (`medico_solicitante_id`,`data_solicitacao`),
  KEY `exames_solicitados_categoria_index` (`categoria`),
  KEY `exames_solicitados_prioridade_index` (`prioridade`),
  CONSTRAINT `exames_solicitados_consulta_id_foreign` FOREIGN KEY (`consulta_id`) REFERENCES `consultas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `exames_solicitados_laudado_por_foreign` FOREIGN KEY (`laudado_por`) REFERENCES `utilizadores` (`id`) ON DELETE SET NULL,
  CONSTRAINT `exames_solicitados_medico_solicitante_id_foreign` FOREIGN KEY (`medico_solicitante_id`) REFERENCES `utilizadores` (`id`) ON DELETE CASCADE,
  CONSTRAINT `exames_solicitados_paciente_id_foreign` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `exames_solicitados_realizado_por_foreign` FOREIGN KEY (`realizado_por`) REFERENCES `utilizadores` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exames_solicitados`
--

LOCK TABLES `exames_solicitados` WRITE;
/*!40000 ALTER TABLE `exames_solicitados` DISABLE KEYS */;
/*!40000 ALTER TABLE `exames_solicitados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `itens_prescricao`
--

DROP TABLE IF EXISTS `itens_prescricao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `itens_prescricao` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `prescricao_id` bigint unsigned NOT NULL,
  `artigo_stock_id` bigint unsigned DEFAULT NULL,
  `nome_medicamento` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `principio_ativo` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `concentracao` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `forma_farmaceutica` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `via_administracao` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `posologia` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `frequencia` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `duracao_tratamento` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `quantidade_prescrita` decimal(8,2) NOT NULL,
  `unidade` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'unidade',
  `instrucoes_uso` text COLLATE utf8mb4_unicode_ci,
  `uso_continuo` tinyint(1) NOT NULL DEFAULT '0',
  `observacoes` text COLLATE utf8mb4_unicode_ci,
  `quantidade_dispensada` decimal(8,2) NOT NULL DEFAULT '0.00',
  `dispensado_completo` tinyint(1) NOT NULL DEFAULT '0',
  `tem_interacao` tinyint(1) NOT NULL DEFAULT '0',
  `descricao_interacao` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `itens_prescricao_prescricao_id_index` (`prescricao_id`),
  KEY `itens_prescricao_artigo_stock_id_index` (`artigo_stock_id`),
  CONSTRAINT `itens_prescricao_artigo_stock_id_foreign` FOREIGN KEY (`artigo_stock_id`) REFERENCES `artigos_stock` (`id`) ON DELETE SET NULL,
  CONSTRAINT `itens_prescricao_prescricao_id_foreign` FOREIGN KEY (`prescricao_id`) REFERENCES `prescricoes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `itens_prescricao`
--

LOCK TABLES `itens_prescricao` WRITE;
/*!40000 ALTER TABLE `itens_prescricao` DISABLE KEYS */;
/*!40000 ALTER TABLE `itens_prescricao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2026_01_01_080139_salas_e__consultorios',1),(5,'2026_01_17_075959_utilizadores',1),(6,'2026_01_17_080101_pacientes',1),(7,'2026_01_17_080117_agendamentos',1),(8,'2026_01_17_080215_artigos_de_stock',1),(9,'2026_01_18_080300_documentos_oficiais',1),(10,'2026_01_18_073604_consultas',2),(11,'2026_01_18_073755_anamneses',2),(12,'2026_01_18_074015_exames_fisicos',2),(13,'2026_01_18_074107_diagnosticos',2),(14,'2026_01_18_074156_prescricoes',2),(15,'2026_01_18_074300_itens_prescricoes',2),(16,'2026_01_18_074418_exames_solicitados',2);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movimentos_stock`
--

DROP TABLE IF EXISTS `movimentos_stock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movimentos_stock` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `artigo_id` bigint unsigned NOT NULL,
  `tipo_movimento` enum('Entrada - Compra','Entrada - Doação','Entrada - Transferência','Entrada - Devolução','Saída - Venda','Saída - Consumo Interno','Saída - Transferência','Saída - Perda/Expiração','Saída - Roubo/Quebra','Ajuste de Inventário') COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantidade` decimal(10,2) NOT NULL,
  `sentido` enum('Entrada','Saída') COLLATE utf8mb4_unicode_ci NOT NULL,
  `numero_documento` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'NF, Guia, Requisição',
  `paciente_id` bigint unsigned DEFAULT NULL,
  `agendamento_id` bigint unsigned DEFAULT NULL,
  `origem_destino` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Fornecedor ou Departamento',
  `preco_unitario` decimal(10,2) NOT NULL DEFAULT '0.00',
  `valor_total` decimal(12,2) GENERATED ALWAYS AS ((`quantidade` * `preco_unitario`)) VIRTUAL,
  `motivo` text COLLATE utf8mb4_unicode_ci,
  `observacoes` text COLLATE utf8mb4_unicode_ci,
  `registado_por` bigint unsigned NOT NULL,
  `data_movimento` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `movimentos_stock_agendamento_id_foreign` (`agendamento_id`),
  KEY `movimentos_stock_registado_por_foreign` (`registado_por`),
  KEY `movimentos_stock_artigo_id_index` (`artigo_id`),
  KEY `movimentos_stock_tipo_movimento_index` (`tipo_movimento`),
  KEY `movimentos_stock_data_movimento_index` (`data_movimento`),
  KEY `movimentos_stock_paciente_id_data_movimento_index` (`paciente_id`,`data_movimento`),
  CONSTRAINT `movimentos_stock_agendamento_id_foreign` FOREIGN KEY (`agendamento_id`) REFERENCES `agendamentos` (`id`),
  CONSTRAINT `movimentos_stock_artigo_id_foreign` FOREIGN KEY (`artigo_id`) REFERENCES `artigos_stock` (`id`),
  CONSTRAINT `movimentos_stock_paciente_id_foreign` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`),
  CONSTRAINT `movimentos_stock_registado_por_foreign` FOREIGN KEY (`registado_por`) REFERENCES `utilizadores` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movimentos_stock`
--

LOCK TABLES `movimentos_stock` WRITE;
/*!40000 ALTER TABLE `movimentos_stock` DISABLE KEYS */;
/*!40000 ALTER TABLE `movimentos_stock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pacientes`
--

DROP TABLE IF EXISTS `pacientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pacientes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `bi_numero` varchar(14) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Bilhete de Identidade Angolano',
  `numero_processo` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Número interno do hospital',
  `nome_completo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `data_nascimento` date NOT NULL,
  `genero` enum('Masculino','Feminino') COLLATE utf8mb4_unicode_ci NOT NULL,
  `estado_civil` enum('Solteiro(a)','Casado(a)','Divorciado(a)','Viúvo(a)','União de Facto') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telefone_principal` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefone_alternativo` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contacto_emergencia_nome` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contacto_emergencia_telefone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contacto_emergencia_relacao` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `provincia` enum('Luanda','Bengo','Benguela','Bié','Cabinda','Cuando Cubango','Cuanza Norte','Cuanza Sul','Cunene','Huambo','Huíla','Lunda Norte','Lunda Sul','Malanje','Moxico','Namibe','Uíge','Zaire') COLLATE utf8mb4_unicode_ci NOT NULL,
  `municipio` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bairro` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `endereco_completo` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `grupo_sanguineo` enum('A+','A-','B+','B-','AB+','AB-','O+','O-') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alergias_conhecidas` text COLLATE utf8mb4_unicode_ci,
  `doencas_cronicas` text COLLATE utf8mb4_unicode_ci,
  `cirurgias_anteriores` text COLLATE utf8mb4_unicode_ci,
  `medicacao_habitual` text COLLATE utf8mb4_unicode_ci,
  `profissao` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `empregador` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tipo_seguro` enum('Particular','Seguro Privado','INSS','INAPEM','Empresarial','Nenhum') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Particular',
  `numero_apolice_seguro` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `paciente_risco` tinyint(1) NOT NULL DEFAULT '0',
  `status_ultimo_atendimento` enum('Alta Médica','Internado','Transferido','Óbito','Aguardando Consulta') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `total_consultas` int NOT NULL DEFAULT '0',
  `total_internamentos` int NOT NULL DEFAULT '0',
  `data_primeira_consulta` date DEFAULT NULL,
  `data_ultima_consulta` date DEFAULT NULL,
  `registado_por` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `pacientes_bi_numero_unique` (`bi_numero`),
  UNIQUE KEY `pacientes_numero_processo_unique` (`numero_processo`),
  KEY `pacientes_registado_por_foreign` (`registado_por`),
  KEY `pacientes_bi_numero_index` (`bi_numero`),
  KEY `pacientes_numero_processo_index` (`numero_processo`),
  KEY `pacientes_provincia_index` (`provincia`),
  FULLTEXT KEY `pacientes_nome_completo_fulltext` (`nome_completo`),
  CONSTRAINT `pacientes_registado_por_foreign` FOREIGN KEY (`registado_por`) REFERENCES `utilizadores` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pacientes`
--

LOCK TABLES `pacientes` WRITE;
/*!40000 ALTER TABLE `pacientes` DISABLE KEYS */;
/*!40000 ALTER TABLE `pacientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prescricoes`
--

DROP TABLE IF EXISTS `prescricoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prescricoes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `consulta_id` bigint unsigned NOT NULL,
  `paciente_id` bigint unsigned NOT NULL,
  `medico_id` bigint unsigned NOT NULL,
  `numero_receita` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Ex: REC-2026-000001',
  `data_emissao` date NOT NULL,
  `validade_dias` int NOT NULL DEFAULT '30',
  `data_validade` date NOT NULL,
  `tipo_receita` enum('Comum','Controlada','Antimicrobiano','Especial') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Comum',
  `status` enum('Ativa','Dispensada','Expirada','Cancelada') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Ativa',
  `uso_continuo` tinyint(1) NOT NULL DEFAULT '0',
  `observacoes` text COLLATE utf8mb4_unicode_ci,
  `orientacoes_paciente` text COLLATE utf8mb4_unicode_ci,
  `data_dispensacao` datetime DEFAULT NULL,
  `dispensado_por` bigint unsigned DEFAULT NULL,
  `farmacia_dispensacao` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `arquivo_pdf` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `motivo_cancelamento` text COLLATE utf8mb4_unicode_ci,
  `data_cancelamento` datetime DEFAULT NULL,
  `cancelado_por` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `prescricoes_numero_receita_unique` (`numero_receita`),
  KEY `prescricoes_consulta_id_foreign` (`consulta_id`),
  KEY `prescricoes_dispensado_por_foreign` (`dispensado_por`),
  KEY `prescricoes_cancelado_por_foreign` (`cancelado_por`),
  KEY `prescricoes_numero_receita_index` (`numero_receita`),
  KEY `prescricoes_paciente_id_status_index` (`paciente_id`,`status`),
  KEY `prescricoes_medico_id_data_emissao_index` (`medico_id`,`data_emissao`),
  KEY `prescricoes_data_validade_index` (`data_validade`),
  CONSTRAINT `prescricoes_cancelado_por_foreign` FOREIGN KEY (`cancelado_por`) REFERENCES `utilizadores` (`id`) ON DELETE SET NULL,
  CONSTRAINT `prescricoes_consulta_id_foreign` FOREIGN KEY (`consulta_id`) REFERENCES `consultas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `prescricoes_dispensado_por_foreign` FOREIGN KEY (`dispensado_por`) REFERENCES `utilizadores` (`id`) ON DELETE SET NULL,
  CONSTRAINT `prescricoes_medico_id_foreign` FOREIGN KEY (`medico_id`) REFERENCES `utilizadores` (`id`) ON DELETE CASCADE,
  CONSTRAINT `prescricoes_paciente_id_foreign` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prescricoes`
--

LOCK TABLES `prescricoes` WRITE;
/*!40000 ALTER TABLE `prescricoes` DISABLE KEYS */;
/*!40000 ALTER TABLE `prescricoes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `salas_consultorio`
--

DROP TABLE IF EXISTS `salas_consultorio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `salas_consultorio` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `codigo_sala` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Ex: CONS-01, URG-02',
  `nome_sala` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo_sala` enum('Consultório Médico','Sala de Urgência','Sala de Exames','Sala Cirúrgica','Sala de Observação','Laboratório','Radiologia') COLLATE utf8mb4_unicode_ci NOT NULL,
  `departamento` enum('Serviço de Consulta Externa (SCE)','Serviço de Urgência (SU)','Laboratório','Radiologia','Cirurgia') COLLATE utf8mb4_unicode_ci NOT NULL,
  `andar` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bloco` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `capacidade` int NOT NULL DEFAULT '1',
  `activa` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `salas_consultorio_codigo_sala_unique` (`codigo_sala`),
  KEY `salas_consultorio_tipo_sala_index` (`tipo_sala`),
  KEY `salas_consultorio_departamento_activa_index` (`departamento`,`activa`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salas_consultorio`
--

LOCK TABLES `salas_consultorio` WRITE;
/*!40000 ALTER TABLE `salas_consultorio` DISABLE KEYS */;
INSERT INTO `salas_consultorio` VALUES (1,'CONS-01','Consultório Pediatria','Consultório Médico','Serviço de Consulta Externa (SCE)','1º Andar','Bloco A',1,1,'2026-01-17 07:45:57','2026-01-17 07:45:57'),(2,'CONS-02','Consultório Cardiologia','Consultório Médico','Serviço de Consulta Externa (SCE)','1º Andar','Bloco A',1,1,'2026-01-17 07:45:57','2026-01-17 07:45:57'),(3,'CONS-03','Consultório Ginecologia','Consultório Médico','Serviço de Consulta Externa (SCE)','1º Andar','Bloco A',1,1,'2026-01-17 07:45:57','2026-01-17 07:45:57'),(4,'URG-01','Sala Urgência 1','Sala de Urgência','Serviço de Urgência (SU)','1º Andar','Bloco A',1,1,'2026-01-17 07:45:57','2026-01-17 07:45:57'),(5,'URG-02','Sala Urgência 2','Sala de Urgência','Serviço de Urgência (SU)','1º Andar','Bloco A',1,1,'2026-01-17 07:45:57','2026-01-17 07:45:57'),(6,'LAB-01','Laboratório Análises Clínicas','Laboratório','Laboratório','1º Andar','Bloco A',1,1,'2026-01-17 07:45:57','2026-01-17 07:45:57'),(7,'RAD-01','Sala Radiologia','Sala de Exames','Radiologia','1º Andar','Bloco A',1,1,'2026-01-17 07:45:57','2026-01-17 07:45:57');
/*!40000 ALTER TABLE `salas_consultorio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('LxfCTCBNyCtPNhDpgKAKcPiF9XFPCKoLJlbT3BVy',12,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTo0OntzOjY6Il90b2tlbiI7czo0MDoiZEhVVnJwb01LU3BVY0pWSFFIeG8xb09aRFhQcERVT0hOTHhtbndEdSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9jb25zdWx0b3Jpby9pbmljaWFyLzEiO31zOjUwOiJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI7aToxMjt9',1768732092);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `utilizadores`
--

DROP TABLE IF EXISTS `utilizadores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `utilizadores` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nome_completo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bi_numero` varchar(14) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Formato: 123456789LA123',
  `data_nascimento` date NOT NULL,
  `genero` enum('Masculino','Feminino') COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefone_principal` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefone_alternativo` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `provincia` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `municipio` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bairro` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `endereco_completo` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `numero_ordem` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Ordem dos Médicos/Enfermeiros',
  `especialidade` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cargo` enum('Médico Especialista','Médico Generalista','Enfermeiro','Técnico de Farmácia','Técnico de Laboratório','Técnico de Radiologia','Administrativo','Gestor de Stock','Director Clínico','Director Geral','Recepcionista','Segurança') COLLATE utf8mb4_unicode_ci NOT NULL,
  `departamento` enum('Direcção Clínica (DC)','Direcção de Enfermagem (DE)','Serviço de Consulta Externa (SCE)','Serviço de Urgência (SU)','Farmácia','Laboratório','Radiologia','Direcção Geral e Financeira (DGF)','Recursos Humanos','Manutenção','Segurança') COLLATE utf8mb4_unicode_ci NOT NULL,
  `nivel_acesso` enum('super_admin','director','medico','enfermeiro','tecnico','administrativo','visualizador') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'visualizador',
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `disponivel_turno` tinyint(1) NOT NULL DEFAULT '1',
  `horario_trabalho` json DEFAULT NULL COMMENT 'JSON com dias e horários',
  `ultimo_acesso` timestamp NULL DEFAULT NULL,
  `ultimo_ip` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `utilizadores_bi_numero_unique` (`bi_numero`),
  UNIQUE KEY `utilizadores_email_unique` (`email`),
  KEY `utilizadores_bi_numero_index` (`bi_numero`),
  KEY `utilizadores_cargo_index` (`cargo`),
  KEY `utilizadores_departamento_index` (`departamento`),
  KEY `utilizadores_nivel_acesso_index` (`nivel_acesso`),
  KEY `utilizadores_activo_disponivel_turno_index` (`activo`,`disponivel_turno`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utilizadores`
--

LOCK TABLES `utilizadores` WRITE;
/*!40000 ALTER TABLE `utilizadores` DISABLE KEYS */;
INSERT INTO `utilizadores` VALUES (1,'Administrador do Sistema','123456789LA001','1980-01-15','Masculino','+244 923 456 789',NULL,'admin@hospital360.ao','Luanda','Luanda',NULL,'Rua Principal, Maianga',NULL,NULL,'Director Geral','Direcção Geral e Financeira (DGF)','super_admin','$2y$12$Fxve8R/WWkSpdUOjyB3Q4OjrB9CfzYtDlbZ22IkEncGZhg5z8Zy.2',NULL,1,1,NULL,NULL,NULL,'2026-01-17 07:45:52','2026-01-17 13:09:59','2026-01-17 13:09:59'),(2,'Dr. João Manuel da Silva','234567890LA002','1975-03-20','Masculino','+244 924 567 890',NULL,'joao.silva@hospital360.ao','Luanda','Luanda',NULL,'Avenida 4 de Fevereiro, Ingombota','OM-2005-1234','Medicina Interna','Director Clínico','Direcção Clínica (DC)','director','$2y$12$j9dIw//DBfHeIQisc6tEdO8BSHDf8npmn9lqK6H/xTutyhdzQDUf.',NULL,1,1,NULL,NULL,NULL,'2026-01-17 07:45:53','2026-01-17 07:45:53',NULL),(3,'Dra. Maria dos Santos','345678901LA003','1985-01-10','Feminino','+244 925 678 901',NULL,'maria.dos.santos@hospital360.ao','Luanda','Luanda',NULL,'Viana, Luanda','OM-2010-5678','Pediatria','Médico Especialista','Serviço de Consulta Externa (SCE)','medico','$2y$12$KnVI/am0ePd7/QT8iZfx2uD673iMybGJkv8ILAZCsR/SKrjAStMe.',NULL,1,1,NULL,NULL,NULL,'2026-01-17 07:45:54','2026-01-17 07:45:54',NULL),(4,'Dr. António Ferreira','456789012LA004','1985-02-10','Masculino','+244 926 678 901',NULL,'antónio.ferreira@hospital360.ao','Luanda','Luanda',NULL,'Viana, Luanda','OM-2008-9012','Cardiologia','Médico Especialista','Serviço de Consulta Externa (SCE)','medico','$2y$12$fmvMkXtxF89aYnsAyH5z3OFi3IJ01DyQ9uIqXM.GWs2cnpnNJRC9i',NULL,1,1,NULL,NULL,NULL,'2026-01-17 07:45:54','2026-01-17 07:45:54',NULL),(5,'Dra. Isabel Nunes','567890123LA005','1985-03-10','Feminino','+244 927 678 901',NULL,'isabel.nunes@hospital360.ao','Luanda','Luanda',NULL,'Viana, Luanda','OM-2012-3456','Ginecologia/Obstetrícia','Médico Especialista','Serviço de Consulta Externa (SCE)','medico','$2y$12$2GYK1NgT6KdacA1KNtoMMewl9NWkL8kqccI6AQFQflTGvvq7LGnS6',NULL,1,1,NULL,NULL,NULL,'2026-01-17 07:45:55','2026-01-17 07:45:55',NULL),(6,'Enf. Rosa Pereira','678901234LA006','1990-05-15','Feminino','+244 928 789 012',NULL,'rosa.pereira@hospital360.ao','Luanda','Luanda',NULL,'Kilamba Kiaxi','OE-2015-7890',NULL,'Enfermeiro','Direcção de Enfermagem (DE)','enfermeiro','$2y$12$2rsfdt9Ipr/dXtg5lB.wQO4SbW4TLse5cGFO9XAdqM.LS7QAdh8aa',NULL,1,1,NULL,NULL,NULL,'2026-01-17 07:45:56','2026-01-17 07:45:56',NULL),(7,'Técnico Paulo Costa','789012345LA007','1992-08-25','Masculino','+244 929 890 123',NULL,'paulo.costa@hospital360.ao','Luanda','Luanda',NULL,'Talatona',NULL,NULL,'Técnico de Farmácia','Farmácia','tecnico','$2y$12$kmUvK18Qzc4hQbuUxqjL/uLc4zHuqL.H9HF6LmiA5GHAaVW5FUFty',NULL,1,1,NULL,NULL,NULL,'2026-01-17 07:45:56','2026-01-17 07:45:56',NULL),(12,'Desenvolvedor Sistema','555555555LA555','1995-01-01','Masculino','999999999',NULL,'dev@vertice.com','Luanda','Luanda',NULL,'Luanda, Angola',NULL,NULL,'Director Geral','Direcção Geral e Financeira (DGF)','super_admin','$2y$12$Sf62IN5iwpf3ccQDuIlR5eIABLlIxssw6oleVZY7LpQs9rYXlfZqG',NULL,1,1,NULL,NULL,NULL,'2026-01-17 14:54:42','2026-01-17 15:13:32',NULL),(14,'Director Geral','725312598LA833','1990-01-01','Masculino','999999999',NULL,'director@hospital360.ao','Luanda','Luanda',NULL,'Luanda, Angola',NULL,NULL,'Director Geral','Direcção Geral e Financeira (DGF)','super_admin','$2y$12$FnNIjmKzevc4RXQ79j2g/OBqOyzWky9S0MxDvvkMXZa3JVefcwdcu',NULL,1,1,NULL,NULL,NULL,'2026-01-17 15:13:35','2026-01-17 15:13:35',NULL);
/*!40000 ALTER TABLE `utilizadores` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-19 11:37:55
